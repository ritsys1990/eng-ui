import React from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LocalizedDate from './LocalizedDate';

const setUp = (props = {}) => {
  return shallow(<LocalizedDate {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

const initialState = {
  settings: ImmutableMap({
    localeFormats: { date: 'M/D/YYYY' },
    defaultLocaleFormats: { date: 'M/D/YYYY', time: 'hh:mm:ss A' },
  }),
};

describe('Localized Data', () => {
  let state;
  beforeEach(() => {
    state = { ...initialState };
    configureStore([thunk])(() => state);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state));
  });

  it('should render', () => {
    const wrapper = setUp();
    expect(wrapper.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
