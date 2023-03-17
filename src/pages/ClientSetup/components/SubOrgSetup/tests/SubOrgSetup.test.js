import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { SubOrgSetup } from '../SubOrgSetup';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

const setUp = (props = {}) => {
  return shallow(<SubOrgSetup {...props} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  let useStateFn;
  let mockSetState;
  let useEffectFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
        isFetchingMyList: false,
      }),
      engagement: engagementInitialState,
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
        clientPermissions: {
          permissions: {
            orgs: {
              add: true,
            },
          },
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    store.clearActions();
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Org`);
    expect(comp.length).toBe(1);
    comp.invoke('setOrgEnabled')();
    expect(mockSetState).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(4);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
