import React, { PureComponent } from 'react';

import { Button } from '@mycrypto/ui';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import { Spinner } from '@components';
import { EXT_URLS } from '@config';
import { getDPath, getDPaths, INetworkContext, useNetworks } from '@services';
import { ChainCodeResponse, WalletFactory } from '@services/WalletService';
import translate, { translateRaw } from '@translations';
import { DPath, FormData, WalletId } from '@types';
import { withHook } from '@utils';

import DeterministicWallets from './DeterministicWallets';
import './Trezor.scss';
import UnsupportedNetwork from './UnsupportedNetwork';

//@todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// @todo: nearly duplicates ledger component props
interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

const WalletService = WalletFactory(WalletId.TREZOR);

class TrezorDecryptClass extends PureComponent<OwnProps & INetworkContext, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(this.props.getNetworkById(this.props.formData.network), WalletId.TREZOR) ||
      getDPaths(this.props.networks, WalletId.TREZOR)[0],
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, isLoading } = this.state;
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Trezor')} network={network} />;
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            publicKey={publicKey}
            chainCode={chainCode}
            dPath={dPath}
            dPaths={getDPaths(networks, WalletId.TREZOR)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
      );
    } else {
      return (
        <div className="Panel">
          <div className="Panel-title">
            {translate('UNLOCK_WALLET')}{' '}
            {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_TREZOR') })}
          </div>
          <div className="TrezorDecrypt">
            <div className="TrezorDecrypt-description">
              {translate('TREZOR_TIP')}
              <div className="TrezorDecrypt-img">
                <img src={ConnectTrezor} />
              </div>
            </div>
            {/* <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>
              {error || '-'}
            </div> */}

            {isLoading ? (
              <div className="TrezorDecrypt-loading">
                <Spinner /> {translate('WALLET_UNLOCKING')}
              </div>
            ) : (
              <Button
                className="TrezorDecrypt-button"
                onClick={this.handleNullConnect}
                disabled={isLoading}
              >
                {translate('ADD_TREZOR_SCAN')}
              </Button>
            )}
            <div className="TrezorDecrypt-footer">
              {translate('ORDER_TREZOR', { $url: EXT_URLS.TREZOR_REFERRAL.url })} <br />
              {translate('HOWTO_TREZOR')}
            </div>
          </div>
        </div>
      );
    }
  }

  private handlePathChange = (dPath: DPath) => {
    this.setState({ dPath });
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: DPath): void => {
    this.setState({
      isLoading: true,
      error: null
    });

    WalletService.getChainCode(dPath.value)
      .then((res: ChainCodeResponse) => {
        this.setState({
          dPath,
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch((err: any) => {
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(WalletService.init(address, this.state.dPath.value, index));
  };

  private handleNullConnect = (): void => {
    this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: getDPath(network, WalletId.TREZOR) || getDPaths(networks, WalletId.TREZOR)[0]
    });
  }
}

export const TrezorDecrypt = withHook(useNetworks)(TrezorDecryptClass);
