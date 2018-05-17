import { Token } from 'types/network';
import {
  TypeKeys,
  AddCustomTokenAction,
  CustomTokenAction,
  RemoveCustomTokenAction
} from './types';

export type State = Token[];

export const INITIAL_STATE: State = [];

function addCustomToken(state: State, action: AddCustomTokenAction): State {
  if (state.find(token => token.symbol === action.payload.symbol)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomToken(state: State, action: RemoveCustomTokenAction): State {
  return state.filter(token => token.symbol !== action.payload);
}

export default function customTokens(
  state: State = INITIAL_STATE,
  action: CustomTokenAction
): State {
  switch (action.type) {
    case TypeKeys.CUSTOM_TOKEN_ADD:
      return addCustomToken(state, action);
    case TypeKeys.CUSTOM_TOKEN_REMOVE:
      return removeCustomToken(state, action);
    default:
      return state;
  }
}
