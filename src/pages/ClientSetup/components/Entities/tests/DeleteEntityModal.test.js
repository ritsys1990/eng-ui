import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { DELETE_MODAL_COMPONENT_NAME as COMPONENT_NAME } from '../constants/constants';
import { initialState } from '../../../../../store/client/reducer';
import * as ClientStoreActions from '../../../../../store/client/actions';
import { Map as ImmutableMap } from 'immutable';
import DeleteEntityModal from '../DeleteEntityModal';

const defaultProps = {
  handleClose: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteEntityModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('DeleteEntityModal', () => {
  let store;
  let useSelectorFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: initialState.merge({
        client: {
          id: '12345',
          name: 'Test',
          matClientId: 1234,
          entities: [
            { id: '4321', name: 'Entity 1' },
            { id: '5678', name: 'Entity 2' },
          ],
        },
      }),
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

  it('should delete entity when clicking the modal', () => {
    const mockDeleteEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(ClientStoreActions, 'deleteEntity').mockImplementation(() => mockDeleteEntity);

    const wrapper = setUp({ clientId: '123', entityId: '123' });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockDeleteEntity).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
