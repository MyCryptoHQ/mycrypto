// @flow
import type {
  WalletAction,
  SetWalletAction,
  SetBalanceAction,
  SetTokenBalancesAction
} from 'actions/wallet';
import type { IWallet } from 'libs/wallet';
import Big from 'bignumber.js';
import { getTxFromBroadcastTransactionStatus } from 'selectors/wallet';
import type { BroadcastTransactionStatus } from 'libs/transaction';
import { Ether } from 'libs/units';

export type State = {
  inst: ?IWallet,
  // in ETH
  balance: ?Ether,
  tokens: {
    [string]: Big
  },
  transactions: Array<BroadcastTransactionStatus>
};

export const INITIAL_STATE: State = {
  inst: null,
  balance: null,
  tokens: {},
  transactions: []
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: null, tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const ethBalance = action.payload.toEther();
  return { ...state, balance: ethBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

function handleUpdateTxArray(
  transactions: Array<BroadcastTransactionStatus>,
  broadcastStatusTx: BroadcastTransactionStatus,
  isBroadcasting: boolean,
  successfullyBroadcast: boolean
): Array<BroadcastTransactionStatus> {
  return transactions.map(item => {
    if (item === broadcastStatusTx) {
      return { ...item, isBroadcasting, successfullyBroadcast };
    } else {
      return { ...item };
    }
  });
}

function handleTxBroadcastCompleted(
  state: State,
  signedTx: string,
  successfullyBroadcast: boolean
): Array<BroadcastTransactionStatus> {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  if (existingTx) {
    const isBroadcasting = false;
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  } else {
    return state.transactions;
  }
}

function handleBroadcastTxRequested(state: State, signedTx: string) {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  const isBroadcasting = true;
  const successfullyBroadcast = false;
  if (!existingTx) {
    return state.transactions.concat([
      {
        signedTx,
        isBroadcasting,
        successfullyBroadcast
      }
    ]);
  } else {
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  }
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case 'WALLET_SET':
      return setWallet(state, action);
    case 'WALLET_SET_BALANCE':
      return setBalance(state, action);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    case 'WALLET_BROADCAST_TX_REQUESTED':
      return {
        ...state,
        transactions: handleBroadcastTxRequested(state, action.payload.signedTx)
      };
    case 'WALLET_BROADCAST_TX_SUCCEEDED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          true
        )
      };
    case 'WALLET_BROADCAST_TX_FAILED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          false
        )
      };
    default:
      return state;
  }
}
