import React, * as ReactHooks from 'react';
import GeneralDetails, { COMPONENT_NAME } from '../GeneralDetails';
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
import { initialState as engagementInitialState } from '../../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../../store/security/reducer';

const mockIndustryId = '6c6d766e-430b-4a9a-ad45-97e53291bed3';
const mockCountry = {
  containerCode: 'US',
  containerName: 'United States',
  countryCode: 'US',
  countryName: 'United States',
  geoCode: 'AME',
  memberFirmCode: 'US',
};

const client = {
  id: '123',
  name: 'test client',
  matClientId: null,
  matCustomerNumber: null,
  orgId: '01012F',
  industries: [mockIndustryId],
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

const permissions = { globalClient: { add: true } };

const defaultProps = {};

const setUp = (props = { client }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<GeneralDetails {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '123' };
  }),
}));
const legacyUtilsMock = jest.requireMock('../../../../../../utils/legacyUtils');
jest.mock('../../../../../../utils/legacyUtils', () => ({
  isLegacyMode: false,
}));

describe('Client Setup Page - Step 1 General details', () => {
  let store;
  let useSelectorFn;
  let useEffect;

  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client,
        isFetchingMyList: false,
      }),
      bundles: ImmutableMap({
        tagsList: [
          {
            items: [
              {
                industries: [
                  {
                    id: mockIndustryId,
                    name: 'Manufacturing',
                  },
                ],
              },
            ],
          },
        ],
      }),
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
        permissions: {
          permissions: { globalClient: { add: true } },
        },
        countries: [mockCountry],
      }),
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    tagsHelper.filterTagsByTagGroup = jest.fn().mockReturnValue([
      {
        id: mockIndustryId,
        name: 'Manufacturing',
      },
    ]);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });

    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });

    store.clearActions();
  });

  it('should render', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useEffect when rendering ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const spinner = findByInstanceProp(wrapper, COMPONENT_NAME, 'Spinner');
    expect(spinner.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(5);
  });

  it.skip('should change client name ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Client_Name`, 'Input');
    input.simulate('change', { target: { value: 'new name' } });
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should change fiscal end year month ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Fiscal_Year_End_Month`, 'Input');
    input.simulate('change', { target: { value: '1' } });
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should change fiscal end year day ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Fiscal_Year_End_Day`, 'Input');
    input.simulate('change', { target: { value: '1' } });
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should change industries ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Industries`, 'IndustrySelect');
    input.simulate('change', { target: { value: '1' } });
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should submit ', () => {
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ pagePermissions: {}, permissions });
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Save`, 'Button');
    input.simulate('click');
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it('should render reconcile Alert', () => {
    const wrapper = setUp({ client });
    const alertBox = findByInstanceProp(wrapper, COMPONENT_NAME, 'AlertDialog');
    expect(alertBox.length).toBe(1);
  });

  it.skip('should change modal state when clicking on reconcile', () => {
    const wrapper = setUp({ client });
    const reconcileButton = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Reconcile`, 'Button');
    expect(reconcileButton.length).toBe(1);
    reconcileButton.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call on change on selecting yes', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const securAgentCheckBox = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Yes_Option`);
    expect(securAgentCheckBox.length).toBe(1);
    securAgentCheckBox.invoke('onChange')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call on change on selecting No', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const securAgentCheckBox = findByInstanceProp(wrapper, `${COMPONENT_NAME}_No_Option`);
    expect(securAgentCheckBox.length).toBe(1);
    securAgentCheckBox.invoke('onChange')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should not have secure agent question when in legacy mode', () => {
    legacyUtilsMock.isLegacyMode = true;
    const wrapper = setUp();
    const secureAgentCheckBoxNo = findByInstanceProp(wrapper, `${COMPONENT_NAME}_No_Option`);
    const secureAgentCheckBoxYes = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Yes_Option`);
    expect(secureAgentCheckBoxNo.length).toBe(0);
    expect(secureAgentCheckBoxYes.length).toBe(0);
    // Reset
    legacyUtilsMock.isLegacyMode = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Client Setup General Section Modal rendered', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client,
        isFetchingMyList: false,
      }),
      bundles: ImmutableMap({
        tagsList: [
          {
            items: [
              {
                industries: [
                  {
                    id: mockIndustryId,
                    name: 'Manufacturing',
                  },
                ],
              },
            ],
          },
        ],
      }),
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
        permissions: {
          permissions: { globalClient: { add: true } },
        },
        countries: [mockCountry],
      }),
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      }

      return [initial, mockSetState];
    });
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it.skip('should render modal', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const reconcileButton = findByInstanceProp(wrapper, COMPONENT_NAME, 'ClientReconcileModal');
    expect(reconcileButton.length).toBe(1);
  });

  it.skip('should change modal state when clicking on modal close', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const reconcileButton = findByInstanceProp(wrapper, COMPONENT_NAME, 'ClientReconcileModal');
    expect(reconcileButton.length).toBe(1);
    reconcileButton.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should change modal state when modal not rendered', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const reconcileButton = findByInstanceProp(wrapper, COMPONENT_NAME, 'ClientReconcileModal');
    expect(reconcileButton.length).toBe(1);
    reconcileButton.invoke('onRemoveFromDom')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render see details button', () => {
    const customClient = {
      ...client,
      matClientId: 123,
    };

    const wrapper = setUp({ client: customClient });
    const seeDetailsButton = findByInstanceProp(wrapper, `${COMPONENT_NAME}-SeeDetails`, 'Button');
    expect(seeDetailsButton.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
