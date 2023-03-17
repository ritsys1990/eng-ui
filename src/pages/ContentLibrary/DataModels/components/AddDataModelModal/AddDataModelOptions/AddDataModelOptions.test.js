import React from 'react';
import AddDataModelOptions from './AddDataModelOptions';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';

const setUp = (props = {}) => {
  return shallow(<AddDataModelOptions {...props} />);
};

window.scrollTo = jest.fn();

describe('Add Data Model Options', () => {
  let store;
  jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
  });

  it('should render radio options when rendering', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      onSelected: mockFn,
      value: '',
    });
    const modal = findByInstanceProp(wrapper, `TEST-Options`);
    expect(modal.length).toBe(1);
  });

  it('should trigger options change when rendering', () => {
    const mockFn = jest.fn();
    const wrapper = setUp({
      dataInstance: 'TEST',
      onSelected: mockFn,
      value: '',
    });
    const modal = findByInstanceProp(wrapper, `TEST-Options`);
    modal.invoke('onOptionChange')('value');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
