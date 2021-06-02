import { getByTestId, getByText, queryAllByText } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import { FIXTURE_HARDHAT_PRIVATE_KEY, FIXTURE_SEND_AMOUNT, PAGES } from './fixtures';
import { findByTKey } from './translation-utils';

export default class MembershipPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.BUY_MEMBERSHIP);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.BUY_MEMBERSHIP, timeout);
  }

  // todo
  async useETH() {
    await t.click(getByText('12 months', { exact: false }));
    await t.click(queryAllByText(findByTKey('MEMBERSHIP_LIFETIME_EMOJI')).nth(0));
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }
}
