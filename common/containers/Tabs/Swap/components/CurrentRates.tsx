import React, { Component } from 'react';
import './CurrentRates.scss';

import { Pairs } from 'actions/swapTypes';
import bityLogoWhite from 'assets/images/logo-bity-white.svg';
import Spinner from 'components/ui/Spinner';
import { bityReferralURL } from 'config/data';
import translate from 'translations';
import { toFixedIfLarger } from 'utils/formatters';

interface State {
  ETHBTCAmount: number;
  ETHREPAmount: number;
  BTCETHAmount: number;
  BTCREPAmount: number;
}
export default class CurrentRates extends Component<Pairs, State> {
  public state = {
    ETHBTCAmount: 1,
    ETHREPAmount: 1,
    BTCETHAmount: 1,
    BTCREPAmount: 1
  };

  public onChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const target = event.target;
    const { value } = event.target as HTMLInputElement;
    const { name } = event.target as HTMLInputElement;
    this.setState({
      [name]: value
    });
  };

  public buildPairRate = (origin: string, destination: string) => {
    const pair = origin + destination;
    const statePair = this.state[pair + 'Amount'];
    const propsPair = this.props[pair];
    return (
      <div className="SwapRates-panel-rate">
        {propsPair
          ? <div>
              <input
                className="SwapRates-panel-rate-input"
                onChange={this.onChange}
                value={statePair}
                name={pair + 'Amount'}
              />
              <span className="SwapRates-panel-rate-amount">
                {` ${origin} = ${toFixedIfLarger(
                  statePair * propsPair,
                  6
                )} ${destination}`}
              </span>
            </div>
          : <Spinner />}
      </div>
    );
  };

  public render() {
    return (
      <article className="SwapRates">
        <h3 className="SwapRates-title">
          {translate('SWAP_rates')}
        </h3>

        <section className="SwapRates-panel row">
          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('ETH', 'BTC')}
            {this.buildPairRate('ETH', 'REP')}
          </div>

          <div className="SwapRates-panel-side col-sm-6">
            {this.buildPairRate('BTC', 'ETH')}
            {this.buildPairRate('BTC', 'REP')}
          </div>
          <a
            className="SwapRates-panel-logo"
            href={bityReferralURL}
            target="_blank"
          >
            <img src={bityLogoWhite} width={120} height={49} />
          </a>
        </section>
      </article>
    );
  }
}
