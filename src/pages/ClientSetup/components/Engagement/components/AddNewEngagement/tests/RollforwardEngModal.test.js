import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import RollForwardEngModal from '../RollForwardEngModal';
import * as EngagementStoreActions from '../../../../../../../store/engagement/actions';

const COMPONENT_NAME = 'RollForwardEngModal';

const defaultProps = {
  rollforwardData: {},
  closeModal: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<RollForwardEngModal {...mergedProps} />);
};

describe('Rollforward Engagement Modal Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;
  let mockUseImperative;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useImperativeHandle').mockImplementation((a, b) => {
      mockUseImperative = b();
    });
  });

  it('should render', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(2);
  });

  it.skip('should update checked value', () => {
    const wrapper = setUp();
    const treeContainer = findByInstanceProp(wrapper, `${COMPONENT_NAME}-TreeContainer`, 'ForwardRef');
    const tree = treeContainer.childAt(0);
    expect(tree.length).toBe(1);
    tree.invoke('onCheck')('1');
    expect(mockSetState).toHaveBeenCalled();
  });

  it.skip('should handle submit', () => {
    const mockClose = jest.fn().mockImplementation(() => {});
    const mockRollforward = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'rollforwardEngagement').mockImplementation(() => mockRollforward);

    const wrapper = setUp({ closeModal: mockClose });
    const tree = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(tree.length).toBe(1);
    mockUseImperative.submit();
    expect(mockRollforward).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
