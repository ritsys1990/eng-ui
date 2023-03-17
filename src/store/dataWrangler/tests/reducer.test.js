import reducer, { initialState } from '../reducer';
import { DataWranglerActionTypes } from '../actionTypes';

const mockWorkpaperId = '1234-5678-9012-3456';

describe('client reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('validate add data set to flow', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: true,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW });
    expect(state).toEqual(expectedState);
  });

  it('validate add data set to flow success', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: false,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('validate add data set to flow error', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: false,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('validate is updating data set file path', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: true,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH });
    expect(state).toEqual(expectedState);
  });

  it('validate is updating data set file path success', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: false,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.UPDATE_DATASET_FILEPATH_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  /* it('validate is updating data set file path error', () => {
    const expectedState = initialState.merge({
      isDatasetUpdating: false,
    });

    const state = reducer(initialState, { type: DataWranglerActionTypes.ADD_DATASET_TO_FLOW_ERROR });
    expect(state).toEqual(expectedState);
  }); */

  it('get is flow modified', () => {
    const dwIsFlowModified = {};
    dwIsFlowModified[mockWorkpaperId] = false;
    const dwIsFetchingModified = {};
    dwIsFetchingModified[mockWorkpaperId] = true;

    const expectedState = initialState.merge({
      isFlowModified: initialState.get('isFlowModified').merge(dwIsFlowModified),
      isFetchingModified: initialState.get('isFetchingModified').merge(dwIsFetchingModified),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_MODIFIED,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('get is flow modified success', () => {
    const isFlowModified = true;
    const dwIsFlowModified = {};
    dwIsFlowModified[mockWorkpaperId] = isFlowModified;
    const dwIsFetchingModified = {};
    dwIsFetchingModified[mockWorkpaperId] = false;

    const expectedState = initialState.merge({
      isFlowModified: initialState.get('isFlowModified').merge(dwIsFlowModified),
      isFetchingModified: initialState.get('isFetchingModified').merge(dwIsFetchingModified),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_MODIFIED_SUCCESS,
      payload: { isFlowModified, workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('get is flow modified error', () => {
    const dwIsFlowModified = {};
    dwIsFlowModified[mockWorkpaperId] = false;
    const dwIsFetchingModified = {};
    dwIsFetchingModified[mockWorkpaperId] = false;

    const expectedState = initialState.merge({
      isFlowModified: initialState.get('isFlowModified').merge(dwIsFlowModified),
      isFetchingModified: initialState.get('isFetchingModified').merge(dwIsFetchingModified),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_MODIFIED_ERROR,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate is gettig flow details', () => {
    const flowDetails = null;
    const dwIsFetchingFlowDetails = {};
    dwIsFetchingFlowDetails[mockWorkpaperId] = true;
    const dwFlowDetails = {};
    dwFlowDetails[mockWorkpaperId] = flowDetails;

    const expectedState = initialState.merge({
      isFetchingFlowDetails: initialState.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
      flowDetails: initialState.get('flowDetails').merge(dwFlowDetails),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_DETAILS,
      payload: { workpaperId: mockWorkpaperId, flowDetails },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate is gettig flow details success', () => {
    const flowDetails = {};
    const dwIsFetchingFlowDetails = {};
    dwIsFetchingFlowDetails[mockWorkpaperId] = false;
    const dwFlowDetails = {};
    dwFlowDetails[mockWorkpaperId] = flowDetails;

    const expectedState = initialState.merge({
      isFetchingFlowDetails: initialState.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
      flowDetails: initialState.get('flowDetails').merge(dwFlowDetails),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_DETAILS_SUCCESS,
      payload: { workpaperId: mockWorkpaperId, flowDetails },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate is gettig flow details error', () => {
    const dwIsFetchingFlowDetails = {};
    dwIsFetchingFlowDetails[mockWorkpaperId] = false;

    const expectedState = initialState.merge({
      isFetchingFlowDetails: initialState.get('isFetchingFlowDetails').merge(dwIsFetchingFlowDetails),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.GET_FLOW_DETAILS_ERROR,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate flow recipes', () => {
    const dwIsValidatingFlow = {};
    dwIsValidatingFlow[mockWorkpaperId] = true;

    const expectedState = initialState.merge({
      isValidatingFlow: initialState.get('isValidatingFlow').merge(dwIsValidatingFlow),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate flow recipes success', () => {
    const dwIsValidatingFlow = {};
    dwIsValidatingFlow[mockWorkpaperId] = false;

    const expectedState = initialState.merge({
      isValidatingFlow: initialState.get('isValidatingFlow').merge(dwIsValidatingFlow),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_SUCCESS,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });

  it('validate flow recipes error', () => {
    const dwIsValidatingFlow = {};
    dwIsValidatingFlow[mockWorkpaperId] = false;

    const expectedState = initialState.merge({
      isValidatingFlow: initialState.get('isValidatingFlow').merge(dwIsValidatingFlow),
    });

    const state = reducer(initialState, {
      type: DataWranglerActionTypes.VALIDATE_FLOW_RECIPES_ERROR,
      payload: { workpaperId: mockWorkpaperId },
    });
    expect(state).toEqual(expectedState);
  });
});
