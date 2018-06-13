import { getWalletLib } from 'shared/enclave/server/wallets';
import { SignTransactionParams, SignTransactionResponse } from 'shared/enclave/types';

export default async function(params: SignTransactionParams): Promise<SignTransactionResponse> {
  const wallet = getWalletLib(params.walletType);
  return wallet.signTransaction(params.transaction, params.path);
}
