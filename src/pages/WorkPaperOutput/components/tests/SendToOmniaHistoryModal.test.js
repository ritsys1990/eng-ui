import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../utils/testUtils';
import SendToOmniaHistoryModal, { COMPONENT_NAME } from '../SendToOmniaHistoryModal';
import { initialState as DataExchangeInitialState } from '../../../../store/dataExchange/reducer';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import { Map as ImmutableMap } from 'immutable';

const defaultProps = { isModalOpen: false };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<SendToOmniaHistoryModal {...mergedProps} />);
};

describe('ListPopover: Initial render', () => {
  let store;

  beforeEach(() => {
    store = configureStore([thunk])({
      dataExchange: DataExchangeInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });
    const mockDispatch = jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, jest.fn()]);
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}`);
    expect(component.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
