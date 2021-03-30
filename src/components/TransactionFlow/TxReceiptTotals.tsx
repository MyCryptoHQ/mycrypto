import React from 'react';

import styled from 'styled-components';

import { Amount, AssetIcon } from '@components';
import Icon from '@components/Icon';
import { getFiat } from '@config';
import { SPACING } from '@theme';
import translate from '@translations';
import { ExtendedAsset, ISettings } from '@types';
import { bigify, convertToFiat, fromWei, totalTxFeeToWei, Wei } from '@utils';

const SIcon = styled(Icon)`
  width: 30px;
  height: 30px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;
interface Props {
  asset: ExtendedAsset;
  assetAmount: string;
  baseAsset: ExtendedAsset;
  settings: ISettings;
  gasUsed: string;
  gasPrice: string;
  value: string;
  assetRate?: number;
  baseAssetRate?: number;
}

export const TxReceiptTotals = ({
  asset,
  assetAmount,
  baseAsset,
  settings,
  gasUsed,
  gasPrice,
  value,
  assetRate,
  baseAssetRate
}: Props) => {
  const feeWei = totalTxFeeToWei(gasPrice, gasUsed);
  const feeFormatted = bigify(fromWei(feeWei, 'ether')).toFixed(6);
  const valueWei = Wei(value);
  const totalWei = feeWei.plus(valueWei);
  const totalEtherFormatted = bigify(fromWei(totalWei, 'ether')).toFixed(6);
  const fiat = getFiat(settings);

  return (
    <>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-send" alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          <Amount
            assetValue={`${bigify(assetAmount).toFixed(6)} ${asset.ticker}`}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(assetAmount, assetRate).toFixed(2)
            }}
          />
        </div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-fee" alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={baseAsset.uuid} size={'24px'} />
          <Amount
            assetValue={`${feeFormatted} ${baseAsset.ticker}`}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(feeFormatted, baseAssetRate).toFixed(2)
            }}
          />
        </div>
      </div>

      <div className="TransactionReceipt-divider" />

      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-sent" alt="Sent" />
          {translate('TOTAL')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          {asset.type === 'base' ? (
            <Amount
              assetValue={`${totalEtherFormatted} ${asset.ticker}`}
              fiat={{
                symbol: fiat.symbol,
                ticker: fiat.ticker,
                amount: convertToFiat(totalEtherFormatted, assetRate).toFixed(2)
              }}
            />
          ) : (
            <Amount
              assetValue={`${assetAmount} ${asset.ticker}`}
              bold={true}
              baseAssetValue={`+ ${totalEtherFormatted} ${baseAsset.ticker}`}
              fiat={{
                symbol: fiat.symbol,
                ticker: fiat.ticker,
                amount: convertToFiat(assetAmount, assetRate)
                  .plus(convertToFiat(totalEtherFormatted, baseAssetRate))
                  .toFixed(2)
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
