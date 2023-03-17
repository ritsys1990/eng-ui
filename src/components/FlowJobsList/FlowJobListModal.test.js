import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import { Theme } from 'cortex-look-book';
import LANGUAGE_DATA from '../../languages/fallback.json';
import FlowJobsListModal from './FlowJobsListModal';
import { initialState as ClientInitialState } from '../../store/client/reducer';

const defaultProps = { isOpen: false };
const COMPONENT_NAME = 'FlowJobsListModal';

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<FlowJobsListModal {...mergedProps} />);
};

describe('ListPopover: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  window.scrollTo = jest.fn();

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: ClientInitialState,
    });
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockSetState = jest.fn().mockImplementation();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useContext').mockReturnValue({ ...Theme });
  });

  it.skip('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    expect(component.length).toBe(1);
  });

  it.skip('should handle modal close', () => {
    const mockClose = jest.fn();
    const wrapper = setUp({ onClose: mockClose });
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    modal.invoke('onClose')();
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it.skip('should render table ', () => {
    const jobs = [{ id: '123', name: 'test' }];
    const wrapper = setUp({ jobs });
    const table = findByInstanceProp(wrapper, COMPONENT_NAME, 'Table');
    expect(table.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
