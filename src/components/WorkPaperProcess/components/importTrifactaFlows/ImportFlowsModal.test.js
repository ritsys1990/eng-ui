import React, * as ReactHooks from 'react';
import ImportFlowsModal from './ImportFlowsModal';
import { shallow } from 'enzyme';
import { findByInstanceProp } from '../../../../utils/testUtils';
import * as ReactReduxHooks from 'react-redux';
import LANGUAGE_DATA from '../../../../languages/fallback.json';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Map as ImmutableMap } from 'immutable';
import { COMPONENT_NAME, FLOW_IMPORT_STATUS } from '../../constants/WorkPaperProcess.const';

const setUp = (props = {}) => {
  return shallow(<ImportFlowsModal {...props} />);
};

const workpaperId = '11111111-8d2c-45f3-b224-6d68ed475386';
const flowId = '13456';

window.scrollTo = jest.fn();
const mockFn = jest.fn();

describe('Import Flows Modal', () => {
  let store;
  const mockSetState = jest.fn();
  let useDispatchFn;
  beforeEach(() => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      wpProcess: {
        step2: ImmutableMap({
          importProgress: true,
          importFlowInitiatePolling: true,
        }),
      },
      errors: ImmutableMap({
        importFlowErrors: [],
      }),
    });
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(store.getState()));
    jest.spyOn(ReactHooks, 'useEffect').mockImplementation(f => f());
    useDispatchFn = jest.spyOn(ReactReduxHooks, 'useDispatch').mockImplementation(() => store.dispatch);
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
    jest.spyOn(ReactHooks, 'useImperativeHandle').mockImplementation(f => f);
  });

  it('should render the view', () => {
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    expect(modalInstance.length).toBe(1);
  });

  it.skip('should call handleSubmit', () => {
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    modalInstance.invoke('onPrimaryButtonClick')();
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call close modal', () => {
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    modalInstance.invoke('onSecondaryButtonClick')();
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it('should dispatch import flow error', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      wpProcess: {
        step2: ImmutableMap({
          importProgress: FLOW_IMPORT_STATUS.FAILED,
          importFlowInitiatePolling: true,
        }),
      },
      errors: ImmutableMap({
        importFlowErrors: [],
      }),
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    expect(modalInstance.length).toBe(1);
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it('should dispatch import flow completion', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      wpProcess: {
        step2: ImmutableMap({
          importProgress: FLOW_IMPORT_STATUS.COMPLETED,
          importFlowInitiatePolling: true,
        }),
      },
      errors: ImmutableMap({
        importFlowErrors: [],
      }),
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    expect(modalInstance.length).toBe(1);
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it('should render import flow errors', () => {
    store = configureStore([thunk])({
      settings: ImmutableMap({ language: { ...LANGUAGE_DATA } }),
      wpProcess: {
        step2: ImmutableMap({
          importProgress: FLOW_IMPORT_STATUS.COMPLETED,
          importFlowInitiatePolling: true,
        }),
      },
      errors: ImmutableMap({
        importFlowErrors: [{ key: '123', error: 'this is error' }],
      }),
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const alertInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal-Error`);
    expect(alertInstance.length).toBe(1);
    alertInstance.invoke('onClose')();
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  it.skip('should call submit action with success data', () => {
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => {
      let value = initial;
      if (typeof initial === 'object') {
        value = {};
      }

      return [value, mockSetState];
    });
    const wrapper = setUp({
      isOpen: true,
      handleClose: mockFn,
      workpaperId,
      trifactaFlowId: flowId,
      canvasType: null,
      showImportErrors: mockFn,
    });
    const modalInstance = findByInstanceProp(wrapper, `${COMPONENT_NAME}-ImportFlowModal`);
    modalInstance.invoke('onPrimaryButtonClick')();
    expect(useDispatchFn).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
