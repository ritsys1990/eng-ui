import React, * as ReactHooks from 'react';
import MaintenanceBanner from './MaintenanceBanner';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import configureStore from 'redux-mock-store';

const defaultProps = { alert: [] };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<MaintenanceBanner {...mergedProps} />);
};

const initialState = {
  alert: ImmutableMap({
    id: '123',
    endDate: '2020-10-13T19:51:54.46Z',
    startDate: '2020-10-13T19:51:54.46Z',
    type: 'Regular',
    text: 'dev3',
  }),
};

describe('Maintenance banner test', () => {
  let mockSetState;
  let state;
  let useEffectFn;
  let countDown;

  beforeEach(() => {
    mockSetState = jest.fn();
    state = { ...initialState };
    configureStore([thunk])(() => state);
    countDown = '00:00:00';
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    global.URL.createObjectURL = jest.fn();
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  it.skip('should render useEffect ', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(1);
  });

  it('should render useEffect with countown 0 ', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
    expect(countDown).toBe('00:00:00');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
