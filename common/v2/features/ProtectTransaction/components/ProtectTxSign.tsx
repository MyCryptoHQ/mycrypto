import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

import { SPACING } from 'v2/theme';
import { ProtectIcon, CloseIcon } from 'v2/components/icons';
import { ITxConfig, ITxHash, ITxSigned, Network, StoreAccount } from 'v2/types';
import { WALLET_STEPS } from 'v2/components/SignTransactionWallets';

import { IWithProtectApi } from '../types';
import ProtectTxBase from './ProtectTxBase';

const SignProtectedTransaction = styled(ProtectTxBase)`
  .SignTransactionKeystore {
    &-title {
      height: auto;
      margin-top: ${SPACING.SM};
    }
  }

  .SignTransactionWeb3 {
    &-img {
      min-width: 100%;
    }
  }
`;

const Loader = styled.div`
  margin-top: ${SPACING.BASE};
`;

interface Props extends IWithProtectApi {
  txConfig: ITxConfig;
  readonly account?: StoreAccount;
  readonly network?: Network;
  handleProtectTxConfirmAndSend(payload: ITxHash | ITxSigned): void;
}

export const ProtectTxSign: FC<Props> = props => {
  const { withProtectApi, txConfig, handleProtectTxConfirmAndSend, account, network } = props;
  const { goToInitialStepOrFetchReport } = withProtectApi!;

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (goToInitialStepOrFetchReport) {
        goToInitialStepOrFetchReport();
      }
    },
    []
  );

  const getSignComponent = useCallback(() => {
    if (!isEmpty(txConfig) && values(txConfig).length && account && network) {
      const SignComponent = WALLET_STEPS[account.wallet];
      const signComponentProps = {
        network,
        senderAccount: account,
        rawTransaction: txConfig,
        onSuccess: async (payload: ITxHash | ITxSigned) =>
          await handleProtectTxConfirmAndSend(payload)
      };

      // @ts-ignore
      return <SignComponent {...signComponentProps} />;
    }

    return <Loader className="loading" />;
  }, [txConfig, account, network]);

  return (
    <SignProtectedTransaction>
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      {getSignComponent()}
    </SignProtectedTransaction>
  );
};
