import { showNotification } from 'actions/notifications';
import {
  changeStepSwap,
  destinationAmountSwap,
  destinationKindSwap,
  originAmountSwap,
  originKindSwap
} from 'actions/swap';
import {
  ChangeStepSwapAction,
  DestinationAmountSwapAction,
  DestinationKindSwapAction,
  OriginAmountSwapAction,
  OriginKindSwapAction
} from 'actions/swapTypes';
import SimpleButton from 'components/ui/SimpleButton';
import SimpleSelect from 'components/ui/SimpleSelect';
import bityConfig, { kindMax, kindMin } from 'config/bity';
import React, { Component } from 'react';
import translate from 'translations';
import { combineAndUpper, toFixedIfLarger } from 'utils/formatters';
import './CurrencySwap.scss';

export interface StateProps {
  bityRates: {};
  originAmount?: number;
  destinationAmount?: number;
  originKind: string;
  destinationKind: string;
  destinationKindOptions: string[];
  originKindOptions: string[];
}

export interface ActionProps {
  showNotification: typeof showNotification;
  changeStepSwap: typeof changeStepSwap;
  originKindSwap: typeof originKindSwap;
  destinationKindSwap: typeof destinationAmountSwap;
  originAmountSwap: typeof originAmountSwap;
  destinationAmountSwap: typeof destinationAmountSwap;
}

interface State {
  disabled: boolean;
  showMinMaxError: boolean;
}
export default class CurrencySwap extends Component<StateProps & ActionProps> {
  public state = {
    disabled: true,
    showedMinMaxError: false
  };

  public isMinMaxValid = (amount, kind) => {
    let bityMin;
    let bityMax;
    if (kind !== 'BTC') {
      const bityPairRate = this.props.bityRates['BTC' + kind];
      bityMin = kindMin(bityPairRate, kind);
      bityMax = kindMax(bityPairRate, kind);
    } else {
      bityMin = bityConfig.BTCMin;
      bityMax = bityConfig.BTCMax;
    }
    const higherThanMin = amount >= bityMin;
    const lowerThanMax = amount <= bityMax;
    return higherThanMin && lowerThanMax;
  };

  public isDisabled = (originAmount, originKind, destinationAmount) => {
    const hasOriginAmountAndDestinationAmount =
      originAmount && destinationAmount;
    const minMaxIsValid = this.isMinMaxValid(originAmount, originKind);
    return !(hasOriginAmountAndDestinationAmount && minMaxIsValid);
  };

  public setDisabled(originAmount, originKind, destinationAmount) {
    const disabled = this.isDisabled(
      originAmount,
      originKind,
      destinationAmount
    );

    if (disabled && originAmount && !this.state.showedMinMaxError) {
      const { bityRates } = this.props;
      const ETHMin = kindMin(bityRates.BTCETH, 'ETH');
      const ETHMax = kindMax(bityRates.BTCETH, 'ETH');
      const REPMin = kindMin(bityRates.BTCREP, 'REP');

      const notificationMessage = `
        Minimum amount ${bityConfig.BTCMin} BTC,
        ${toFixedIfLarger(ETHMin, 3)} ETH.
        Max amount ${bityConfig.BTCMax} BTC,
        ${toFixedIfLarger(ETHMax, 3)} ETH, or
        ${toFixedIfLarger(REPMin, 3)} REP
      `;

      this.setState(
        {
          disabled,
          showedMinMaxError: true
        },
        () => {
          this.props.showNotification('danger', notificationMessage, 10000);
        }
      );
    } else {
      this.setState({
        disabled
      });
    }
  }

  public onClickStartSwap = () => {
    this.props.changeStepSwap(2);
  };

  public setOriginAndDestinationToNull = () => {
    this.props.originAmountSwap(null);
    this.props.destinationAmountSwap(null);
    this.setDisabled(null, this.props.originKind, null);
  };

  public onChangeOriginAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { destinationKind, originKind } = this.props;
    const amount = (event.target as HTMLInputElement).value;
    const originAmountAsNumber = parseFloat(amount);
    if (originAmountAsNumber || originAmountAsNumber === 0) {
      const pairName = combineAndUpper(originKind, destinationKind);
      const bityRate = this.props.bityRates[pairName];
      this.props.originAmountSwap(originAmountAsNumber);
      const destinationAmount = originAmountAsNumber * bityRate;
      this.props.destinationAmountSwap(destinationAmount);
      this.setDisabled(originAmountAsNumber, originKind, destinationAmount);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  public onChangeDestinationAmount = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const { destinationKind, originKind } = this.props;
    const amount = (event.target as HTMLInputElement).value;
    const destinationAmountAsNumber = parseFloat(amount);
    if (destinationAmountAsNumber || destinationAmountAsNumber === 0) {
      this.props.destinationAmountSwap(destinationAmountAsNumber);
      const pairNameReversed = combineAndUpper(destinationKind, originKind);
      const bityRate = this.props.bityRates[pairNameReversed];
      const originAmount = destinationAmountAsNumber * bityRate;
      this.props.originAmountSwap(originAmount);
      this.setDisabled(originAmount, originKind, destinationAmountAsNumber);
    } else {
      this.setOriginAndDestinationToNull();
    }
  };

  public onChangeDestinationKind = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const newDestinationKind = (event.target as HTMLInputElement).value;
    this.props.destinationKindSwap(newDestinationKind);
  };

  public onChangeOriginKind = (
    event: React.SyntheticEvent<HTMLInputElement>
  ) => {
    const newOriginKind = (event.target as HTMLInputElement).value;
    this.props.originKindSwap(newOriginKind);
  };

  public render() {
    const {
      originAmount,
      destinationAmount,
      originKind,
      destinationKind,
      destinationKindOptions,
      originKindOptions
    } = this.props;

    return (
      <article className="CurrencySwap">
        <h1 className="CurrencySwap-title">
          {translate('SWAP_init_1')}
        </h1>

        <div className="form-inline">
          <input
            className={`CurrencySwap-input form-control ${originAmount !== '' &&
            this.isMinMaxValid(originAmount, originKind)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="number"
            placeholder="Amount"
            value={
              parseFloat(originAmount) === 0 ? originAmount : originAmount || ''
            }
            onChange={this.onChangeOriginAmount}
          />

          <SimpleSelect
            value={originKind}
            onChange={this.onChangeOriginKind.bind(this)}
            options={originKindOptions}
          />

          <h1 className="CurrencySwap-divider">
            {translate('SWAP_init_2')}
          </h1>

          <input
            className={`CurrencySwap-input form-control ${destinationAmount !==
              '' && this.isMinMaxValid(originAmount, originKind)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="number"
            placeholder="Amount"
            value={
              parseFloat(destinationAmount) === 0
                ? destinationAmount
                : destinationAmount || ''
            }
            onChange={this.onChangeDestinationAmount}
          />

          <SimpleSelect
            value={destinationKind}
            onChange={this.onChangeDestinationKind}
            options={destinationKindOptions}
          />
        </div>

        <div className="CurrencySwap-submit">
          <SimpleButton
            onClick={this.onClickStartSwap}
            text={translate('SWAP_init_CTA')}
            disabled={this.state.disabled}
            type="info"
          />
        </div>
      </article>
    );
  }
}
