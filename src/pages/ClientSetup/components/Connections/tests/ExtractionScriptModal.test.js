import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState as clientStoreInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementStoreInitialState } from '../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../store/engagement/actions';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import ExtractionScriptModal from '../ExtractionScriptModal';
import { DatabaseTypes } from '../constants';

const COMPONENT_NAME = 'ClientSetupConnections-ExtractionModal';

const defaultProps = {
  dataSourceId: '1234',
  extractionScriptData: {},
  isOpen: true,
  handleClose: () => {},
  isEdit: false,
};

const setupUseDispatchMock = (store, action) => {
  store.dispatch(action);

  return Promise.resolve(true);
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ExtractionScriptModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Extraction Script Modal Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientStoreInitialState.merge({
        client: {
          id: '123',
        },
      }),
      engagement: engagementStoreInitialState.merge({
        isConfiguringDataSourceExtractionScript: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(6);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(16);
  });

  it('should render on edit mode', () => {
    const wrapper = setUp({
      isEdit: true,
      extractionScriptData: { schemaName: 'Test', databaseType: DatabaseTypes.SAP },
    });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should handle modal close', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onClose')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should handle modal secondary button click', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it.skip('should handle input change', () => {
    const value = 'Test';
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SchemaName`, 'Input');
    expect(input.length).toBe(1);
    input.invoke('onChange')({ target: { value } });
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle select change', () => {
    const value = [{ value: 'Test' }];
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DatabaseType`, 'Select');
    expect(input.length).toBe(1);
    input.invoke('onChange')(value);
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it('should handle select custom render with', () => {
    const option = { name: 'Test' };
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}-DatabaseType`, 'Select');
    expect(input.length).toBe(1);
    const customRender = input.invoke('customRenderSelected')(option, 1);
    const shallowRender = shallow(customRender);
    expect(shallowRender.exists()).toBe(true);
  });

  it('should handle primary button click with errors', () => {
    const mockConfigure = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'configureDataSourceExtractionScript').mockImplementation(() => mockConfigure);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockConfigure).toHaveBeenCalledTimes(0);
  });
});

describe('Extraction Script Modal Component with data', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientStoreInitialState.merge({
        client: {
          id: '123',
        },
      }),
      engagement: engagementStoreInitialState.merge({
        isConfiguringDataSourceExtractionScript: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'string') {
        value = 'Test';
      } else if (Array.isArray(initial)) {
        value = [{ id: 'MSSQL', name: 'MSSQL' }];
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it.skip('should handle primary button click success', () => {
    const mockConfigure = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'configureDataSourceExtractionScript').mockImplementation(() => mockConfigure);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockConfigure).toHaveBeenCalledTimes(1);
  });
});
