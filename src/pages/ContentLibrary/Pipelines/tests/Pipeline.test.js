import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../utils/testUtils';
import Pipelines from '../Pipelines';
import { COMPONENT_NAME } from '../constants/constants';
import { PagePermissions } from '../../../../utils/permissionsHelper';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../hooks/useCheckAuth';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { initialState as CLPipelinesInitialState } from '../../../../store/contentLibrary/pipelines/reducer';
import { initialState as SecurityInitialState } from '../../../../store/security/reducer';
import * as NavContextHook from '../../../../hooks/useNavContext';

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<Pipelines {...mergedProps} />);
};

describe('Pipelines: Initial render', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    const pagePermissions = {
      [PagePermissions.CONTENT_LIBRARY_PIPELINES]: true,
    };
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'HeaderBar');
    expect(component.length).toBe(1);
  });

  it.skip('should change search text (empty)', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'HeaderBar');
    expect(component.length).toBe(1);
    component.invoke('onSearchChange')('');
    expect(mockSetState).toHaveBeenCalledTimes(2);
    expect(mockSetState).toHaveBeenNthCalledWith(2, true);
  });

  it.skip('should change search text (empty)', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'HeaderBar');
    expect(component.length).toBe(1);
    component.invoke('onSearchChange')('test');
    expect(mockSetState).toHaveBeenCalledTimes(2);
    expect(mockSetState).toHaveBeenNthCalledWith(2, false);
  });

  it.skip('should open add modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'HeaderBar');
    expect(component.length).toBe(1);
    component.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should close add modal', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Form`);
    expect(component.length).toBe(1);
    component.invoke('onClose')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Pipelines: no permissions', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: SecurityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      contentLibraryPipelines: CLPipelinesInitialState,
    });
    const pagePermissions = {
      [PagePermissions.CONTENT_LIBRARY_PIPELINES]: false,
    };
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions });
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
  });

  it('should render no permissions message', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-NoPermissions`);
    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
