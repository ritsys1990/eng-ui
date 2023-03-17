import React, * as ReactHooks from 'react';
import * as ReactReduxHooks from 'react-redux';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import LANGUAGE_DATA from '../../../../../languages/fallback.json';
import AddEntityModal from '../AddEntityModal';
import { findByInstanceProp } from '../../../../../utils/testUtils';
import { ADD_MODAL_COMPONENT_NAME as COMPONENT_NAME } from '../constants/constants';
import { initialState } from '../../../../../store/client/reducer';
import * as ClientStoreActions from '../../../../../store/client/actions';
import { Map as ImmutableMap } from 'immutable';

const defaultProps = {
  handleClose: () => {},
};

const setUp = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };

  return shallow(<AddEntityModal {...mergedProps} />);
};

window.scrollTo = jest.fn();

describe('AddEntityModal', () => {
  let store;
  let useEffect;
  let useEffectCleanUp;
  let useState;
  let useSelectorFn;
  let mockSetState;
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

    mockSetState = jest.fn().mockImplementation(() => {});
    mockDispatch = jest.fn().mockImplementation(action => {
      store.dispatch(action);

      return Promise.resolve(true);
    });

    jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => mockDispatch);
    useSelectorFn = jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    useEffect = jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => {
      const cleanUpFunction = f();
      if (cleanUpFunction) {
        useEffectCleanUp = cleanUpFunction;
      }
    });
    useState = jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);

    jest.spyOn(ReactHooks, 'useCallback').mockImplementation(f => f);

    store.clearActions();
  });

  it('should render add modal without errors', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    expect(modal.length).toBe(1);
  });

  it('should render edit modal without errors', () => {
    const wrapper = setUp({ isEditing: true, selectedEntity: { id: '123', name: 'test entity', matClientId: null } });
    const modal = findByInstanceProp(wrapper, COMPONENT_NAME, 'Modal');
    expect(modal.length).toBe(1);
  });

  it.skip('should call useEffect when rendering ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useEffect).toHaveBeenCalledTimes(5);
  });

  it.skip('should call useState when rendering ', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useState).toHaveBeenCalledTimes(5);
  });

  it('should call useSelector when rendering', () => {
    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    expect(useSelectorFn).toHaveBeenCalledTimes(6);
  });

  it.skip('should update selected entity when Select option is changed', () => {
    const mockSelectOption = [{ id: '1234', name: 'Test' }];
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EntityName`, 'Select');
    expect(select.length).toBe(1);
    select.invoke('onChange')(mockSelectOption);
    expect(mockSetState).toHaveBeenLastCalledWith(mockSelectOption);
  });

  it.skip('should update selected entity when Select input is changed', () => {
    const mockInputText = 'Test';
    const wrapper = setUp();
    const select = findByInstanceProp(wrapper, `${COMPONENT_NAME}-EntityName`, 'Select');
    expect(select.length).toBe(1);
    select.invoke('onInputChange')(mockInputText);
    expect(mockSetState).toHaveBeenLastCalledWith(mockInputText);
  });

  it('should add entity when clicking the modal', () => {
    const mockAddEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(ClientStoreActions, 'addEntity').mockImplementation(() => mockAddEntity);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockAddEntity).toHaveBeenCalledTimes(1);
  });

  it('should update entity when clicking the modal', () => {
    const mockEditEntity = jest.fn().mockImplementation(() => {});
    jest.spyOn(ClientStoreActions, 'editEntity').mockImplementation(() => mockEditEntity);

    const wrapper = setUp({ isEditing: true, selectedEntity: { id: '123', name: 'test entity', matClientId: null } });
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    modal.invoke('onPrimaryButtonClick')();
    expect(mockEditEntity).toHaveBeenCalledTimes(1);
  });

  it.skip('should dispatch reset', () => {
    const mockResetMatEntities = jest.fn().mockImplementation(() => {});

    jest.spyOn(ClientStoreActions, 'resetMatEntities').mockImplementation(() => mockResetMatEntities);

    const wrapper = setUp();
    const modal = findByInstanceProp(wrapper, `${COMPONENT_NAME}`, 'Modal');
    expect(modal.length).toBe(1);
    useEffectCleanUp();
    expect(mockResetMatEntities).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
