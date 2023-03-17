import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import HeaderResources from './HeaderResources';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';
import { findByInstanceProp } from '../../utils/testUtils';

const COMPONENT_NAME = 'HeaderResources';
const setUp = (props = { theme: Theme }) => {
  return shallow(<HeaderResources {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

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

describe('Header Resources test', () => {
  let state;
  let store;
  let mockSetState;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    global.URL.createObjectURL = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it.skip('should run onClick with default option from Button', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Button');
    menu.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should run onClose with default option from Popover', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Popover');
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should run handleOptionClicked with open url', () => {
    const mockfn = jest.spyOn(window, 'open').mockImplementation(() => {});
    const wrapper = setUp({ handleOptionClicked: mockfn });
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: 'contact' });
    expect(mockfn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
