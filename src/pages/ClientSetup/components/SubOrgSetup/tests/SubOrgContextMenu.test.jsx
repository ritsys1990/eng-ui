import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import SubOrgContextMenu from '../SubOrg/SubOrgContextMenu';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Map as ImmutableMap } from 'immutable';
import { ContextMenuOptions } from '../constants/constants';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const COMPONENT_NAME = 'SubOrgContextMenu';

const defaultProps = {
  row: {},
  buttonRef: { current: null },
  onClose: () => {},
  isOpen: true,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<SubOrgContextMenu {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('SubOrgContextMenu', () => {
  let store;
  let useEffect;
  let useState;
  let useSelectorFn;
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
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
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

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(contextMenu.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(7);
  });

  it('should call onEditEntity when click edit', () => {
    const mockOnEditSubOrgMenu = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ onEditSubOrgMenu: mockOnEditSubOrgMenu });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Menu`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.EDIT });
    expect(mockOnEditSubOrgMenu).toHaveBeenCalledTimes(1);
  });

  it('should call Regenerate token when click regenerate', () => {
    const mockOnEditSubOrgMenu = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ onRegnerateToken: mockOnEditSubOrgMenu });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Menu`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.REGENERATE });
    expect(mockOnEditSubOrgMenu).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteEntity when click delete', () => {
    const mockOnDeleteSubOrgMenu = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ onDeleteSubOrgMenu: mockOnDeleteSubOrgMenu });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Menu`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.DELETE });
    expect(mockOnDeleteSubOrgMenu).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
