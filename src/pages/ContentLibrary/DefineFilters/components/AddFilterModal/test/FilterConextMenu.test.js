import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';
import FilterContextMenu from '../FilterContextMenu';
import { findByInstanceProp } from 'src/utils/testUtils';
import { ContextMenuOptions } from '../constants';
import { initialState as engagementInitialState } from 'src/store/engagement/reducer';
import { initialState as clientInitialState } from 'src/store/client/reducer';
import { initialState as securityInitialState } from 'src/store/security/reducer';

const COMPONENT_NAME = 'FilterContextMenu';

const defaultProps = {
  isOpen: true,
  onClose: () => {},
  buttonRef: { current: null },
  deleteFilterOperation: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<FilterContextMenu {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Add Filter Modal Page', () => {
  let store;
  let useEffect;
  let useState;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: securityInitialState,
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    mockDispatch = jest.fn().mockImplementation(store.dispatch);

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => {
      f();
    });
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render without errors', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(contextMenu.length).toBe(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(contextMenu.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(contextMenu.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(1);
  });

  it('should render contenxt menu', () => {
    const wrapper = setUp();
    const context = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Context-Menu`);
    expect(context.length).toBe(1);
  });

  it('should call onDeleteEntity when click delete', () => {
    const mockDeleteFilterOperation = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ deleteFilterOperation: mockDeleteFilterOperation });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Context-Menu`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.DELETE });
    expect(mockDeleteFilterOperation).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
