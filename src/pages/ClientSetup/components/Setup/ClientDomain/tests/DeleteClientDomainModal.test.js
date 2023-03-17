import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import DeleteClientDomainModal from '../DeleteClientDomainModal';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';

const setUp = (props = {}) => {
  return shallow(<DeleteClientDomainModal {...props} />);
};

window.scrollTo = jest.fn();

describe('Delete Client Domain', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);

    store.clearActions();
  });

  it('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const Modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(Modal.length).toBe(1);
  });

  it('should call button submit ', () => {
    const mockModalSubmit = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose: () => {} });
    const client = {
      domains: ['abc.com'],
    };

    wrapper.setProps({ client });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockModalSubmit).toHaveBeenCalledTimes(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
