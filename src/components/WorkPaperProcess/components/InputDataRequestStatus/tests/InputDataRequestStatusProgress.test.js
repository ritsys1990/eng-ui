import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { InputDataRequestStatusProgress, COMPONENT_NAME } from '../InputDataRequestStatusProgress';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { DATA_REQUEST_STATUS } from '../constants/InputDataRequestStatus.const';

const setUp = (props = {}) => {
  return shallow(<InputDataRequestStatusProgress {...props} />);
};

describe('Input Data Request Status Progress Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
  });

  it('should render component', () => {
    const wrapper = setUp({
      dataRequestStatus: { [DATA_REQUEST_STATUS.DRAFT]: 1 },
    });
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });
});
