import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import SubOrg from '../SubOrg/SubOrg';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const setUp = (props = {}) => {
  return shallow(<SubOrg {...props} />);
};

window.scrollTo = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => {},
  useSelector: () => ({
    clientPermission: {},
  }),
}));

describe('Client Domain Component', () => {
  let store;
  let useStateFn;
  let mockSetState;
  let useEffectFn;
  let mockDispatch;

  beforeEach(() => {
    store = configureStore([thunk])({
      client: clientInitialState.merge({
        client: {
          name: 'Test Client',
          id: '627abad8-02a7-48d8-98a2-dc2478e1b14e',
        },
        isFetchingMyList: false,
      }),
      engagement: engagementInitialState,
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

    store.clearActions();
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Sub-Org`);
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(22);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Sub-Org`);
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(6);
  });

  it('should render table ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(comp.length).toBe(0);
  });

  it('should render no sub org text ', () => {
    const wrapper = setUp();
    wrapper.setProps();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}-No-SubOrg`);
    expect(comp.length).toBe(1);
  });

  it.skip('should render sub org Context ', () => {
    const wrapper = setUp();
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Context_Menu`);
    expect(comp.length).toBe(1);
    comp.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call delete sub org close', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Context_Menu`);
    expect(comp.length).toBe(1);
    comp.invoke('onDeleteSubOrgMenu')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call create edit sub org menu ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Context_Menu`);
    expect(comp.length).toBe(1);
    comp.invoke('onEditSubOrgMenu')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call regenerate sub org menu ', () => {
    const row = { id: '01234', name: 'testtt' };
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_SubOrg_Context_Menu`);
    expect(comp.length).toBe(1);
    comp.invoke('onRegnerateToken')(row);
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render add sub org ', () => {
    const wrapper = setUp();
    const isOrgEnabled = true;
    wrapper.setProps({ isOrgEnabled });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Add_SubOrg`);
    expect(comp.length).toBe(1);
    comp.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call create sub org close ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}_Create_Edit_SubOrg`);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
