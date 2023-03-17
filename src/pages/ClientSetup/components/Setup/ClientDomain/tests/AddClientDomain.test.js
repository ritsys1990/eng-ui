import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import { COMPONENT_NAME } from '../constants/constants';
import AddClientDomain from '../AddClientDomain';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';

const setUp = (props = {}) => {
  return shallow(<AddClientDomain {...props} />);
};

window.scrollTo = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

describe('Add Client Domain', () => {
  let store;
  let mockSetState;
  let imperativeObject;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useImperativeHandle').mockImplementation((param1, param2) => {
      imperativeObject = param2();
    });

    store.clearActions();
  });

  it('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const Modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Spinner`);
    expect(Modal.length).toBe(1);
  });

  it.skip('should change domain name ', () => {
    const wrapper = setUp();
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Domain_Name`, 'Input');
    input.simulate('change', { target: { value: 'abc.com' } });
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should call useImperative function  ', () => {
    const wrapper = setUp();
    imperativeObject.submit();
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should call useDispatch function  ', () => {
    const client = {
      domains: ['abc.com'],
    };
    const wrapper = setUp();
    const spyOnUseDispatch = jest.spyOn(ReactReduxHooks, 'useDispatch').mockReturnValue({ client });
    imperativeObject.submit(spyOnUseDispatch());
    wrapper.update();
    expect(spyOnUseDispatch).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
