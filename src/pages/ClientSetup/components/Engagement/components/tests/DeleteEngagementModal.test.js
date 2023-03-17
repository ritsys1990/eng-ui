import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import DeleteEngagementModal from '../DeleteEngagementModal';
import { initialState } from '../../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../../store/engagement/actions';

const COMPONENT_NAME = 'DeleteEngagementModal';

const defaultProps = {
  isOpen: true,
  onClose: () => {},
  selectedEngagement: { id: '123' },
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteEngagementModal {...mergedProps} />);
};

describe('Delete Engagement Modal Wrapper Component', () => {
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
    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return [initial, mockSetState];
    });
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(0);
  });

  it('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(0);
  });

  it('should dispatch action on primary click', () => {
    const mockClose = jest.fn();
    const mockDeleteEngagement = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'deleteEngagement').mockImplementation(() => mockDeleteEngagement);

    const wrapper = setUp({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockDeleteEngagement).toHaveBeenCalled();
  });

  it('should close modal on secondary button', () => {
    const mockClose = jest.fn();

    const wrapper = setUp({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockClose).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
