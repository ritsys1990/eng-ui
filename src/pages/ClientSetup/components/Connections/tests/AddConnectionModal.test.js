import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState as clientStoreInitialState } from '../../../../../store/client/reducer';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import AddConnectionModal from '../AddConnectionModal';

const COMPONENT_NAME = 'ClientSetupConnections-AddConnectionModal';

const defaultProps = {
  rowData: {
    clientId: '1234-23232',
    entityIds: ['12323', '23442'],
    SecureAgent: 'SecureAgent',
  },
  isOpen: true,
  handleClose: () => {},
  handleTest: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddConnectionModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Add Connection Modal Component', () => {
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
        connectionTemplateList: {
          items: [
            {
              id: '1232-1123b-12be',
              name: 'Flat File',
              description: 'CSV Connector',
              kind: 'Extraction',
              type: 'CSVFile',
            },
          ],
        },
        runTimeEnvironmentList: [
          {
            id: '2343242',
            name: 'test',
          },
          {
            id: '2343241',
            name: 'test1',
          },
        ],
        fetchingRuntimeData: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      bundles: ImmutableMap({ templateDetails: null, isFetchingTemplateDetails: false }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render add connection modal', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(10);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useEffect when rendering edit ', () => {
    const isEdit = true;
    const wrapper = setUp({ isEdit });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(comp.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(14);
  });

  it('should handle modal close', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onClose')([]);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it.skip('should call on connection type change with value', () => {
    const value = [{ id: 'Extraction' }];
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Connection_Type`, 'Select');
    select.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should call on connection type change without value', () => {
    const value = [];
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Connection_Type`, 'Select');
    select.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should call on customer template change', () => {
    const value = [{ id: 'Flat File' }];
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Connector_Template`, 'Select');
    select.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should call on run time environment change', () => {
    const value = [{ id: 'test (123)' }];
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Runtime_Environment`, 'Select');
    select.simulate('change', value);
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle connection name input change', () => {
    const value = 'ConnectionNameTest';
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Connection_Name`, 'Input');
    expect(input.length).toBe(1);
    input.invoke('onChange')({ target: { value } });
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it.skip('should handle description name change', () => {
    const value = 'DescriptionTest';
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Connection_Description`, 'Input');
    expect(input.length).toBe(1);
    input.invoke('onChange')({ target: { value } });
    expect(mockSetState).toHaveBeenLastCalledWith(value);
  });

  it('should handle modal secondary button click', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it.skip('should handle primary button click with errors', () => {
    const hasErrors = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ hasErrors });

    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should handle isopen false', () => {
    const isOpen = false;
    const wrapper = setUp({ isOpen });

    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it.skip('should handle primary button click with out errors', () => {
    const selectedConnection = { id: 'xxx', name: 'conn1', secureAgentType: 'test1' };
    const wrapper = setUp({ selectedConnection, isEdit: true });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should handle test connection modal', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Test_Connection`);
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')([]);
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
