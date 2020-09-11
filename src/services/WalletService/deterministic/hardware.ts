import { Transaction as EthTx } from 'ethereumjs-tx';

import { DeterministicWallet, IFullWallet } from '@services';

export interface ChainCodeResponse {
  chainCode: string;
  publicKey: string;
}

export abstract class HardwareWallet extends DeterministicWallet implements IFullWallet {
  // Static functions can't be abstract, so implement an errorous one
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getChainCode(dpath: string): Promise<ChainCodeResponse> {
    throw new Error(`getChainCode is not implemented in ${this.constructor.name}`);
  }

  public abstract signRawTransaction(t: EthTx): Promise<Buffer>;
  public abstract signMessage(msg: string): Promise<string>;
  public abstract displayAddress(): Promise<boolean>;
  public abstract getWalletType(): string;
}
