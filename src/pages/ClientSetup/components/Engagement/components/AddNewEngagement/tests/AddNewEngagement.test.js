import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../../../../utils/testUtils';
import LANGUAGE_DATA from '../../../../../../../languages/fallback.json';
import AddNewEngagementModal from '../AddNewEngagementModal';
import { initialState as errorInitialState } from '../../../../../../../store/errors/reducer';
import { initialState as engagementInitialState } from '../../../../../../../store/engagement/reducer';
import { initialState as clientInitialState } from '../../../../../../../store/client/reducer';
import { initialState as securityInitialState } from '../../../../../../../store/security/reducer';
import * as ErrorStoreActions from '../../../../../../../store/errors/actions';
import { EngagementTypes } from '../../../constants/engagment.constants';
import { AddNewEngagementModalStep } from '../constants/AddNewEngagement.constants';

const COMPONENT_NAME = 'Client_Setup_Add_New_EngagementModal';

const defaultProps = {};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddNewEngagementModal {...mergedProps} />);
};

const setupUseDispatchMock = (store, action) => {
  store.dispatch(action);

  return Promise.resolve(true);
};

const shouldRender = () => {
  const wrapper = setUp();
  const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
  expect(modal.length).toBe(1);
};

const shouldHandlePrimaryButtonClick = (mockSetState, engagementType) => {
  const wrapper = setUp();
  const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
  expect(modal.length).toBe(1);
  modal.invoke('onPrimaryButtonClick')();
  if (engagementType !== EngagementTypes.ROLLFORWARD) {
    expect(mockSetState).toHaveBeenLastCalledWith(AddNewEngagementModalStep.GENERAL_DETAILS);
  } else {
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  }
};

const shouldHandleSecondaryButtonClick = mockSetState => {
  const wrapper = setUp();
  const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
  expect(modal.length).toBe(1);
  modal.invoke('onSecondaryButtonClick')();
  expect(mockSetState).toHaveBeenLastCalledWith(false);
};

describe('Add New Engagement Component', () => {
  let store;
  let mockSetState;
  let mockUseEffect;
  let mockUseSelector;
  let mockUseState;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
    });

    mockSetState = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    mockUseSelector = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    mockUseEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    mockUseState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = null;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render', shouldRender);

  it.skip('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseSelector).toHaveBeenCalledTimes(11);
  });

  it.skip('should call useEffect when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseEffect).toHaveBeenCalledTimes(2);
  });

  it.skip('should call useState when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(mockUseState).toHaveBeenCalledTimes(5);
  });

  it.skip('should handle modal close', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onClose')();
    expect(mockSetState).toHaveBeenLastCalledWith(false);
  });

  it('should dispacth action on error close', () => {
    const errorKey = 123;
    const mockDeleteError = jest.fn();

    jest.spyOn(ErrorStoreActions, 'deleteAddEngagementError').mockImplementation(() => mockDeleteError);

    const wrapper = setUp();
    const alert = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'AlertHub');
    expect(alert.length).toBe(1);
    alert.invoke('onClose')(errorKey);
    expect(mockDeleteError).toHaveBeenCalled();
  });

  it.skip('should handle open modal click', () => {
    const wrapper = setUp();
    const button = findByInstanceProp(wrapper, `${COMPONENT_NAME}-New-Engagement`, 'Button');
    expect(button.length).toBe(1);
    button.invoke('onClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Add New Engagement Choose View Component', () => {
  let store;
  let mockSetState;
  let mockSubmit;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
    });

    mockSetState = jest.fn();
    mockSubmit = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return { current: { submit: mockSubmit } };
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = AddNewEngagementModalStep.CHOOSE;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render with choose view', shouldRender);

  it.skip('should handle primary button click with choose view', () => {
    shouldHandlePrimaryButtonClick(mockSetState, EngagementTypes.NEW);
  });

  it.skip('should handle secondary button click with choose view', () => {
    shouldHandleSecondaryButtonClick(mockSetState);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Add New Engagement General Details View Component', () => {
  let store;
  let mockSetState;
  let mockSubmit;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      client: clientInitialState,
      security: securityInitialState,
    });

    mockSetState = jest.fn();
    mockSubmit = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return { current: { submit: mockSubmit } };
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = AddNewEngagementModalStep.GENERAL_DETAILS;
      } else if (typeof initial === 'boolean') {
        value = true;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render general details view', shouldRender);

  it('should render with edit mode', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = AddNewEngagementModalStep.GENERAL_DETAILS;
      } else if (typeof initial === 'boolean') {
        value = true;
      } else if (typeof initial === 'string') {
        return EngagementTypes.EDIT;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should render with rollforward mode', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = AddNewEngagementModalStep.GENERAL_DETAILS;
      } else if (typeof initial === 'boolean') {
        value = true;
      } else if (typeof initial === 'string') {
        return EngagementTypes.ROLLFORWARD;
      }

      return [value, mockSetState];
    });
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
  });

  it.skip('should handle primary button click', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it.skip('should handle secondary button click', () => {
    shouldHandleSecondaryButtonClick(mockSetState);
  });

  it.skip('should handle tertiary button click', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onTertiaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(AddNewEngagementModalStep.CHOOSE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('Add New Engagement Rollforward View Component', () => {
  let store;
  let mockSetState;
  let mockSubmit;

  beforeEach(() => {
    store = configureStore([thunk])({
      engagement: engagementInitialState,
      errors: errorInitialState,
      client: clientInitialState,
      security: securityInitialState,
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
    });

    mockSetState = jest.fn();
    mockSubmit = jest.fn();

    const mockDispatch = jest.fn().mockImplementation(action => {
      return setupUseDispatchMock(store, action);
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    jest.spyOn(ReactHooks, 'useRef').mockImplementation(() => {
      return { current: { submit: mockSubmit } };
    });
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;

      if (typeof initial === 'number') {
        value = AddNewEngagementModalStep.ROLLFORWARD_DETAILS;
      }

      return [value, mockSetState];
    });
    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
  });

  it('should render engagement rollforward view', shouldRender);

  it.skip('should handle primary button click', () => {
    shouldHandlePrimaryButtonClick(mockSetState, EngagementTypes.ROLLFORWARD);
  });

  it.skip('should handle secondary button click', () => {
    shouldHandleSecondaryButtonClick(mockSetState);
  });

  it.skip('should handle tertiary button click', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onTertiaryButtonClick')();
    expect(mockSetState).toHaveBeenLastCalledWith(AddNewEngagementModalStep.GENERAL_DETAILS);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
