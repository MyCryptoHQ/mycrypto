import { runSaga } from 'redux-saga';
import { translateRaw } from 'translations';
import { handleAddAddressLabelRequest, ERROR_DURATION } from 'sagas/addressBook';
import {
  addAddressLabelRequested,
  addAddressLabelSucceeded,
  addAddressLabelFailed
} from 'actions/addressBook';
import { showNotification } from 'actions/notifications';
import { getInitialState } from '../selectors/helpers';

describe('addressBook: Sagas', () => {
  const initialState = getInitialState();
  const getState = () => ({
    ...initialState,
    addressBook: {
      ...initialState.addressBook,
      addresses: {},
      labels: {}
    }
  });
  const address = '0x081f37708032d0a7b3622591a8959b213fb47d6f';

  describe('Happy path', () => {
    it('should put addAddressLabelSucceeded on the happy path', async () => {
      const action = addAddressLabelRequested({
        index: 0,
        address,
        label: 'Foo'
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (action: string) => dispatched.push(action),
          getState: () => getState()
        },
        handleAddAddressLabelRequest,
        action
      );

      expect(dispatched).toEqual([
        addAddressLabelSucceeded({
          index: 0,
          address,
          label: 'Foo'
        })
      ]);
    });
  });

  describe('Failure cases', () => {
    it('should put addAddressLabelFailed when an addressError occurs', async () => {
      const action = addAddressLabelRequested({
        index: 0,
        address: 'Bar', // Invalid ETH address
        label: 'Foo'
      });
      const addressError = translateRaw('INVALID_ADDRESS');
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (action: string) => dispatched.push(action),
          getState: () => getState()
        },
        handleAddAddressLabelRequest,
        action
      );

      expect(dispatched).toEqual([
        showNotification('danger', addressError, ERROR_DURATION),
        addAddressLabelFailed({
          index: 0,
          addressError,
          labelError: undefined
        })
      ]);
    });
    it('should put addAddressLabelFailed when a labelError occurs', async () => {
      const action = addAddressLabelRequested({
        index: 0,
        address,
        label: 'X' // Invalid label length
      });
      const labelError = translateRaw('INVALID_LABEL_LENGTH');
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (action: string) => dispatched.push(action),
          getState: () => getState()
        },
        handleAddAddressLabelRequest,
        action
      );

      expect(dispatched).toEqual([
        showNotification('danger', labelError, ERROR_DURATION),
        addAddressLabelFailed({
          index: 0,
          addressError: undefined,
          labelError
        })
      ]);
    });
  });
});
