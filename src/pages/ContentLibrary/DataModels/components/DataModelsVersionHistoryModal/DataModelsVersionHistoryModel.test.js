import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import DataModelsVersionHistoryModal, { COMPONENT_NAME } from './DataModelsVersionHistoryModal';
import { initialState as dMVersionsHistoryInitialState } from '../../../../../store/contentLibrary/datamodels/reducer';
import { initialState as SettingsInitialState } from '../../../../../store/settings/reducer';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<DataModelsVersionHistoryModal {...props} />);
};

describe('DataModels Version History Modal', () => {
  let useEffectFn;
  const mockSetState = jest.fn();

  beforeEach(() => {
    const store = configureStore([thunk])({
      dmVersionHistory: dMVersionsHistoryInitialState,
      settings: SettingsInitialState,
      contentLibraryDMs: ImmutableMap({ isHistoryLoading: false, dMHisotryData: [] }),
    });

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => () => store.dispatch);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  it.skip('should call useEffect', () => {
    setUp();

    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
