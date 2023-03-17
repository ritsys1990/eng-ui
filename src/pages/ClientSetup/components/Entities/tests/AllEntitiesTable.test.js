import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import * as EntityUtils from '../utils/Entities.utils';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import AllEntitiesTable from '../AllEntitiesTable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Map as ImmutableMap } from 'immutable';

const COMPONENT_NAME = 'AllEntitiesTable';

const defaultProps = { entities: [] };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AllEntitiesTable {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('AllEntitiesTable', () => {
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
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render without errors', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, COMPONENT_NAME, 'Table');
    expect(table.length).toBe(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(4);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should handle context menu close', () => {
    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AllEntitiesContextMenu');
    expect(contextMenu.length).toBe(1);
    contextMenu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should handle context menu click', () => {
    let handleContextMenuFn;
    jest.spyOn(EntityUtils, 'getAllEntitiesTableHeaders').mockImplementation((t, onClick) => {
      handleContextMenuFn = onClick;
    });

    const wrapper = setUp();
    const contextMenu = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AllEntitiesContextMenu');
    expect(contextMenu.length).toBe(1);
    handleContextMenuFn({ target: null }, {});
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
