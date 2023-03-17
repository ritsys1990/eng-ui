import React, * as ReactHooks from 'react';
import Setup, { COMPONENT_NAME } from '../Setup';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from '../../../../../hooks/useNavContext';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';

const client = {
  id: '123',
  name: 'test client',
  matClientId: null,
  matCustomerNumber: null,
  orgId: '01012F',
  industries: ['6c6d766e-430b-4a9a-ad45-97e53291bed3'],
  countries: ['3943bf16-24c4-4826-8adc-4494687773c2'],
  domains: ['gmail.com'],
  fiscalYearEnd: { day: 22, month: 12 },
  entities: [],
  storageSpaceId: '5e73863b1dc4750162758b0a',
  wbs: null,
  sdsId: null,
  financialDate: null,
  containerId: '1',
  containerCode: 'US',
  geoCode: 'AME',
  memberFirmCode: 'US',
  countryCode: 'US',
  usesSecureAgent: false,
};

const setUp = (props = { client }) => {
  return shallow(<Setup {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '123' };
  }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('Client Setup Page - Step 1 General details', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: ImmutableMap({
        client,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'ForwardRef');
    expect(spinner.length).toBe(1);
  });

  it('should not render clientSetup', () => {
    const wrapper = setUp();
    const domains = findByInstanceProp(wrapper, `${COMPONENT_NAME}_ClientDomain`, 'ClientDomain');
    expect(domains.length).toBe(0);
  });

  it('should render clientSetup', () => {
    const clientWithSA = { ...client, usesSecureAgent: true };
    store = configureStore([thunk])({
      client: ImmutableMap({
        client: clientWithSA,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    const wrapper = setUp();
    const domains = findByInstanceProp(wrapper, `${COMPONENT_NAME}_ClientDomain`, 'ClientDomain');
    expect(domains.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
