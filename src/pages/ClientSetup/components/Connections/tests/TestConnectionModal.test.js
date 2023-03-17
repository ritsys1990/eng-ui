import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import TestConnectionModal from '../TestConnectionModal';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { findByInstanceProp } from 'src/utils/testUtils';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';
import { initialState as errorInitialState } from '../../../../../store/errors/reducer';

const defaultProps = {
  response: ['Success', 'Test result is success'],
  isOpen: true,
};

const COMPONENT_NAME = 'Test_Connection_Modal';

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<TestConnectionModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  // let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
      }),
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    // mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp({ connections: [] });
    expect(wrapper.exists()).toBe(true);
  });

  it('should render modal', () => {
    const wrapper = setUp({ connections: [] });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(comp.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
