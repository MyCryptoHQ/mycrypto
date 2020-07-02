import React from 'react';
import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';
import { noOp } from '@utils';
import { unknownReport, scamReport, verifiedReport } from '@fixtures';

import { ProtectTxReportUI } from '../components/ProtectTxReport';
import { PTXReport } from '../types';

const renderComponent = (report: PTXReport) => {
  return simpleRender(<ProtectTxReportUI report={report} onHide={noOp} isWeb3={false} />);
};

/* Test components */
describe('ProtectTxReport', () => {
  test('Can render unknown state', () => {
    const { getByText } = renderComponent(unknownReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_UNKNOWN_ACCOUNT').trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render scam state', () => {
    const { getByText } = renderComponent(scamReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_MALICIOUS', {
      $tags: `"${scamReport.labels![0]}"`
    }).trim();
    expect(getByText(selector)).toBeInTheDocument();
  });

  test('Can render verified state', () => {
    const { getByText } = renderComponent(verifiedReport);
    const selector = translateRaw('PROTECTED_TX_TIMELINE_TAGS', {
      $tags: `"${verifiedReport.labels![0]}"`
    }).trim();
    expect(
      getByText(translateRaw('PROTECTED_TX_TIMELINE_KNOWN_ACCOUNT').trim())
    ).toBeInTheDocument();
    expect(getByText(selector)).toBeInTheDocument();
  });
});
