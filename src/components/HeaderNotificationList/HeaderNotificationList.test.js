import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import HeaderNotificationList from './HeaderNotificationList';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import { Theme } from 'cortex-look-book';

const defaultProps = { hideHeaderActions: false, hideGlobalNavigation: false };
const setUp = (props = { theme: Theme }) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<HeaderNotificationList {...mergedProps} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const item = {
  userEmail: 'test@test.com',
  title: 'Title 1',
  creationDate: '12122021',
  text: 'Text 1',
  isRead: false,
  type: 'Alert',
  entityLink: null,
  entityLinkTitle: null,
  pictureLink: null,
  id: '1234',
};

const COMPONENT_NAME = 'HeaderNotificationList';
const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  client: ImmutableMap({
    noticesBlob: {
      caller: 'tou',
    },
    fetchingNotices: false,
  }),
  notifications: ImmutableMap({
    unreadCount: 10,
    allHeaderList: {
      totalCount: 2,
      items: [item, item],
    },
    allHeaderFetched: [item],
    isFetching: false,
  }),
};

describe('Header test', () => {
  let state;
  let store;
  let mockSetState;
  let useEffectFn;
  let useDispatchFn;

  beforeEach(() => {
    state = { ...initialState };
    store = configureStore([thunk])(() => state);
    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it.skip('should render useEffect', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it('should render first notification list', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({ handleMarkAsRead: mockFn });
    const notificationList = findByInstanceProp(wrapper, `${COMPONENT_NAME}-0`);
    expect(notificationList.length).toBe(1);
    notificationList.invoke('onClick')('1234', false);
    expect(useDispatchFn).toHaveBeenCalled();
  });

  it('should render second notification list', () => {
    const wrapper = setUp();
    const notificationList = findByInstanceProp(wrapper, `${COMPONENT_NAME}-1`);
    expect(notificationList.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
