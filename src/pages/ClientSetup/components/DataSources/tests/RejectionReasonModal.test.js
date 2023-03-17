import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import RejectionReasonModal from '../RejectionReasonModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';

const COMPONENT_NAME = 'RejectionReasonModal';

const defaultProps = { isOpen: true, onClose: () => {}, subscription: {} };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<RejectionReasonModal {...mergedProps} />);
};

describe('Rejection Reason Modal Component', () => {
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

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(1);
  });

  it('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(0);
  });

  it('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
