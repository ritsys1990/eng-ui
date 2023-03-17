import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  deleteGlobalError,
  resetIngestDMTError,
  addAddEngagementError,
  addImportFlowError,
  deleteImportFlowEachError,
  deleteImportFlowError,
  resetReconcileClientErrors,
  deleteDMFieldError,
  addReconcileClientError,
  resetDMFieldErrors,
  deleteIngestDMTError,
  deleteAddEngagementError,
  deleteReconcileClientError,
  resetAddEngagementError,
  addAddClientError,
  deleteAddClientError,
  resetAddClientErrors,
  deleteInputFileError,
  resetInputFileErrors,
  deleteAddWorkpaperError,
  resetAddWorkpaperErrors,
  deleteAddPipelineError,
  resetAddPipelineError,
  addWPProcessingErrors,
  deleteWPProcessingErrors,
  resetWPProcessingErrors,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { ErrorActionTypes } from '../actionTypes';
import ServerError from '../../../utils/serverError';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

const mockErrorMessage = 'Test message error';
const mockWorkpaperId = '1234-5678-9012-3456';

describe('reconcile client error actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle deleteGlobalError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_GLOBAL_ERROR, payload: error }];

    await mockStore.dispatch(deleteGlobalError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle addAddClientError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.ADD_ADD_CLIENT_ERROR, payload: error }];

    await mockStore.dispatch(addAddClientError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteAddClientError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 3434 });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_ADD_CLIENT_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteAddClientError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteAddWorkpaperError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 3434 });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_ADD_WORKPAPER_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteAddWorkpaperError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetAddWorkpaperErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_ADD_WORKPAPER_ERRORS }];

    await mockStore.dispatch(resetAddWorkpaperErrors(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteInputFileError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 3434 });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_INPUT_FILE_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteInputFileError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetInputFileErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_INPUT_FILE_ERRORS }];

    await mockStore.dispatch(resetInputFileErrors(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetAddClientErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_ADD_CLIENT_ERRORS }];

    await mockStore.dispatch(resetAddClientErrors(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle addReconcileClientError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.ADD_RECONCILE_CLIENT_ERROR, payload: error }];

    await mockStore.dispatch(addReconcileClientError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteReconcileClientError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_RECONCILE_CLIENT_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteReconcileClientError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetReconcileClientErrors', async () => {
    const expectedActions = [{ type: ErrorActionTypes.RESET_RECONCILE_CLIENT_ERRORS }];

    await mockStore.dispatch(resetReconcileClientErrors());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle addWPProcessingErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [
      { type: ErrorActionTypes.ADD_WORKPAPER_PROCESSING_ERROR, payload: { error, workpaperId: mockWorkpaperId } },
    ];

    await mockStore.dispatch(addWPProcessingErrors(error, { workpaperId: mockWorkpaperId }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteWPProcessingErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [
      {
        type: ErrorActionTypes.DELETE_WORKPAPER_PROCESSING_ERROR,
        payload: { errorKey: error.key, workpaperId: mockWorkpaperId },
      },
    ];

    await mockStore.dispatch(deleteWPProcessingErrors(error.key, { workpaperId: mockWorkpaperId }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetWPProcessingErrors', async () => {
    const expectedActions = [
      { type: ErrorActionTypes.RESET_WORKPAPER_PROCESSING_ERRORS, payload: { workpaperId: mockWorkpaperId } },
    ];

    await mockStore.dispatch(resetWPProcessingErrors({ workpaperId: mockWorkpaperId }));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteDMFieldError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_DM_FIELD_ERROR, payload: error }];

    await mockStore.dispatch(deleteDMFieldError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle addImportFlowError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.ADD_IMPORT_FLOW_ERROR, payload: error }];

    await mockStore.dispatch(addImportFlowError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteImportFlowEachError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_IMPORT_FLOW_EACH_ERROR, payload: error }];

    await mockStore.dispatch(deleteImportFlowEachError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteImportFlowError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_IMPORT_FLOW_ERROR }];

    await mockStore.dispatch(deleteImportFlowError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetDMFieldErrors', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_DM_FILED_ERRORS }];

    await mockStore.dispatch(resetDMFieldErrors(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteIngestDMTError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_INGEST_DMT_ERROR, payload: error }];

    await mockStore.dispatch(deleteIngestDMTError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetIngestDMTError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_DELETE_INGEST_DMT_ERROR }];

    await mockStore.dispatch(resetIngestDMTError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle addAddEngagementError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.ADD_ADD_ENGAGEMENT_ERROR, payload: error }];

    await mockStore.dispatch(addAddEngagementError(error));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteAddEngagementError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_ADD_ENGAGEMENT_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteAddEngagementError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetAddEngagementError', async () => {
    const expectedActions = [{ type: ErrorActionTypes.RESET_ADD_ENGAGEMENT_ERROR }];

    await mockStore.dispatch(resetAddEngagementError());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle deleteAddPipelineError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 38989 });
    const expectedActions = [{ type: ErrorActionTypes.DELETE_ADD_PIPELINE_ERROR, payload: error.key }];

    await mockStore.dispatch(deleteAddPipelineError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle resetAddPipelineError', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage });
    const expectedActions = [{ type: ErrorActionTypes.RESET_ADD_PIPELINE_ERRORS }];

    await mockStore.dispatch(resetAddPipelineError(error.key));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
