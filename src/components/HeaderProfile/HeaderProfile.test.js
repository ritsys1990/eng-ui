import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import HeaderProfile from './HeaderProfile';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';

const defaultProps = { isOpen: false, handleOptionClicked: () => {} };
const setUp = (props = { theme: Theme }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<HeaderProfile {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const COMPONENT_NAME = 'HeaderProfile';
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
};

describe('Header Profile test', () => {
  let state;
  let store;
  let mockSetState;
  let useStateFn;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    global.URL.createObjectURL = jest.fn();
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(4);
  });

  it.skip('should render button', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, COMPONENT_NAME, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should render popover', () => {
    const wrapper = setUp();
    const popover = findByInstanceProp(wrapper, COMPONENT_NAME, 'Popover');
    popover.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render contextmenu', () => {
    const wrapper = setUp();
    const contextmenu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    contextmenu.invoke('onOptionClicked')({ id: 'language' });
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
