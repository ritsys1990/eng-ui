import React, * as ReactHooks from 'react';
import ClientSetup from '../ClientSetup';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import * as NavContextHook from '../../../hooks/useNavContext';
import * as UseCheckAuth from '../../../hooks/useCheckAuth';
import LANGUAGE_DATA from '../../../languages/fallback.json';
import * as utils from '../utils/ClientSetup.utils';
import { initialState as engagementInitialState } from '../../../store/engagement/reducer';

const setUp = (props = {}) => {
  return shallow(<ClientSetup {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '12345' };
  }),
}));
const legacyUtilsMock = jest.requireMock('../../../utils/legacyUtils');
jest.mock('../../../utils/legacyUtils', () => ({
  isLegacyMode: false,
}));

describe('Client Setup Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: ImmutableMap({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
        isFetchingMyList: false,
        clientSetupState: {
          isStep1Completed: false,
          isStep2Completed: false,
          isStep3Completed: false,
          isStep4Completed: false,
          isStep5Completed: false,
          isStep6Completed: false,
        },
      }),
      security: ImmutableMap({
        me: {
          type: 'Deloitte',
        },
      }),
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, 'ClientSetup', 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, 'ClientSetup', 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(13);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, 'ClientSetup', 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(4);
  });

  it.skip('should not render anything when no permissions are available', () => {
    jest.spyOn(utils, 'hasPagePermissions').mockReturnValueOnce(false);

    const wrapper = setUp();
    expect(wrapper.children().length).toBe(0);
  });

  it.skip('should render non permissions view', () => {
    jest.spyOn(utils, 'hasPagePermissions').mockReturnValue(false);
    jest.spyOn(UseCheckAuth, 'default').mockImplementation(() => {
      return {
        permissions: { client_Recertify: { view: true }, client_External_Acknowledge: { view: true } },
        pagePermissions: { clientSetup_Setup: false },
      };
    });

    const wrapper = setUp();
    const NoPermissions = findByInstanceProp(wrapper, 'ClientSetup-NoPermissions');
    expect(NoPermissions.length).toBe(1);
  });

  it.skip('should render header bar when user has permissions', () => {
    jest.spyOn(utils, 'hasPagePermissions').mockReturnValue(true);
    jest.spyOn(UseCheckAuth, 'default').mockImplementation(() => {
      return {
        permissions: { client_Recertify: { view: true }, client_External_Acknowledge: { view: true } },
        pagePermissions: { clientSetup_Setup: true },
      };
    });

    const wrapper = setUp();
    const HeaderBar = findByInstanceProp(wrapper, 'ClientSetup', 'HeaderBar');
    expect(HeaderBar.length).toBe(1);
  });

  it.skip('should not have header tabs when in legacy mode', () => {
    legacyUtilsMock.isLegacyMode = true;
    const wrapper = setUp();
    const HeaderTabs = wrapper.find('HeaderTabs');
    expect(HeaderTabs.length).toBe(0);
    // Reset
    legacyUtilsMock.isLegacyMode = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
