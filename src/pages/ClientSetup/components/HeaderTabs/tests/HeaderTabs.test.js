import React, * as ReactHooks from 'react';
import HeaderTabs from '../HeaderTabs';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as clientStoreInitialState } from '../../../../../store/client/reducer';
import { initialState as securityStoreInitialState } from '../../../../../store/security/reducer';
import { ClientSetupTabs, RecertificationStatus } from '../../../constants/constants';

const COMPONENT_NAME = 'HeaderTabs';

const setUp = (props = {}) => {
  return shallow(<HeaderTabs {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => {
    return { clientId: '12345' };
  }),
}));

describe('Client Setup Page', () => {
  let store;
  let useSelectorFn;
  let useEffect;
  let mockSetState;
  let tabsState = [];

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientStoreInitialState,
      security: securityStoreInitialState.merge({
        clientRecertification: { status: RecertificationStatus.RECERTIFIED },
        externalClientRecertification: { status: RecertificationStatus.RECERTIFIED },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg)) {
        tabsState = arg;
      }
    });
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, COMPONENT_NAME, 'Tabs');
    expect(tabs.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, COMPONENT_NAME, 'Tabs');
    expect(tabs.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, COMPONENT_NAME, 'Tabs');
    expect(tabs.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should handle tab click - Client Setup', () => {
    const wrapper = setUp();
    const tabs = findByInstanceProp(wrapper, COMPONENT_NAME, 'Tabs');
    expect(tabs.length).toBe(1);
    tabs.invoke('onTabClicked')(ClientSetupTabs.CLIENT_SETUP);
    expect(mockSetState).toHaveBeenLastCalledWith(ClientSetupTabs.CLIENT_SETUP);
  });

  it.skip('should render users header with icon', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(tabsState.length).toBe(2);
    const tab = shallow(tabsState[1].label);
    expect(tab.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
