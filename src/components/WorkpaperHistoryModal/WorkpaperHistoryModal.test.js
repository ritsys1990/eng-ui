import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByInstanceProp } from '../../utils/testUtils';
import WorkpaperHistoryModal, { COMPONENT_NAME } from './WorkpaperHistoryModal';
import { initialState as wpHistoryInitialState } from '../../store/wpHistory/reducer';
import { initialState as SettingsInitialState } from '../../store/settings/reducer';

const setUp = (props = {}) => {
  return shallow(<WorkpaperHistoryModal {...props} />);
};

describe('Workpaper History Component', () => {
  let useEffectFn;

  beforeEach(() => {
    const store = configureStore([thunk])({
      wpHistory: wpHistoryInitialState,
      settings: SettingsInitialState,
    });

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
