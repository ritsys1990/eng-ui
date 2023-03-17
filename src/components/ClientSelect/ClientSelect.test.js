import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import ClientSelect from './ClientSelect';
import { initialState as ClientInitialState } from '../../store/client/reducer';

const COMPONENT_NAME = 'Client';

const setUp = (props = {}) => {
  return shallow(<ClientSelect {...props} />);
};

describe('ListPopover: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let useEffectFn;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: ClientInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockSetState = jest.fn().mockImplementation();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    expect(component.length).toBe(1);
  });

  it.skip('should render useEffect ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call mocksetState on input change ', () => {
    const wrapper = setUp();

    wrapper.setProps();
    const comp = findByInstanceProp(wrapper, COMPONENT_NAME, 'Select');
    comp.invoke('onInputChange')('test');
    expect(mockSetState).toHaveBeenLastCalledWith('test');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
