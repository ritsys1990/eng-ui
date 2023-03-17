import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import AllEntitiesContextMenu from '../AllEntitiesContextMenu';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Map as ImmutableMap } from 'immutable';
import { ContextMenuOptions } from '../constants/constants';

const COMPONENT_NAME = 'AllEntitiesContextMenu';

const defaultProps = { entity: {}, buttonRef: { current: null }, onClose: () => {}, isOpen: true };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AllEntitiesContextMenu {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('AllEntitiesContextMenu', () => {
  let store;
  let useEffect;
  let useState;
  let useSelectorFn;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    mockDispatch = jest.fn().mockImplementation(store.dispatch);

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => {
      f();
    });
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (Array.isArray(initial)) {
        value = [{ id: '123', name: 'Test' }];
      }

      return [value, mockSetState];
    });

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it.skip('should render without errors', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call onEditEntity when click edit', () => {
    const mockOnEditEntity = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ onEditEntity: mockOnEditEntity });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.EDIT });
    expect(mockOnEditEntity).toHaveBeenCalledTimes(1);
  });

  it.skip('should call onDeleteEntity when click delete', () => {
    const mockOnDeleteEntity = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ onDeleteEntity: mockOnDeleteEntity });
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onOptionClicked')({ id: ContextMenuOptions.DELETE });
    expect(mockOnDeleteEntity).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
