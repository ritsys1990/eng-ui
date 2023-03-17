import React, * as ReactHooks from 'react';
import CreateStorage, { COMPONENT_NAME } from '../CreateStorage';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../../../hooks/useCheckAuth';
import * as NavContextHook from '../../../../../../hooks/useNavContext';
import * as tagsHelper from '../../../../../../utils/tagsHelper';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';

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
  storageSpaceId: null,
  wbs: null,
  sdsId: null,
  financialDate: null,
  containerId: '1',
  containerCode: 'US',
  geoCode: 'AME',
  memberFirmCode: 'US',
  countryCode: 'US',
};

const setUp = (props = { client }) => {
  return shallow(<CreateStorage {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '123' };
  }),
}));

describe('Client Setup Page - Step 1 Create storage space', () => {
  let store;
  let mockSetState;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: ImmutableMap({
        createStorageInProgress: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    tagsHelper.filterTagsByTagGroup = jest.fn().mockReturnValue([
      {
        id: '6c6d766e-430b-4a9a-ad45-97e53291bed3',
        name: 'Manufacturing',
      },
    ]);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {} });
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
