import React, * as ReactHooks from 'react';
import { Entities } from '../Entities';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';
import * as CheckAuthHooks from '../../../../../hooks/useCheckAuth';

const setUp = (props = {}) => {
  return shallow(<Entities {...props} />);
};

const mockEntityId = '8bf1d3d3-4840-4fc1-9b2e-ccfdea88b407';

const mockClient = {
  entities: [
    {
      id: mockEntityId,
      isFromMat: false,
      name: '01_SpartanEntity',
      subOrgId: '0100II',
    },
  ],
};

const permissions = {
  entities: { update: true, delete: true },
};

window.scrollTo = jest.fn();

describe('Client Setup Entities Section', () => {
  let store;
  let useEffect;
  let useState;
  let useSelectorFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      engagement: engagementInitialState,
      client: clientInitialState.merge({ client: mockClient }),
      security: securityInitialState,
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp({ client: mockClient });
    expect(wrapper.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp({ client: mockClient });
    expect(wrapper.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(11);
  });

  it('should call useSelector when rendering ', () => {
    const wrapper = setUp({ client: mockClient });
    expect(wrapper.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it('should render Add Entities Button ', () => {
    const wrapper = setUp({ client: mockClient });
    const button = findByInstanceProp(wrapper, 'Entities-AddEntities');
    expect(button.length).toBe(1);
  });

  it('should not render See Details Button', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const button = findByInstanceProp(wrapper, 'Entities-SeeDetails');
    expect(button.length).toBe(0);
  });

  it.skip('should update Add Entities when clicked', () => {
    const wrapper = setUp({ client: mockClient });
    const button = findByInstanceProp(wrapper, 'Entities-AddEntities');
    button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  it('should render reconcile Alert', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const alertBox = findByInstanceProp(wrapper, 'Entities', 'AlertDialog');
    expect(alertBox.length).toBe(1);
  });

  it.skip('should change modal state when clicking on reconcile', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const reconcileButton = findByInstanceProp(wrapper, 'Entities-Reconcile', 'Button');
    expect(reconcileButton.length).toBe(1);
    reconcileButton.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Client Setup Entities Section Modal rendered', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      engagement: engagementInitialState.merge({
        clientEngagementsList: [{ id: 123, name: 'Test Engagement 1', entityIds: ['123', '456'] }],
      }),
      client: clientInitialState.merge({ client: mockClient }),
      security: securityInitialState,
    });

    mockSetState = jest.fn().mockImplementation(() => {});
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      if (typeof initial === 'boolean') {
        return [true, mockSetState];
      }

      return [initial, mockSetState];
    });

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });

    store.clearActions();
  });

  it.skip('should render modal', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'ClientReconcileModal');
    expect(modal.length).toBe(1);
  });

  it.skip('should change modal state when clicking on modal close', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'ClientReconcileModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should change modal state when modal not rendered', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'ClientReconcileModal');
    expect(modal.length).toBe(1);
    modal.invoke('onRemoveFromDom')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should render see details button', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const seeDetailsButton = findByInstanceProp(wrapper, 'Entities-SeeDetails', 'Button');
    expect(seeDetailsButton.length).toBe(1);
  });

  it.skip('should change state when closing add entity modal', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'AddEntityModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should change state when removing add entity modal from dom', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'AddEntityModal');
    expect(modal.length).toBe(1);
    modal.invoke('onRemoveFromDom')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should change state when closing delete entity modal', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'DeleteEntityModal');
    expect(modal.length).toBe(1);
    modal.invoke('handleClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it.skip('should change state when removing delete entity modal from dom', () => {
    const client = {
      entities: [
        {
          id: mockEntityId,
          isFromMat: false,
          name: '01_SpartanEntity',
          subOrgId: '0100II',
        },
      ],
    };

    const wrapper = setUp({ client });
    const modal = findByInstanceProp(wrapper, 'Entities', 'DeleteEntityModal');
    expect(modal.length).toBe(1);
    modal.invoke('onRemoveFromDom')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
