import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import ConnectToGlobalscapeModal from '../ConnectToGlobalscapeModal';
import { initialState } from '../../../../../../../store/engagement/reducer';
import * as EngagementStoreActions from '../../../../../../../store/engagement/actions';
import * as ErrorStoreActions from '../../../../../../../store/errors/actions';
import ServerError from '../../../../../../../utils/serverError';

const COMPONENT_NAME = 'ConnectToGlobalscapeModal';

const defaultProps = {
  isOpen: true,
  handleClose: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<ConnectToGlobalscapeModal {...mergedProps} />);
};

const setupMockUseState = (initial, mockSetState) => {
  if (initial === null) {
    return [{ message: 'Hello' }, mockSetState];
  }

  return [initial, mockSetState];
};

describe('ConnectToGlobalscapeModal Component', () => {
  let store;
  let useEffectFn;
  let useSelectorFn;
  let useStateFn;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        clientEngagementsList: [
          { id: '123', name: 'Engagement' },
          { id: '456', name: 'Engagement 2', efT_EXT_EngagementLink: true },
        ],
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffectFn = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useStateFn = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return setupMockUseState(initial, mockSetState);
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
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
    expect(useSelectorFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useEffectFn).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useStateFn).toHaveBeenCalledTimes(3);
  });

  it.skip('should close error', () => {
    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}-Error`, 'Alert');
    expect(alert.length).toBe(1);
    alert.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('ConnectToGlobalscapeModal Component Dispatch', () => {
  let store;
  let mockSetState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: initialState.merge({
        clientEngagementsList: [{ id: '123', name: 'Engagement' }],
      }),
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();

    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      return setupMockUseState(initial, mockSetState);
    });
  });

  it('should handle success connect', () => {
    const mockProvisionEngagements = jest.fn().mockImplementation(() => {});
    const mockAddGlobalError = jest.fn().mockImplementation(() => {});
    const mockClose = jest.fn().mockImplementation(() => {});
    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(EngagementStoreActions, 'provisionEngagements').mockImplementation(() => mockProvisionEngagements);
    jest.spyOn(ErrorStoreActions, 'addGlobalError').mockImplementation(() => mockAddGlobalError);

    const wrapper = setUp({ handleClose: mockClose });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockProvisionEngagements).toHaveBeenCalledTimes(1);
  });

  it('should handle error connect', () => {
    const errorMock = new ServerError('Error');
    const mockProvisionEngagements = jest.fn().mockImplementation(() => {});
    const mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(errorMock);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    jest.spyOn(EngagementStoreActions, 'provisionEngagements').mockImplementation(() => mockProvisionEngagements);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockProvisionEngagements).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
