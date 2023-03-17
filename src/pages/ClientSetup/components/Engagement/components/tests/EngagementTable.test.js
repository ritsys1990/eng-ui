import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../../utils/testUtils';
import EngagementTable from '../EngagementTable';
import LANGUAGE_DATA from '../../../../../../languages/fallback.json';
import { initialState as clientInitialState } from '../../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../../store/security/reducer';
import * as CheckAuthHooks from '../../../../../../hooks/useCheckAuth';

const COMPONENT_NAME = 'Client_Setup_Engagement_Table';
const setUp = (props = {}) => {
  return shallow(<EngagementTable {...props} />);
};

const setupMockUseState = (initial, mockSetState) => {
  let value = initial;
  if (typeof initial === 'boolean') {
    value = true;
  }

  return [value, mockSetState];
};

window.scrollTo = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => {},
  useSelector: () => ({
    clientPermission: {},
  }),
}));

const permissions = { engagements: { update: true, delete: true } };

describe('Client Domain Component', () => {
  let store;
  let useStateFn;
  let mockSetState;
  let useEffectFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState,
      engagement: engagementInitialState.merge({
        clientEngagementsList: [
          {
            id: '1234567',
            clientId: '2343423',
            createTime: '2021-03-17T23:58:12.326Z',
            matId: null,
            sourceState: 'Manual',
            name: 'Test',
          },
        ],
        isFetchingMyList: false,
      }),
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
        clientPermission: {
          permissions: {
            orgs: {
              add: false,
            },
          },
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(store.dispatch);

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });

    store.clearActions();
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Main`);
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(7);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Main`);
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should run onClose with default option from Popover', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'Popover');
    menu.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should run handleOptionClicked with about option', () => {
    const wrapper = setUp();
    const menu = findByInstanceProp(wrapper, COMPONENT_NAME, 'ContextMenu');
    menu.invoke('onOptionClicked')({ id: 'edit' });
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render edit engagment modal', () => {
    const mockFn = jest.fn();
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return setupMockUseState(initial, mockSetState);
    });
    const wrapper = setUp({ updateEditShowEditModal: mockFn });
    const editModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Edit_Modal`);
    expect(editModal.length).toBe(1);
    editModal.invoke('updateEditShowEditModal')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render delete engagment modal', () => {
    const wrapper = setUp();
    const deleteModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Delete_Modal`);
    expect(deleteModal.length).toBe(1);
    deleteModal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should render Table', () => {
    const wrapper = setUp();
    const deleteModal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Table`);
    expect(deleteModal.length).toBe(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
