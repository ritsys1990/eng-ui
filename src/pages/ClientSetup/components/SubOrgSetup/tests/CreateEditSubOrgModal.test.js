import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import CreateEditSubOrgModal from '../SubOrg/CreateEditSubOrgModal';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const defaultProps = {
  orgDetails: {
    orgId: 2424233,
    name: 'test',
    subOrgs: [
      { id: '1111', orgUUID: 'asdad123123123', name: 'Test', installToken: null },
      { id: '23232', orgUUID: 'sfsdf21231312', name: 'Test2', installToken: null },
    ],
  },
  client: {
    entities: [
      {
        id: '1234-2343-2344-2343-ef234234',
        name: 'test',
        isFromMat: false,
        matEntityId: null,
        subOrgId: null,
      },
    ],
  },
  isOpen: true,
  orgId: '102677',
  handleClose: () => {},
  isCreating: true,
  selectedRow: { id: '2344', orgUUID: '4fdf2343423', name: 'Test2', installToken: null },
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<CreateEditSubOrgModal {...mergedProps} />);
};

const setupMockUseState = (initial, mockSetState) => {
  let value = initial;
  if (typeof initial === 'boolean') {
    value = true;
  }

  return [value, mockSetState];
};

window.scrollTo = jest.fn();

describe('Client Domain Component', () => {
  let store;
  let mockSetState;
  let mockDispatch;
  let useStateFn;
  let useEffectFn;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
        isFetchingMyList: false,
        entities: [
          {
            id: '1234-2343-2344-2343-ef234234',
            name: 'test',
            isFromMat: false,
            matEntityId: null,
            subOrgId: null,
          },
        ],
      }),
      engagement: engagementInitialState,
      security: securityInitialState.merge({
        me: {
          type: 'Deloitte',
        },
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should call modal ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    expect(comp.length).toBe(1);
  });

  it.skip('should call useEffect when rendering create ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useEffect when rendering edit ', () => {
    const isCreating = false;
    const wrapper = setUp({ isCreating });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(5);
  });

  it.skip('should call on submit ', () => {
    const hasErrors = jest.fn().mockImplementation(() => false);
    const wrapper = setUp({ hasErrors });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call on close ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Create_Edit`, 'Modal');
    modal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith([]);
  });

  it.skip('should call on sub org name change ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const input = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Name`, 'Input');
    input.simulate('change', { target: { value: 'abc' } });
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith('abc');
  });

  it.skip('should call on entity change ', () => {
    const handleClose = jest.fn().mockImplementation(() => {});
    const wrapper = setUp({ handleClose });
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Entity`, 'Select');
    select.simulate('change', 'test');
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith('test');
  });

  it.skip('should call Alert ', () => {
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return setupMockUseState(initial, mockSetState);
    });
    const wrapper = setUp();
    const alert = wrapper.find('Alert');
    expect(alert.exists()).toBe(true);
  });

  it.skip('should call Alert close ', () => {
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return setupMockUseState(initial, mockSetState);
    });
    const wrapper = setUp();
    const alert = wrapper.find('Alert');
    const result = alert.invoke('onClose')();
    expect(result).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
