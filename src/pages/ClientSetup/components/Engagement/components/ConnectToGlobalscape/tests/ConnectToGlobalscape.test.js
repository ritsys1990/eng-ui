import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import ConnectToGlobalscape from '../ConnectToGlobalscape';
import { initialState } from '../../../../../../../store/engagement/reducer';

const COMPONENT_NAME = 'ConnectToGlobalscape';

const setUp = (props = {}) => {
  return shallow(<ConnectToGlobalscape {...props} />);
};

describe('ConnectToGlobalscape Component', () => {
  let store;
  let useEffectFn;
  let useSelectorFn;
  let useStateFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        clientEngagementsList: [
          { id: '123', name: 'Engagement' },
          { id: '456', name: 'Engagement 2', efT_EXT_EngagementLink: true, efT_INT_EngagementLink: true },
        ],
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
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
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const box = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ForwardRef');
    expect(box.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should open modal when clicking on button', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Connect`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should close modal', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'ConnectToGlobalscapeModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
