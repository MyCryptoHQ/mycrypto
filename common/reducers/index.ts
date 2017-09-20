import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import config, { State as ConfigState } from './config';
import contracts, { State as ContractsState } from './contracts';
import customTokens, { State as CustomTokensState } from './customTokens';
import deterministicWallets, {
  State as DeterministicWalletsState
} from './deterministicWallets';
import ens, { State as EnsState } from './ens';
import generateWallet, { State as GenerateWalletState } from './generateWallet';
import notifications, { State as NotificationsState } from './notifications';
import rates, { State as RatesState } from './rates';
import swap, { State as SwapState } from './swap';
import wallet, { State as WalletState } from './wallet';

export interface AppState {
  // Custom reducers
  generateWallet: GenerateWalletState;
  config: ConfigState;
  notifications: NotificationsState;
  ens: EnsState;
  wallet: WalletState;
  customTokens: CustomTokensState;
  rates: RatesState;
  contracts: ContractsState;
  deterministicWallets: DeterministicWalletsState;
  // Third party reducers (TODO: Fill these out)
  form: object;
  routing: object;
  swap: SwapState;
}

export default combineReducers({
  ...generateWallet,
  ...config,
  ...swap,
  ...notifications,
  ...ens,
  ...wallet,
  ...customTokens,
  ...rates,
  ...contracts,
  ...deterministicWallets,
  form: formReducer,
  routing: routerReducer
});
