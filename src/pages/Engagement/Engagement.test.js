import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import Engagement from './Engagement';
import { initialState as workpaperInitialState } from '../../store/workpaperProcess/reducer';
import { initialState as engagementInitialState } from '../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../store/client/reducer';
import { initialState as securityInitialState } from '../../store/security/reducer';
import routerData from 'react-router';
import LANGUAGE_DATA from '../../languages/fallback.json';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import * as NavContextHook from '../../hooks/useNavContext';
import { Theme } from 'cortex-look-book';
import * as CheckAuthHooks from '../../hooks/useCheckAuth';

const mockLocation = {
  path: '/engagements/:engagement/workpapers',
  hash: '',
  search: '',
  isExact: true,
  state: '',
  params: {
    engagementId: '8da7d33e-79d7-4624-b1d3-0f3186e27529',
  },
};

const COMPONENT_NAME = 'Engagement';

const setUp = (props = {}) => {
  return shallow(<Engagement {...props} />);
};

describe('Engagement: Initial render', () => {
  let store;
  let mockSetState;
  let useStateFn;
  let useEffectFn;
  const options = { options: { useEngagementPermissions: true } };

  beforeEach(() => {
    store = configureStore([thunk])({
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      engagement: engagementInitialState.merge({
        engagement: {
          clientId: '21104070-bb96-4756-9fd8-8b6eba20615d',
          sourceState: 'Manual',
          name: 'Danny_Eng',
          matClientId: null,
          matNumber: null,
        },
      }),
      wpProcess: workpaperInitialState.merge({
        general: { readOnlyfromWP: 'test' },
      }),
    });
    /*  const pagePermissions = {
      [options.useEngagementPermissions]: true,
    }; */
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(routerData, 'useParams').mockReturnValue({ workpaperId: 123, outputId: 123 });
    jest.spyOn(routerData, 'useLocation').mockReturnValue(mockLocation);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ options });
    jest.spyOn(NavContextHook, 'default').mockImplementation(() => {
      return { crumbs: [] };
    });
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });

  it.skip('should render useStateFn', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(12);
  });

  it.skip('should render useEffectFn', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(7);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
