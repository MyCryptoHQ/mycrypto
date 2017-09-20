import { PrivKeyWallet } from 'libs/wallet';

/*** Generate Wallet File ***/
export interface GenerateNewWalletAction {
  type: 'GENERATE_WALLET_GENERATE_WALLET';
  wallet: PrivKeyWallet;
  password: string;
}

export function generateNewWallet(password: string): GenerateNewWalletAction {
  return {
    type: 'GENERATE_WALLET_GENERATE_WALLET',
    wallet: PrivKeyWallet.generate(),
    password
  };
}

/*** Confirm Continue To Paper ***/
export interface ContinueToPaperAction {
  type: 'GENERATE_WALLET_CONTINUE_TO_PAPER';
}

export function continueToPaper(): ContinueToPaperAction {
  return { type: 'GENERATE_WALLET_CONTINUE_TO_PAPER' };
}

/*** Reset Generate Wallet ***/
export interface ResetGenerateWalletAction {
  type: 'GENERATE_WALLET_RESET';
}

export function resetGenerateWallet(): ResetGenerateWalletAction {
  return { type: 'GENERATE_WALLET_RESET' };
}

/*** Action Union ***/
export type GenerateWalletAction =
  | GenerateNewWalletAction
  | ContinueToPaperAction
  | ResetGenerateWalletAction;
