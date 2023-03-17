import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import ClientDomain from '../ClientDomain';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';

const setUp = (props = {}) => {
  return shallow(<ClientDomain {...props} />);
};

window.scrollTo = jest.fn();
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));
describe('Client Domain Component', () => {
  let store;
  let useEffectFn;
  let useStateFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    store.clearActions();
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(8);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(14);
  });

  it('should call render Table ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const table = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(table.length).toBe(1);
  });

  it('should call render no domains message ', () => {
    const wrapper = setUp();
    const client = {
      domains: [],
    };
    wrapper.setProps({ client });
    const message = findByInstanceProp(wrapper, `${COMPONENT_NAME}-No_Domains`);
    expect(message.length).toBe(1);
  });

  it.skip('should call add domain Change ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-AddDomain`);
    Button.invoke('onClick')();
    wrapper.update();
    expect(mockSetState).toBeCalled();
  });

  it.skip('should call add handleClose ', () => {
    const wrapper = setUp();
    const client = {
      domains: ['abc.com'],
    };
    wrapper.setProps({ client });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add_Client_Domain`);
    Button.invoke('handleClose')();
    expect(mockSetState).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
