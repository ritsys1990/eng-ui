import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import SyncEngagementsOmniaAlert from '../SyncEngagementsOmniaAlert';
import { initialState } from '../../../../../../store/engagement/reducer';

const COMPONENT_NAME = 'SyncEngagementsOmniaAlert';

const setUp = (props = {}) => {
  return shallow(<SyncEngagementsOmniaAlert {...props} />);
};

describe('Sync Engagements to Omnia Alert Component', () => {
  let store;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        areEngagementsSynchedToOmnia: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AlertDialog');
    expect(alert.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AlertDialog');
    expect(alert.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Sync Engagements to Omnia Alert Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        areEngagementsSynchedToOmnia: true,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render null when engagements are synched with Omnia', () => {
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AlertDialog');
    expect(alert.length).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
