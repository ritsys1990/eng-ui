import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';

import RollforwardLegalHoldModal from '../RollforwardLegalHoldModal';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';

const COMPONENT_NAME = 'RollforwardLegalHoldModal';

const defaultProps = { isOpen: true, onClose: () => {}, onOk: () => {} };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<RollforwardLegalHoldModal {...mergedProps} />);
};

describe('Rollforward Legal Hold Modal Component', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    window.scrollTo = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call onOk on primaryButton', () => {
    const mockOnOk = jest.fn();

    const wrapper = setUp({ onOk: mockOnOk });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockOnOk).toHaveBeenCalledTimes(1);
  });

  it('should call onClose on secondaryButton', () => {
    const mockOnClose = jest.fn();

    const wrapper = setUp({ onClose: mockOnClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onSecondaryButtonClick')();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
