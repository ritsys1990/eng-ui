import React, * as ReactHooks from 'react';
import { AddConnectionButton, StatusField, CtaButton, CtaMenu, TestConnection } from '../TableFields';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from 'src/languages/fallback.json';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const setUp = (props = {}) => {
  return shallow(<StatusField {...props} />);
};

window.scrollTo = jest.fn();
jest.mock('react-router-dom', () => ({}));

describe('Client Setup Status Field', () => {
  let store;
  let mockSetState;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
      }),
      engagement: engagementInitialState,
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render StatusField', () => {
    const wrapper = setUp();
    expect(wrapper.exists()).toBe(true);
  });

  it('should render StatusField button when needed', () => {
    const wrapper = setUp({ status: 'Configured' });
    wrapper.setProps({ status: 'Configured' });
    const button = wrapper.find('Button');
    expect(button.exists()).toBe(true);
  });

  it('it should trigger click handler', () => {
    const event = {
      currentTarget: {
        closest: jest.fn(),
      },
    };
    const spy = jest.spyOn(event.currentTarget, 'closest');
    const wrapper = setUp({ status: 'Configured' });
    const button = wrapper.find('Button');
    button.simulate('click', event);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render addConnection button', () => {
    const wrapper = shallow(<AddConnectionButton />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render addConnection button', () => {
    const wrapper = shallow(<CtaButton />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render CTA menu', () => {
    const wrapper = shallow(<CtaMenu options={[]} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render test connection', () => {
    const wrapper = shallow(<TestConnection />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should call test connection button', () => {
    const connectionData = {
      props: {
        id: '123',
      },
      setIsTestModal: jest.fn(),
      setResponse: jest.fn(),
    };

    const wrapper = shallow(<TestConnection />);
    wrapper.setProps({ connectionData });
    const button = wrapper.find('Button');
    expect(button.exists()).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
