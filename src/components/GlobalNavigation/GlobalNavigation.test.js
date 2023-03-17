import React from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { findByInstanceProp } from '../../utils/testUtils';
import GlobalNavigation, { COMPONENT_NAME } from './GlobalNavigation';
import { initialState as SecurityInitialState } from '../../store/security/reducer';
import { initialState as ClientInitialState } from '../../store/client/reducer';
import { initialState as EnagagementInitialState } from '../../store/engagement/reducer';
import { initialState as SettingsInitialState } from '../../store/settings/reducer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'foo',
  }),
}));

const setUp = (props = {}) => {
  return shallow(<GlobalNavigation {...props} />);
};

describe('Global Navigation Component', () => {
  beforeEach(() => {
    const store = configureStore([thunk])({
      security: SecurityInitialState,
      client: ClientInitialState,
      engagement: EnagagementInitialState,
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
