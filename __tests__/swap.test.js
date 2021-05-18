import {
  queryAllByTestId,
  queryByText,
  getByTestId,
  getAllByTestId
} from '@testing-library/testcafe';

import { injectLS } from './clientScripts';
import { FIXTURE_HARDHAT, FIXTURES_CONST, PAGES } from './fixtures';
import SwapPage from './swap-page.po';
import { findByTKey } from './translation-utils';

const swapPage = new SwapPage();

fixture('Swap')
  .clientScripts({ content: injectLS(FIXTURE_HARDHAT) })
  .page(PAGES.SWAP);

// test("Can get swap quote", async (t) => {
//   await swapPage.waitPageLoaded();
//
//   /* Fill out form */
//   await swapPage.fillForm();
//   await t.wait(FIXTURES_CONST.TIMEOUT);
//
//   // Has received swap quote
//   const quote = await getByText(findByTKey("YOUR_QUOTE"));
//   await t.expect(quote).ok();
// });

test('can do a swap', async (t) => {
  await swapPage.waitPageLoaded();
  await swapPage.setupMock();

  await swapPage.fillForm();
  await t.wait(FIXTURES_CONST.TIMEOUT);

  const button = await getByTestId('confirm-swap');
  await t.click(button);

  const send = await queryByText(findByTKey('CONFIRM_AND_SEND')).with({ timeout: 60000 });
  await t.expect(send.exists).ok({ timeout: 60000 });
  await t.click(send);

  await t
    .expect(queryAllByTestId('SUCCESS').with({ timeout: 60000 }).exists)
    .ok({ timeout: 60000 });
});
