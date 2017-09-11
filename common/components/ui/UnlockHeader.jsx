// @flow
import React from 'react';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';
import BaseWallet from 'libs/wallet/base';
import { connect } from 'react-redux';
import type { State as ReduxState } from 'reducers';

type Props = {
  title: string,
  wallet: BaseWallet
};

type State = {
  expanded: boolean
};

const mapStateToProps = (state: ReduxState) => ({
  wallet: state.wallet.inst
});

export class UnlockHeader extends React.Component<Props, State> {
  componentDidMount() {
    this.setState({ expanded: !this.props.wallet });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: false });
    }

    // not sure if could happen
    if (!this.props.wallet && this.props.wallet !== prevProps.wallet) {
      this.setState({ expanded: true });
    }
  }

  render() {
    return (
      <article className="collapse-container">
        <div onClick={this.toggleExpanded}>
          <a className="collapse-button">
            <span>
              {this.state.expanded ? '-' : '+'}
            </span>
          </a>
          <h1>
            {translate(this.props.title)}
          </h1>
        </div>
        {this.state.expanded && <WalletDecrypt />}
        {this.state.expanded && <hr />}
      </article>
    );
  }

  toggleExpanded = () => {
    this.setState(state => {
      return { expanded: !state.expanded };
    });
  };
}

export default connect(mapStateToProps)(UnlockHeader);
