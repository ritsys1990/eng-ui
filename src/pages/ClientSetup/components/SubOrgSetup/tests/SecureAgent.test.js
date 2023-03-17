import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import SecureAgent from '../SecureAgent/SecureAgent';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const setUp = (props = {}) => {
  return shallow(<SecureAgent {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => {},
  useSelector: () => ({
    clientPermission: {},
  }),
}));

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
        isFetchingClient: false,
        isGettingAgents: false,
        org: {
          orgId: '000111',
          orgUUID: '000000000000000',
          name: 'Test',
          suborgs: [
            {
              id: '000ABC',
              name: 'New',
              orgUUID: '0000000',
            },
          ],
        },
        agents: {
          agents: {
            active: true,
            agentVersion: '00.00',
            id: '00000',
            lastUpgraded: '2020-11-16T11:46:11Z',
            name: 'Test',
            orgId: '000ABC',
            platform: 'win64',
            readyToRun: false,
            subOrg: [
              {
                id: '0000AB',
                name: 'New',
                orgUUID: '0000000',
              },
            ],
          },
        },
      }),
      engagement: engagementInitialState,
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
        clientPermission: {
          permissions: {
            orgs: {
              add: false,
            },
          },
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    store.clearActions();
  });

  it.skip('should call useEffect when rendering ', () => {
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'boolean') {
        value = false;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    wrapper.setProps({ isOrgEnabled: true });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Secure-Agent`);
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(8);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    wrapper.setProps();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Secure-Agent`);
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(6);
  });

  it.skip('should render table ', () => {
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'boolean') {
        value = true;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    wrapper.setProps({ isOrgEnabled: true });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_secure_Agent`, 'Table');
    expect(comp.length).toBe(1);
  });

  it('should render no suborg text ', () => {
    const wrapper = setUp();
    wrapper.setProps();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-No-SecureAgent`);
    expect(comp.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
