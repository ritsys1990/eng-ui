import React, * as ReactHooks from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../utils/testUtils';
import LANGUAGE_DATA from '../../languages/fallback.json';
import ClientTable, { COMPONENT_NAME } from './ClientTable';
import { initialState as ClientInitialState } from '../../store/client/reducer';

const defaultProps = { selectedClients: [] };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ClientTable {...mergedProps} />);
};

describe('ListPopover: Initial render', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let headers;
  let onChangeSelect;
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
    headers = [];
    mockSetState = jest.fn().mockImplementation(arg => {
      if (Array.isArray(arg) && arg.length === 2) {
        headers = arg;
      }
    });

    onChangeSelect = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
  });

  it('should render', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ClientListing`, 'ForwardRef');
    expect(component.length).toBe(1);
  });

  it.skip('should renders table headers 0', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ClientListing-Table`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(null, { id: 1 }));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 1', () => {
    const wrapper = setUp();
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ClientListing-Table`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[1].render(null, { id: 1 }));
    expect(header.length).toBe(1);
  });

  it.skip('should renders table headers 1', () => {
    const wrapper = setUp({ onClientSelect: onChangeSelect, selectedClients: [{ id: 1 }] });
    const component = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ClientListing-Table`);
    expect(component.length).toBe(1);
    expect(headers.length).toBeGreaterThanOrEqual(1);
    const header = shallow(headers[0].render(null, { id: 1 }));
    const checkbox = findByInstanceProp(header, `${COMPONENT_NAME}-1-checkbox`);
    checkbox.invoke('onChange')();
    expect(onChangeSelect).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
