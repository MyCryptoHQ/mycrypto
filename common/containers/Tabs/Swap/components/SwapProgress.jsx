//flow
import React, { Component } from 'react';
import translate from 'translations';
import { bityConfig } from 'api/bity';

export type Props = {
  destinationKind: string,
  destinationAddress: string,
  originKind: string,
  orderStatus: string,
  // actions
  showNotification: any
};

export default class SwapProgress extends Component {
  props: Props;

  state: {
    hasShownViewTx: false
  };

  computedClass(step: number) {
    const {
      orderStatus,
      destinationKind,
      showNotification,
      destinationAddress
    } = this.props;

    let cssClass = 'progress-item';

    switch (orderStatus) {
      case 'OPEN':
        if (step < 2) {
          return cssClass + ' progress-true';
        } else if (step === 2) {
          return cssClass + ' progress-active';
        } else {
          return cssClass;
        }
      case 'RCVE':
        if (step < 4) {
          return cssClass + ' progress-true';
        } else if (step === 4) {
          return cssClass + ' progress-active';
        } else {
          return cssClass;
        }
      case 'FILL':
        if (step < 5) {
          cssClass += ' progress-true';
        } else if (step === 5) {
          cssClass += ' progress-active';
        }

        if (!this.state.hasShownViewTx) {
          let linkElement;
          let link;
          // everything but BTC is a token
          if (destinationKind !== 'BTC') {
            link = bityConfig.ethExplorer.replace(
              '[[txHash]]',
              destinationAddress
            );
            linkElement = `<a href="${link}" target='_blank' rel='noopener'> View your transaction </a>`;
            // BTC uses a different explorer
          } else {
            link = link = bityConfig.btcExplorer.replace(
              '[[txHash]]',
              destinationAddress
            );
            linkElement = `<a href="${link}" target='_blank' rel='noopener'> View your transaction </a>`;
          }

          this.setState({ hasShownViewTx: true }, () => {
            showNotification('success', linkElement);
          });
        }

        return cssClass;

      case 'CANC':
        return cssClass;
      default:
        return cssClass;
    }
  }

  render() {
    const { destinationKind, originKind } = this.props;
    const numberOfConfirmations = originKind === 'BTC' ? '3' : '10';
    return (
      <section className="row swap-progress">
        <div className="sep" />

        <div className={this.computedClass(1)}>
          <div className="progress-circle">
            <i>1</i>
          </div>
          <p>
            {translate('SWAP_progress_1')}
          </p>
        </div>
        <div className={this.computedClass(2)}>
          <div className="progress-circle">
            <i>2</i>
          </div>
          <p>
            <span>{translate('SWAP_progress_2')}</span>
            {originKind}...
          </p>
        </div>
        <div className={this.computedClass(3)}>
          <div className="progress-circle">
            <i>3</i>
          </div>
          <p>
            {originKind} <span>{translate('SWAP_progress_3')}</span>
          </p>
        </div>
        <div className={this.computedClass(4)}>
          <div className="progress-circle">
            <i>4</i>
          </div>
          <p>
            <span>Sending your </span>
            {destinationKind}
            <br />
            <small>
              Waiting for {numberOfConfirmations} confirmations...
            </small>
          </p>
        </div>
        <div className={this.computedClass(5)}>
          <div className="progress-circle">
            <i>5</i>
          </div>
          <p>Order Complete</p>
        </div>
      </section>
    );
  }
}
