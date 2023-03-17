import React, * as ReactHooks from 'react';
import { SubsStatusesField, SubsStatusField } from '../TableFields';
import { shallow } from 'enzyme';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from 'src/utils/testUtils';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { ComponentNames, SubscriptionStatus } from '../constants';

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const initialState = {
  settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
};

describe('Client Setup TableFields', () => {
  let state;
  let compState;
  let useEffect;
  let useState;
  let setHookSate;
  beforeEach(() => {
    state = { ...initialState };
    compState = null;
    setHookSate = jest.fn().mockImplementation(value => {
      compState = value;
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => {});
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [compState || initial, setHookSate]);
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it.skip('should render SubsStatusesField', () => {
    const wrapper = shallow(<SubsStatusesField subscriptions={[]} />);
    expect(wrapper.exists()).toBe(true);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it('it should render SubsStatusesField empty state', () => {
    const wrapper = shallow(<SubsStatusesField />);
    const empty = findByInstanceProp(wrapper, `${ComponentNames.SUBS_STATUSES_FIELD}-EmptyState`);
    expect(empty.exists()).toBe(true);
  });

  it.skip('it should process SubsStatusesField status in local state', () => {
    const wrapper = shallow(<SubsStatusesField />);
    const subscriptions = [{ id: '1', name: 'dummy1', status: 'Subscribed' }];
    wrapper.setProps({ subscriptions });
    expect(useEffect).toHaveBeenCalledTimes(2);
    expect(useState).toHaveBeenCalledTimes(2);
  });

  it.skip('should group SubsStatusesField statuses', () => {
    const subscriptions = [
      { id: '1', name: 'dummy1', status: 'Subscribed' },
      { id: '2', name: 'dummy2', status: 'Subscribed' },
    ];
    shallow(<SubsStatusesField subscriptions={subscriptions} />);
    expect(compState).toBe('Subscribed: 2');
  });

  it.skip('it should trigger SubsStatusesField status click handler', () => {
    const event = {
      currentTarget: {
        closest: jest.fn(),
      },
    };
    const spy = jest.spyOn(event.currentTarget, 'closest');
    setHookSate('xxxx');
    const wrapper = shallow(<SubsStatusesField subscriptions={[]} />);
    const button = findByInstanceProp(wrapper, `${ComponentNames.SUBS_STATUSES_FIELD}-StatusButton`);
    button.simulate('click', event);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it.skip('should render SubsStatusField', () => {
    const wrapper = shallow(<SubsStatusField />);
    expect(wrapper.exists()).toBe(true);
    expect(useEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should process status accordingly', () => {
    const wrapper = shallow(<SubsStatusField status={SubscriptionStatus.SUBSCRIBED} />);
    expect(useState).toHaveBeenCalledTimes(1);
    wrapper.setProps({ status: SubscriptionStatus.WAITING_APPROVAL });
    expect(useState).toHaveBeenCalledTimes(2);
    wrapper.setProps({ status: SubscriptionStatus.REJECTED });
    expect(useState).toHaveBeenCalledTimes(3);
    wrapper.setProps({ status: 'Unrecognize Status' });
    expect(useState).toHaveBeenCalledTimes(4);
    wrapper.setProps({ status: null });
    expect(useState).toHaveBeenCalledTimes(5);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
