import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import HeaderNotification from './HeaderNotification';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';

const setUp = (props = { theme: Theme }) => {
  return shallow(<HeaderNotification {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const COMPONENT_NAME = 'HeaderNotification';
const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: ImmutableMap({
    noticesBlob: {
      caller: 'tou',
    },
    fetchingNotices: false,
  }),
  security: ImmutableMap({
    me: {
      firstName: 'test',
      lastName: 'test1',
    },
  }),
  notifications: ImmutableMap({
    unreadCount: 10,
    isFetching: false,
  }),
};

describe('Header Profile test', () => {
  let state;
  let store;
  let mockSetState;
  let useStateFn;
  let useEffectFn;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it.skip('should render useState', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should render useEffect', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should render notification button', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, COMPONENT_NAME);
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should render popover', () => {
    const wrapper = setUp();
    const popover = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Popover`);
    popover.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render Badge', () => {
    const wrapper = setUp();
    const badge = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Badge`);
    badge.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
