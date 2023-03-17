import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import Header from './Header';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';
import * as ErrorStoreActions from '../../store/errors/actions';

const defaultProps = { hideHeaderActions: false, hideGlobalNavigation: false };
const setUp = (props = { theme: Theme }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<Header {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const COMPONENT_NAME = 'Header';
const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: ImmutableMap({
    noticesBlob: {
      caller: 'tou',
    },
    fetchingNotices: false,
  }),
  errors: ImmutableMap({}),
};

describe('Header test', () => {
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

  it('should render global navigation', () => {
    const wrapper = setUp();
    const globalnavigation = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Navigation`);
    expect(globalnavigation.length).toBe(1);
  });

  it('should render alert', () => {
    const errorKey = 123;
    const mockDeleteError = jest.fn();
    jest.spyOn(ErrorStoreActions, 'deleteGlobalError').mockImplementation(() => mockDeleteError);
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Alert`);
    expect(alert.length).toBe(1);
    alert.invoke('onClose')(errorKey);
    expect(mockDeleteError).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
