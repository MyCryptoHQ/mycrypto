import { Query } from 'components/renderCbs';
import { setCurrentTo, TSetCurrentTo } from 'actions/transaction';
import { AddressInputFactory } from './AddressInputFactory';
import React from 'react';
import { connect } from 'react-redux';
import { ICurrentTo } from 'selectors/transaction';
import { getResolvingDomain } from 'selectors/ens';
import { AppState } from 'reducers';
import { Spinner } from 'components/ui';

interface DispatchProps {
  setCurrentTo: TSetCurrentTo;
}

interface OwnProps {
  to: string | null;
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

export interface CallbackProps {
  isValid: boolean;
  readOnly: boolean;
  currentTo: ICurrentTo;
  errorMsg?: string | null;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}

type Props = DispatchProps & OwnProps & StateProps;

class AddressFieldFactoryClass extends React.Component<Props> {
  public componentDidMount() {
    // this 'to' parameter can be either token or actual field related
    const { to } = this.props;
    if (to) {
      this.props.setCurrentTo(to);
    }
  }

  public render() {
    return <AddressInputFactory onChange={this.setAddress} withProps={this.props.withProps} />;
  }

  private setAddress = (ev: React.FormEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    this.props.setCurrentTo(value);
  };
}

const AddressField = connect(
  (state: AppState) => ({ isResolvingDomain: getResolvingDomain(state) }),
  { setCurrentTo }
)(AddressFieldFactoryClass);

interface DefaultAddressFieldProps {
  withProps(props: CallbackProps): React.ReactElement<any> | null;
}

const DefaultAddressField: React.SFC<DefaultAddressFieldProps> = ({ withProps }) => (
  <Query params={['to']} withQuery={({ to }) => <AddressField to={to} withProps={withProps} />} />
);

export { DefaultAddressField as AddressFieldFactory };
