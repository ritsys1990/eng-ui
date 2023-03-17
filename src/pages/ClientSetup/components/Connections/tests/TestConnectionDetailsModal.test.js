import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import TestConnectionDetailsModal from '../TestConnectionDetailsModal';
import { ComponentNames } from '../constants';

const { TEST_CONNECTION_DETAILS_MODAL: COMPONENT_NAME } = ComponentNames;

const defaultProps = {
  handleClose: () => {},
  message: 'Failure Message',
  isOpen: true,
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<TestConnectionDetailsModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('test connection details Component', () => {
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

    store.clearActions();
  });

  it('should call test connection details modal', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call onclose method', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onClose')();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
