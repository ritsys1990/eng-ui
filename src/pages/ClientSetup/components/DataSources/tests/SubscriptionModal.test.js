import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import SubscriptionModal, { SubscriptionModalInner } from '../SubscriptionModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as clientInitialState } from 'src/store/client/reducer';
import { initialState as engagementInitialState } from 'src/store/engagement/reducer';
import * as EngagementStoreActions from 'src/store/engagement/actions';
import { SubscriptionOptions } from '../constants';

const COMPONENT_NAME = 'SubscriptionModal';

const defaultProps = { isOpen: true };
const defaultPropsInner = {
  isOpen: true,
  onClose: () => {},
  onDidClose: () => {},
  action: '',
  subscription: {},
  dataSource: {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<SubscriptionModal {...mergedProps} />);
};

const setUpInner = (props = {}) => {
  const mergedProps = { ...defaultPropsInner, ...props };

  return shallow(<SubscriptionModalInner {...mergedProps} />);
};

describe('Subscription Modal Component', () => {
  let store;
  let useEffectFn;
  let useStateFn;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    window.scrollTo = jest.fn();
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'boolean') {
        value = true;
      }

      return [value, mockSetState];
    });
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'SubscriptionModalInner');
    expect(modal.length).toBe(1);
  });

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'SubscriptionModalInner');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(0);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'SubscriptionModalInner');
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'SubscriptionModalInner');
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call on close when clicking the modal', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ onDidClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'SubscriptionModalInner');
    expect(modal.length).toBe(1);
    modal.invoke('onDidClose')();
    expect(mockClose).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Subscription Modal Inner Component', () => {
  let store;
  let useEffectFn;
  let useStateFn;
  let useSelectorFn;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState,
      engagement: engagementInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it.skip('should render', () => {
    const wrapper = setUpInner();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should render reject', () => {
    const wrapper = setUpInner({ action: SubscriptionOptions.REJECT });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should render approve', () => {
    const wrapper = setUpInner({ action: SubscriptionOptions.APPROVE });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUpInner();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(4);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUpInner();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUpInner();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(0);
  });

  it('should call on close when clicking the modal', () => {
    const mockClose = jest.fn();

    const wrapper = setUpInner({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalled();
  });

  it.skip('should handle the text area onChange prop', () => {
    const event = {
      target: {
        value: '1',
      },
    };

    const wrapper = setUpInner({ action: SubscriptionOptions.REJECT });
    const textarea = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Textarea');
    expect(textarea.length).toBe(1);
    textarea.invoke('onChange')(event);
    expect(mockSetState).toHaveBeenLastCalledWith(event.target.value);
  });

  it('should handle submit on reject', () => {
    const subscription = { id: 1, name: 'Test' };
    const mockReject = jest.fn().mockImplementation(() => {});
    jest.spyOn(EngagementStoreActions, 'rejectDataSourceSubscription').mockImplementation(() => mockReject);

    const wrapper = setUpInner({ action: SubscriptionOptions.REJECT, subscription });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockReject).toHaveBeenCalled();
  });

  it('should handle submit on approve', () => {
    const subscription = { id: 1, name: 'Test' };
    const mockApprove = jest.fn().mockImplementation(() => {});
    jest.spyOn(EngagementStoreActions, 'approveDataSourceSubscription').mockImplementation(() => mockApprove);

    const wrapper = setUpInner({ action: SubscriptionOptions.APPROVE, subscription });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockApprove).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
