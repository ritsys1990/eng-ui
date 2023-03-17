import React, * as ReactHooks from 'react';
import SubscriptionsTable, { renderCTA, renderStatus } from '../SubscriptionsTable';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from 'src/utils/testUtils';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { ComponentNames, SubscriptionStatus } from '../constants';
import { initialState as securityInitialState } from 'src/store/security/reducer';
import { initialState as clientInitialState } from 'src/store/client/reducer';
import { initialState as engagementInitialState } from 'src/store/engagement/reducer';

const { SUBS_TABLE: COMPONENT_NAME } = ComponentNames;

const defaultProps = {
  subscription: {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<SubscriptionsTable {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Setup Subscriptions Table', () => {
  let store;
  let useEffectSpy;
  let useStateSpy;
  let mockSetState;
  let useSelectorFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      security: securityInitialState.merge({
        clientPermission: {
          permissions: {
            dataSourceSubscription: {
              approve: true,
            },
          },
        },
      }),
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    useEffectSpy = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateSpy = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it.skip('should render', () => {
    const wrapper = setUp({ subscriptions: [] });
    expect(wrapper.exists()).toBe(true);
    expect(useStateSpy).toHaveBeenCalledTimes(7);
    expect(useEffectSpy).toHaveBeenCalledTimes(2);
    expect(useSelectorFn).toHaveBeenCalledTimes(7);
  });

  it('should pass subscriptions to table', () => {
    const subscriptions = [{ id: 'xxx', name: 'dummy' }];
    const wrapper = setUp({ subscriptions });
    const table = findByInstanceProp(wrapper, COMPONENT_NAME, 'Table');
    const rows = table.prop('rows');
    expect(rows).toMatchObject(subscriptions);
  });

  it.skip('should handle subscription modal close', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'SubscriptionModal');
    modal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should handle subscription modal did close', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'SubscriptionModal');
    modal.invoke('onDidClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  it.skip('should handle rejection reason modal close', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'RejectionReasonModal');
    modal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render status', () => {
    const statusComp = shallow(renderStatus(SubscriptionStatus.WAITING_APPROVAL));
    expect(statusComp.exists()).toBe(true);
  });

  it('should render cta', () => {
    const onClick = jest.fn();
    const subscription = { id: 'xx', name: 'xx', status: SubscriptionStatus.WAITING_APPROVAL };
    const statusComp = shallow(renderCTA(subscription, onClick, true));
    expect(statusComp.exists()).toBe(true);
    statusComp.find('Button').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render cta menu', () => {
    const subscriptions = [{ id: 'xx', name: 'xx', status: SubscriptionStatus.WAITING_APPROVAL }];
    const wrapper = setUp({ subscriptions });
    const ctaMenu = wrapper.find('CtaMenu');
    expect(ctaMenu.exists()).toBe(true);
    const ctaMenuCloseHandler = ctaMenu.prop('onClose');
    const ctaOptionHanlder = ctaMenu.prop('onOptionClicked');
    ctaOptionHanlder({ id: 'approve' });
    ctaOptionHanlder({ id: 'reject' });
    ctaMenuCloseHandler();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
