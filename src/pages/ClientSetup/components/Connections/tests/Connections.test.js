import React, * as ReactHooks from 'react';
import Connections from '../Connections';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from 'src/utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { initialState as clientInitialState } from 'src/store/client/reducer';
import { initialState as engagementStoreInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityStoreInitialState } from '../../../../../store/security/reducer';
import { ComponentNames } from '../constants';

const { MAIN: COMPONENT_NAME } = ComponentNames;

const dataSources = [
  {
    id: '12343535',
    type: 'test',
    fileTransferMode: 'SecureAgent',
    clientId: '3424324',
    name: 'test',
    isActionsRequired: true,
    connections: [
      {
        dataSourceId: '2352342342353',
        name: 'test_Source',
        description: 'test_Source',
        secureAgentType: 'Source',
        runtimeEnvironmentId: '234234424233',
      },
    ],
  },
];

const setUp = (props = {}) => {
  return shallow(<Connections {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const mockClientId = 'f06f3b22-b86b-4d07-82da-1434fced12a5';

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: clientInitialState,
  engagement: engagementStoreInitialState,
  security: securityStoreInitialState,
};

describe('Client Setup Connections', () => {
  let state;
  let store;
  let mockSetState;
  let useEffect;
  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(3);
    wrapper.setProps({ clientId: mockClientId });
    expect(useEffect).toHaveBeenCalledTimes(6);
  });

  it('should render empty state', () => {
    const wrapper = setUp();
    const emptyState = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EmptyState`);
    expect(emptyState.length).toBe(1);
  });

  it.skip('should render table', () => {
    state = {
      ...state,
      client: state.client.merge({
        dSConnections: dataSources,
      }),
    };
    const wrapper = setUp({ clientId: mockClientId });
    const dsTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    expect(dsTable.length).toBe(1);
  });

  it.skip('should render table', () => {
    state = {
      ...state,
      client: state.client.merge({
        dSConnections: dataSources,
      }),
    };
    const wrapper = setUp({ clientId: mockClientId });
    const dsTable = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Table`);
    dsTable.invoke('onAddConnection')();
    expect(mockSetState).toHaveBeenCalledWith(true);
  });

  it('should spin while fetching', () => {
    state = {
      ...state,
      client: state.client.merge({
        isFetchingDSConnections: true,
      }),
    };
    const wrapper = setUp({ clientId: mockClientId });
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.prop('spinning')).toBe(true);
  });

  it.skip('should call add connection handle close', () => {
    const wrapper = setUp({ clientId: mockClientId });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddConnection`, 'AddConnectionModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
