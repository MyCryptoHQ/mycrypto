import React, { Component } from 'react';
import { getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { CallbackProps } from '../SendButtonFactory';
import { getCurrentTransactionStatus } from 'selectors/transaction';
import { showNotification, TShowNotification } from 'actions/notifications';
import { ITransactionStatus } from 'reducers/transaction/broadcast';
import { reset, TReset } from 'actions/transaction';
import { ConfirmationModal } from 'components/ConfirmationModal';

interface StateProps {
  offline: boolean;
  currentTransaction: false | ITransactionStatus | null;
}

interface State {
  showModal: boolean;
}

interface DispatchProps {
  showNotification: TShowNotification;
  reset: TReset;
}

interface OwnProps {
  Modal: typeof ConfirmationModal;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const INITIAL_STATE: State = {
  showModal: false
};

type Props = OwnProps & StateProps & DispatchProps;

class OnlineSendClass extends Component<Props, State> {
  public state: State = INITIAL_STATE;

  public render() {
    return !this.props.offline ? (
      <React.Fragment>
        {this.props.withProps({ onClick: this.openModal })}
        {this.props.Modal}
      </React.Fragment>
    ) : null;
  }
  private openModal = () => {
    const { currentTransaction } = this.props;

    if (
      currentTransaction &&
      (currentTransaction.broadcastSuccessful || currentTransaction.isBroadcasting)
    ) {
      return this.props.showNotification(
        'warning',
        'The current transaction is already broadcasting or has been successfully broadcasted'
      );
    }
    this.toggleModal();
  };
  private toggleModal = () =>
    this.setState((prevState: State) => ({ showModal: !prevState.showModal }));
}

export const OnlineSend = connect(
  (state: AppState) => ({
    offline: getOffline(state),
    currentTransaction: getCurrentTransactionStatus(state)
  }),
  { showNotification, reset }
)(OnlineSendClass);
