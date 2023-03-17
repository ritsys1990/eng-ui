import React, * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import * as ReactReduxHooks from 'react-redux';
import * as CheckAuthHooks from '../../../../../hooks/useCheckAuth';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import Org from '../Org/Org';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { COMPONENT_NAME } from '../constants/constants';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const setUp = (props = { setOrgEnabled: () => {} }) => {
  return shallow(<Org {...props} />);
};

window.scrollTo = jest.fn();

const permissions = {
  orgs: { add: true },
};

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
              add: true,
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
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(comp.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(12);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const comp = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Table');
    expect(comp.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(4);
  });

  it.skip('should call add Delete Org handle Close', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Delete_Org`);
    Button.invoke('handleClose')();
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call add Delete Org handleSubmit ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Delete_Org`);
    Button.invoke('handleSubmit')();
    wrapper.update();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call Link to Org Modal', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Link_To_Org`);
    Button.invoke('handleLinkToOrg')();
    expect(mockSetState).toHaveBeenCalledTimes(5);
  });

  it.skip('should call Link to Org Modal close', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Link_To_Org`);
    Button.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call copy to clipboard ', () => {
    const wrapper = setUp();
    const orgDetails = {
      orgId: 2424233,
    };
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Copy_To_Clipboard`);
    Button.invoke('handleClose')('1222323423');
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should call link to org ', () => {
    const wrapper = setUp();
    const orgDetails = {};
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Link_Org`, 'Button');
    Button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it.skip('should call add new org ', () => {
    const wrapper = setUp();
    const orgDetails = {};
    wrapper.setProps({ orgDetails });
    const Button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Add_New_Org`, 'Button');
    Button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
