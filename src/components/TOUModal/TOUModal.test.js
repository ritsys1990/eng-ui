import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByInstanceProp } from '../../utils/testUtils';
import TOUModal from './TOUModal';
import { COMPONENT_NAME } from './constants/TOUModal.const';
import { initialState as SecurityInitialState } from '../../store/security/reducer';
import { initialState as SettingsInitialState } from '../../store/settings/reducer';

const setUp = (props = {}) => {
  return shallow(<TOUModal {...props} />);
};

describe('TOU Modal Component', () => {
  beforeEach(() => {
    const store = configureStore([thunk])({
      security: SecurityInitialState,
      settings: SettingsInitialState,
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => Promise.resolve(true));
  });

  it('should render component', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME);

    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
