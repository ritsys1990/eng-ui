import React, * as ReactHooks from 'react';
import DataSources from '../DataSources';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from 'src/utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { initialState as clientInitialState } from 'src/store/client/reducer';
import { initialState as securityInitialState } from 'src/store/security/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { ComponentNames } from '../constants';

const { MAIN: COMPONENT_NAME } = ComponentNames;

const setUp = (props = {}) => {
  return shallow(<DataSources {...props} />);
};

const mockClientId = 'f06f3b22-b86b-4d07-82da-1434fced12a5';

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: clientInitialState,
  engagement: engagementInitialState,
  security: securityInitialState,
};

describe('Client Setup DataSources', () => {
  let state;
  let store;
  let useEffect;
  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
    wrapper.setProps({ clientId: mockClientId });
    expect(useEffect).toHaveBeenCalledTimes(2);
  });

  it('should render empty state', () => {
    const wrapper = setUp();
    const emptyState = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EmptyState`);
    expect(emptyState.length).toBe(1);
  });

  it('should render table', () => {
    state = {
      ...state,
      client: state.client.merge({
        dataSources: [{ id: '0af7568d-b696-49e2-94a3-444a18c1d3cb' }],
      }),
    };
    const wrapper = setUp({ clientId: mockClientId });
    const dsTable = findByInstanceProp(wrapper, ComponentNames.TABLE);
    expect(dsTable.length).toBe(1);
  });

  it('should spin while fetching', () => {
    state = {
      ...state,
      client: state.client.merge({
        isFetchingDataSources: true,
      }),
    };
    const wrapper = setUp({ clientId: mockClientId });
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.prop('spinning')).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
