import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { initialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../store/engagement/actions';
import { Map as ImmutableMap } from 'immutable';
import DeleteConnectionModal from '../DeleteConnectionModal';
import { ComponentNames } from '../constants';

const { DELETE_CONNECTION_MODAL: COMPONENT_NAME } = ComponentNames;

const defaultProps = {
  handleClose: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<DeleteConnectionModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('DeleteDataSourceModal', () => {
  let store;
  let useSelectorFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: initialState.merge({
        client: {
          id: '123',
        },
      }),
      engagement: engagementInitialState,
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
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it('should delete connection when clicking the modal', () => {
    const mockDeleteConnection = jest.fn().mockImplementation(() => {});
    jest.spyOn(EngagementStoreActions, 'deleteConnection').mockImplementation(() => mockDeleteConnection);

    const wrapper = setUp({ dataSourceId: '123' });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockDeleteConnection).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
