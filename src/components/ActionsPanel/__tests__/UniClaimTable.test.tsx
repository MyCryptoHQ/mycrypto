import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { fAccounts } from '@fixtures';
import { ClaimState } from '@types';
import { truncate } from '@utils';

import { UniClaimTable } from '../components/UniClaimTable';

function getComponent() {
  return simpleRender(<UniClaimTable />, {
    initialState: {
      claims: {
        uniClaims: [
          {
            address: fAccounts[0].address,
            state: ClaimState.UNCLAIMED,
            amount: '403'
          },
          {
            address: fAccounts[2].address,
            state: ClaimState.CLAIMED,
            amount: '403'
          }
        ]
      }
    }
  });
}

describe('UniClaimTable', () => {
  test('render the table', async () => {
    getComponent();

    expect(screen.getByText(new RegExp(truncate(fAccounts[0].address), 'i'))).toBeDefined();
  });

  test("don't show claimed addresses", () => {
    getComponent();

    expect(screen.queryByText(new RegExp(truncate(fAccounts[2].address), 'i'))).toBeNull();
  });
});
