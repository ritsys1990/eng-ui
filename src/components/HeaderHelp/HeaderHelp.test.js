import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import HeaderHelp, { COMPONENT_NAME } from './HeaderHelp';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';
import * as ClientStoreActions from '../../store/client/actions';

const setUp = (props = { theme: Theme }) => {
  return shallow(<HeaderHelp {...props} />);
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
};

describe('HeaderHelp', () => {
  let state;
  let store;
  let mockSetState;
  let useEffectFn;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should run handleOptionClicked with contact option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: 'contact' });
    expect(mockSetState).toBeCalled();
  });

  it.skip('should run handleOptionClicked with tou option', () => {
    const mockDownloadNotices = jest.fn().mockImplementation(() => {});
    jest.spyOn(ClientStoreActions, 'downloadNotices').mockImplementation(() => mockDownloadNotices);

    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: 'tou' });
    expect(mockDownloadNotices).toBeCalled();
  });

  it.skip('should run handleOptionClicked with about option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: 'about' });
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should run handleOptionClicked with default option from ContextMenu', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: '' });
    expect(mockSetState).toBeCalled();
  });

  it.skip('should run onClick with default option from Button', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Button');
    menu.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should run onClose with default option from Modal', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should run onClickOutside with default option from Modal', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    menu.invoke('onClickOutside')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should run onClose with default option from Popover', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Popover');
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
