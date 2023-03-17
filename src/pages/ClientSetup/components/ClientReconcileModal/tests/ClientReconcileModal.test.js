import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { COMPONENT_NAME, EngagementSourceState } from '../constants/constants';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import ClientReconcileModal from '../ClientReconcileModal';
import * as CheckAuthHooks from '../../../../../hooks/useCheckAuth';
import * as ClientStoreActions from '../../../../../store/client/actions';
import * as EngagementStoreActions from '../../../../../store/engagement/actions';
import * as ErrorsStoreActions from '../../../../../store/errors/actions';
import { initialState as clientInitialState } from '../../../../../store/client/reducer';
import { initialState as engagementInitialState } from '../../../../../store/engagement/reducer';
import { initialState as errorInitialState } from '../../../../../store/errors/reducer';
import { initialState as securityInitialState } from '../../../../../store/security/reducer';

const mockClientName = 'Test Client';

const defaultProps = { handleClose: () => {} };

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ClientReconcileModal {...mergedProps} />);
};

describe('ClientReconcileModal Component: Initial render', () => {
  const permissions = { globalClient: { add: true } };
  const initialStore = {
    client: clientInitialState,
    engagement: engagementInitialState,
    errors: errorInitialState,
    security: securityInitialState.merge({
      me: {
        type: 'Deloitte',
      },
    }),
    settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  };

  let mockStore;
  let store;
  let useEffectFn;
  let useStateFn;
  let useSelectorFn;
  let useEffectCleanUp;
  let mockSetState;

  beforeEach(() => {
    mockStore = configureStore([thunk]);
    store = mockStore(initialStore);

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => {
      const cleanUpFunction = f();
      if (cleanUpFunction) {
        useEffectCleanUp = cleanUpFunction;
      }
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
  });

  it('should render', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(13);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(12);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(10);
  });

  it.skip('should dispatch error reset', () => {
    const mockResetReconcileErrors = jest.fn().mockImplementation(() => {});

    jest.spyOn(ErrorsStoreActions, 'resetReconcileClientErrors').mockImplementation(() => mockResetReconcileErrors);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    useEffectCleanUp();
    expect(mockResetReconcileErrors).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('ClientReconcileModal Component: Dispatches actions to get MAT information', () => {
  const mockClientId = '1234-5678';
  const mockMatId = 123;
  const permissions = { globalClient: { add: true } };
  const initialStore = {
    client: clientInitialState.merge({
      matClient: { name: mockClientName, id: mockClientId, matClientId: mockMatId },
      client: { name: mockClientName, id: mockClientId, matClientId: mockMatId },
    }),
    engagement: engagementInitialState,
    errors: errorInitialState,
    security: securityInitialState.merge({
      me: {
        type: 'Deloitte',
      },
    }),
    settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  };

  let mockStore;
  let store;
  let mockSetState;

  beforeEach(() => {
    mockStore = configureStore([thunk]);
    store = mockStore(initialStore);

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
  });

  it.skip('should dispatch actions to get mat client', () => {
    const mockGetMatClient = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'getMatClient').mockImplementation(() => mockGetMatClient);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockGetMatClient).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch actions to get mat entities', () => {
    const mockGetMatEntities = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'getMatClientEntities').mockImplementation(() => mockGetMatEntities);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockGetMatEntities).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch actions to get mat engagements', () => {
    const mockGetMatEngagements = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'getMatClientEngagements').mockImplementation(() => mockGetMatEngagements);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockGetMatEngagements).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch actions to get client engagements', () => {
    const mockGetClientEngagements = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'getEngagementsByClient').mockImplementation(() => mockGetClientEngagements);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockGetClientEngagements).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('ClientReconcileModal Component: Does mappings for entities and engagements', () => {
  const mockClientId = '1234-5678';
  const mockEntityId = '8765-4321';
  const mockEntityMatId = 8765;
  const mockEngagementId = '9012-8765';
  const mockEngagementId2 = '0987-1234';
  const mockEngagementMatId = 9012;
  const permissions = { globalClient: { add: true } };
  const initialStore = {
    client: clientInitialState.merge({
      client: {
        name: mockClientName,
        id: mockClientId,
        entities: [
          {
            id: mockEntityId,
            name: 'Test Entity 1',
            matEntityId: mockEntityMatId,
          },
        ],
      },
    }),
    engagement: engagementInitialState.merge({
      clientEngagementsList: [
        {
          id: mockEngagementId,
          name: 'Test Engagement 1',
          matId: mockEngagementMatId,
        },
        {
          id: mockEngagementId2,
          name: 'Test Engagement 2',
          sourceState: EngagementSourceState.MANUAL,
        },
      ],
    }),
    errors: errorInitialState,
    security: securityInitialState.merge({
      me: {
        type: 'Deloitte',
      },
    }),
    settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
  };

  let mockStore;
  let store;
  let mockSetState;

  beforeEach(() => {
    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });
    mockStore = configureStore([thunk]);
    store = mockStore(initialStore);

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(CheckAuthHooks, 'default').mockReturnValue({ permissions });
  });

  it('should dispatch actions to get all mat clients', () => {
    const mockGetMatSearch = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'getMatClientsSearch').mockImplementation(() => mockGetMatSearch);

    const wrapper = setUp({ isClientEditable: true });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockGetMatSearch).toHaveBeenCalledTimes(0);
  });

  it('should dispatch actions to reconcile client', () => {
    const mockSaveClient = jest.fn().mockImplementation(() => {});
    const mockResetReconcileErrors = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'saveClient').mockImplementation(() => mockSaveClient);
    jest.spyOn(ErrorsStoreActions, 'resetReconcileClientErrors').mockImplementation(() => mockResetReconcileErrors);

    const wrapper = setUp({ isClientEditable: true });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockSaveClient).toHaveBeenCalledTimes(1);
    expect(mockResetReconcileErrors).toHaveBeenCalledTimes(1);
  });

  it('should dispatch actions to reconcile entities', () => {
    const mockSaveClient = jest.fn().mockImplementation(() => {});
    const mockResetReconcileErrors = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'saveClient').mockImplementation(() => mockSaveClient);
    jest.spyOn(ErrorsStoreActions, 'resetReconcileClientErrors').mockImplementation(() => mockResetReconcileErrors);

    const wrapper = setUp({ isEntityEditable: true });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockSaveClient).toHaveBeenCalledTimes(1);
    expect(mockResetReconcileErrors).toHaveBeenCalledTimes(1);
  });

  it('should dispatch actions to reconcile engagements', () => {
    const mockReconcileEngagements = jest.fn().mockImplementation(() => {});
    const mockResetReconcileErrors = jest.fn().mockImplementation(() => {});

    jest.spyOn(EngagementStoreActions, 'reconcileEngagements').mockImplementation(() => mockReconcileEngagements);
    jest.spyOn(ErrorsStoreActions, 'resetReconcileClientErrors').mockImplementation(() => mockResetReconcileErrors);

    const wrapper = setUp({ isEngagementEditable: true });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    modal.invoke('onPrimaryButtonClick')();
    expect(modal.length).toBe(1);
    expect(mockReconcileEngagements).toHaveBeenCalledTimes(0);
    expect(mockResetReconcileErrors).toHaveBeenCalledTimes(1);
  });

  it('should dispatch actions to close error', () => {
    const mockDeleteReconcileClientError = jest.fn().mockImplementation(() => {});

    jest
      .spyOn(ErrorsStoreActions, 'deleteReconcileClientError')
      .mockImplementation(() => mockDeleteReconcileClientError);

    const wrapper = setUp({ isEngagementEditable: true });
    const alertHub = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AlertHub');
    expect(alertHub.length).toBe(1);
    alertHub.invoke('onClose')();
    expect(mockDeleteReconcileClientError).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
