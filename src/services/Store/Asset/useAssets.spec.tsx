import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fAssets } from '@fixtures';
import { Asset, ExtendedAsset } from '@types';

import useAssets from './useAssets';

const renderUseAssets = ({ assets = [] as ExtendedAsset[] } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ assets })}>{children}</ProvidersWrapper>
  );
  return renderHook(() => useAssets(), { wrapper });
};

describe('useAssets', () => {
  it('uses get assets from store', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.assets).toEqual(fAssets);
  });

  it('createAsset() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAssets({ assets: [] });
    result.current.createAsset(fAssets[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAssets[0]));
  });

  it('getAssetByUUID() finds an asset and returns it', () => {
    const { result } = renderUseAssets({ assets: fAssets });
    expect(result.current.getAssetByUUID(fAssets[0].uuid)).toEqual(fAssets[0]);
  });

  it('addAssetsFromAPI() calls dispatch', () => {
    const mockDispatch = mockUseDispatch();
    const customAssets = fAssets.filter((a) => a.isCustom);
    const { result } = renderUseAssets({
      assets: customAssets
    });
    const defaultAssets = fAssets.filter((a) => !a.isCustom);
    const assets = defaultAssets.reduce((obj, item) => {
      obj[item.uuid] = item;
      return obj;
    }, {} as Record<any, Asset>);
    result.current.addAssetsFromAPI(assets);

    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(assets));
  });
});
