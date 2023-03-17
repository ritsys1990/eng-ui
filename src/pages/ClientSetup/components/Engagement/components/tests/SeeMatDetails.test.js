import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import SeeMatDetails from '../SeeMatDetails';
import { initialState } from '../../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../../store/engagement/actions';

const COMPONENT_NAME = 'EngagementSeeDetails';

const setUp = (props = {}) => {
  return shallow(<SeeMatDetails {...props} />);
};

describe('See Mat Details Component', () => {
  let store;
  let useEffectFn;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        clientEngagementsList: [{ id: 1, name: 'Engagement 1' }],
        areEngagementsReconciled: true,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  it('should render', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Button');
    expect(button.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Button');
    expect(button.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(4);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Button');
    expect(button.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it('should dispatch action when clicking on details option', () => {
    const mockUpdateReconcileModal = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'updateIsReconcileModalOpen').mockImplementation(() => mockUpdateReconcileModal);

    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockUpdateReconcileModal).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('See Mat Details Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        areEngagementsReconciled: false,
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render null when engagements are not reconciled', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Button');
    expect(button.length).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
