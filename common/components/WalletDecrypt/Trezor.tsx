import DPATHS from 'config/dpaths';
import { TrezorWallet } from 'libs/wallet';
import React, { Component } from 'react';
import translate, { translateRaw } from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import './Trezor.scss';
import { Spinner } from 'components/ui';
const DEFAULT_PATH = DPATHS.TREZOR[0].value;

interface Props {
  onUnlock(param: any): void;
}
interface State {
  publicKey: string;
  chainCode: string;
  dPath: string;
  error: string | null;
  isLoading: boolean;
  showTip: boolean;
}

export default class TrezorDecrypt extends Component<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: DEFAULT_PATH,
    error: null,
    isLoading: false,
    showTip: false
  };

  public showTip = () => {
    this.setState({
      showTip: true
    });
  };

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading, showTip } = this.state;
    const showErr = error ? 'is-showing' : '';

    return (
      <section className="TrezorDecrypt col-md-4 col-sm-6">
        {showTip && (
          <p>
            <strong>Tip: </strong>Make sure you're logged into the ethereum app on your hardware
            wallet
          </p>
        )}
        <button
          className="TrezorDecrypt-decrypt btn btn-primary btn-lg"
          onClick={this.handleNullConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="TrezorDecrypt-message">
              <Spinner light={true} />
              Unlocking...
            </div>
          ) : (
            translate('ADD_Trezor_scan')
          )}
        </button>

        <div className="TrezorDecrypt-help">
          Guide:{' '}
          <a
            href="https://blog.trezor.io/trezor-integration-with-myetherwallet-3e217a652e08"
            target="_blank"
            rel="noopener"
          >
            How to use TREZOR with MyEtherWallet
          </a>
        </div>

        <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <a
          className="TrezorDecrypt-buy btn btn-sm btn-default"
          href="https://trezor.io/?a=myetherwallet.com"
          target="_blank"
          rel="noopener"
        >
          {translate('Don’t have a TREZOR? Order one now!')}
        </a>

        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={DPATHS.TREZOR}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
          walletType={translateRaw('x_Trezor')}
        />
      </section>
    );
  }

  private handlePathChange = (dPath: string) => {
    this.setState({ dPath });
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: string = this.state.dPath): void => {
    this.setState({
      isLoading: true,
      error: null,
      showTip: false
    });

    // TODO: type vendor file
    (TrezorConnect as any).getXPubKey(
      dPath,
      res => {
        if (res.success) {
          this.setState({
            dPath,
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        } else {
          if (res.error === 'TIMEOUT') {
            this.showTip();
          }
          this.setState({
            error: res.error,
            isLoading: false
          });
        }
      },
      '1.5.2'
    );
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new TrezorWallet(address, this.state.dPath, index));
    this.reset();
  };

  private handleNullConnect = (): void => this.handleConnect();

  private reset() {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: DEFAULT_PATH
    });
  }
}
