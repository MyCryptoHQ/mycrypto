import React from 'react';

import { fTxConfig, fTxReceiptPending } from '@fixtures';
import { ITxStatus, ExtendedAddressBook, ITxType } from 'v2/types';
import { noOp } from 'v2/utils';
import { devContacts } from 'v2/database/seed';
import { IZapConfig, ZAPS_CONFIG } from 'v2/features/DeFiZap/config';

import { TransactionReceiptUI } from './TransactionReceipt';

// Define props
const assetRate = 1.34;
const timestamp = 1583266291;
const txStatus = ITxStatus.SUCCESS;
const senderContact = devContacts[0] as ExtendedAddressBook;
const recipientContact = devContacts[1] as ExtendedAddressBook;
const resetFlow = noOp;

export default { title: 'TxReceipt' };

export const transactionReceipt = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TransactionReceiptUI
      txStatus={txStatus}
      displayTxReceipt={fTxReceiptPending}
      timestamp={timestamp}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={fTxConfig}
    />
  </div>
);

const defaultZap = 'unipoolseth';
const zapSelected: IZapConfig = ZAPS_CONFIG[defaultZap];

export const transactionReceiptDeFiZap = () => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TransactionReceiptUI
      txStatus={txStatus}
      txType={ITxType.DEFIZAP}
      zapSelected={zapSelected}
      displayTxReceipt={fTxReceiptPending}
      timestamp={timestamp}
      resetFlow={resetFlow}
      assetRate={assetRate}
      senderContact={senderContact}
      recipientContact={recipientContact}
      txConfig={fTxConfig}
    />
  </div>
);

// Uncomment this for Figma support:

(transactionReceipt as any).story = {
  name: 'TransactionReceipt-Standard',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};

(transactionReceiptDeFiZap as any).story = {
  name: 'TransactionReceipt-DeFiZap',
  parameters: {
    design: {
      type: 'figma',
      url:
        'https://www.figma.com/file/BY0SWc75teEUZzws8JdgLMpy/MyCrypto-GAU-Master?node-id=325%3A79384'
    }
  }
};
