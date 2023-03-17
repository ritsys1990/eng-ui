import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import ReconcileModalWrapper from '../ReconcileModalWrapper';
import { initialState } from '../../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../../store/engagement/actions';

const COMPONENT_NAME = 'ReconcileModalWrapper';

const setUp = (props = {}) => {
  return shallow(<ReconcileModalWrapper {...props} />);
};

describe('Reconcile Modal Wrapper Component', () => {
  let store;
  let useEffectFn;
  let useStateFn;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        isReconcileEngagementsModalOpen: true,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      }

      return [initial, mockSetState];
    });
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
  });

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch action when clicking on details option', () => {
    const mockUpdateReconcileModal = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'updateIsReconcileModalOpen').mockImplementation(() => mockUpdateReconcileModal);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockUpdateReconcileModal).toHaveBeenCalledTimes(1);
  });

  it.skip('should trigger state change when removing from dom', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onRemoveFromDom')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Reconcile Modal Wrapper Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        isReconcileEngagementsModalOpen: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it.skip('should render null when engagements are not reconciled', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
