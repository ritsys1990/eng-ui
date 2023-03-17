import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState } from '../../../../../store/client/reducer';
import * as ClientStoreActions from '../../../../../store/client/actions';
import { Map as ImmutableMap } from 'immutable';
import DeleteDataSourceModal from '../DeleteDataSourceModal';
import { ComponentNames } from '../constants';

const { DELETE_DATASOURCE_MODAL: COMPONENT_NAME } = ComponentNames;

const defaultProps = {
  handleClose: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteDataSourceModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('DeleteDataSourceModal', () => {
  let store;
  let useSelectorFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: initialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(2);
  });

  it('should delete data source when clicking the modal', () => {
    const mockDeleteDataSource = jest.fn().mockImplementation(() => {});
    jest.spyOn(ClientStoreActions, 'deleteDataSource').mockImplementation(() => mockDeleteDataSource);

    const wrapper = setUp({ id: '123', clientId: '123' });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockDeleteDataSource).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
