import reducer from '../reducer';
import { datamodelsConLibMockReducer } from './reducer.mock';

describe('content library datamodels reducer', () => {
  it('fetch datamodels', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.fetchDatamodels.action);
    expect(state).toEqual(datamodelsConLibMockReducer.fetchDatamodels.expectedState);
  });

  it('fetch datamodels success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.fetchDatamodelsSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.fetchDatamodelsSuccess.expectedState);
  });

  it('fetch datamodels failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.fetchDatamodelsFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.fetchDatamodelsFailure.expectedState);
  });
  it('fetch published datamodels', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.fetchPublishedDatamodels.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.fetchPublishedDatamodels.expectedState);
  });

  it('fetch published datamodels success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.fetchPublishedDatamodelsSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.fetchPublishedDatamodelsSuccess.expectedState);
  });

  it('fetch published datamodels failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.fetchPublishedDatamodelsFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.fetchPublishedDatamodelsFailure.expectedState);
  });

  it('get datamodel details', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDataModelDetails.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDataModelDetails.expectedState);
  });

  it('get datamodel details success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDataModelDetailsSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDataModelDetailsSuccess.expectedState);
  });

  it('get datamodel details failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDataModelDetailsFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDataModelDetailsFailure.expectedState);
  });

  it('delete DM Field', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.deleteDMField.action);
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDMField.expectedState);
  });

  it('delete DM Field Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.deleteDMFieldSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDMFieldSuccess.expectedState);
  });

  it('delete DM Field failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.deleteDMFieldFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDMFieldFailure.expectedState);
  });

  it('gets DM Field types', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.getDMFieldTypes.action);
    expect(state).toEqual(datamodelsConLibMockReducer.getDMFieldTypes.expectedState);
  });

  it('gets DM Field types Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMFieldTypesSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMFieldTypesSuccess.expectedState);
  });

  it('gets DM Field types failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMFieldTypesFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMFieldTypesFailure.expectedState);
  });

  it('updates DM Field', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.updateDMField.action);
    expect(state).toEqual(datamodelsConLibMockReducer.updateDMField.expectedState);
  });

  it('updates DM Field Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.updateDMFieldSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.updateDMFieldSuccess.expectedState);
  });

  it('updates DM Field failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.updateDMFieldFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.updateDMFieldFailure.expectedState);
  });

  it('upload Datamodel Example', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.uploadDatamodelExample.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.uploadDatamodelExample.expectedState);
  });

  it('upload Datamodel Example Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.uploadDatamodelExampleSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.uploadDatamodelExampleSuccess.expectedState);
  });

  it('upload Datamodel Example Error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.uploadDatamodelExampleError.action
    );
    expect(state.length).toEqual(datamodelsConLibMockReducer.uploadDatamodelExampleError.expectedState.length);
  });

  it('export Datamodel', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.exportDatamodel.action);
    expect(state).toEqual(datamodelsConLibMockReducer.exportDatamodel.expectedState);
  });

  it('export Datamodel Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.exportDatamodelSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.exportDatamodelSuccess.expectedState);
  });

  it('export Datamodel Failure', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.exportDatamodelError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.exportDatamodelError.expectedState);
  });

  it('updates Add Guidance', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.PostAddGuidance.action);
    expect(state).toEqual(datamodelsConLibMockReducer.PostAddGuidance.expectedState);
  });

  it('updates Add Guidance Error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.PostAddGuidanceError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.PostAddGuidanceError.expectedState);
  });

  it('updates Add Guidance Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.PostAddGuidanceSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.PostAddGuidanceSuccess.expectedState);
  });
  it('updates Datamodel', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.updateDataModel.action);
    expect(state).toEqual(datamodelsConLibMockReducer.updateDataModel.expectedState);
  });

  it('updates Datamodel successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.updateDataModelSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.updateDataModelSuccess.expectedState);
  });

  it('failure while updating Datamodel ', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.updateDataModelFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.updateDataModelFailure.expectedState);
  });

  it('switches Datamodel to draft', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.switchDMToDraft.action);
    expect(state).toEqual(datamodelsConLibMockReducer.switchDMToDraft.expectedState);
  });

  it('switches Datamodel to draft successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.switchDMToDraftSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.switchDMToDraftSuccess.expectedState);
  });

  it('failure while switching Datamodel to draft ', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.switchDMToDraftFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.switchDMToDraftFailure.expectedState);
  });

  it('submits Datamodel for Review', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.submitDMForReview.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.submitDMForReview.expectedState);
  });

  it('submits Datamodel for Review successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.submitDMForReviewSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.submitDMForReviewSuccess.expectedState);
  });

  it('failure while submitting Datamodel for Review ', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.submitDMForReviewFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.submitDMForReviewFailure.expectedState);
  });

  it('delete Datamodel request', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.deleteDatamodel.action);
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDatamodel.expectedState);
  });

  it('deletes Datamodel successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.deleteDatamodelSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDatamodelSuccess.expectedState);
  });

  it('failure while deleting Datamodel ', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.deleteDatamodelFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.deleteDatamodelFailure.expectedState);
  });

  it('redirect DataModel Validations request', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.redirectDataModelValidations.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.redirectDataModelValidations.expectedState);
  });

  it('redirect DataModel Validations successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.redirectDataModelValidationsSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.redirectDataModelValidationsSuccess.expectedState);
  });

  it('failure while redirecting to DataModel Validations', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.redirectDataModelValidationsFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.redirectDataModelValidationsFailure.expectedState);
  });

  it('gets DMTs list from DM', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.getDMTsFromDM.action);
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsFromDM.expectedState);
  });

  it('gets DMTs list from DM successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsFromDMSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsFromDMSuccess.expectedState);
  });

  it('failure while getting DMTs list from DM', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsFromDMError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsFromDMError.expectedState);
  });

  it('creates or rename a DMT from DM', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.createDMT.action);
    expect(state).toEqual(datamodelsConLibMockReducer.createDMT.expectedState);
  });

  it('creates or renames a DMT from DM successfully', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.createDMTSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.createDMTSuccess.expectedState);
  });

  it('failure while creating or renaming a DMT from DM', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.createDMTError.action);
    expect(state).toEqual(datamodelsConLibMockReducer.createDMTError.expectedState);
  });

  it('get DM Mapping', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.getDMMapping.action);
    expect(state).toEqual(datamodelsConLibMockReducer.getDMMapping.expectedState);
  });

  it('get DM Mapping Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMMappingSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMMappingSuccess.expectedState);
  });

  it('get DM Mapping Error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMMappingError.action
    );
    expect(state.length).toEqual(datamodelsConLibMockReducer.getDMMappingError.expectedState.length);
  });

  it('get All Environments Start', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getAllEnvironmentsStart.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getAllEnvironmentsStart.expectedState);
  });

  it('get All Environments Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getAllEnvironmentsSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getAllEnvironmentsSuccess.expectedState);
  });

  it('get All Environments Error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getAllEnvironmentsError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getAllEnvironmentsError.expectedState);
  });
  it('get All Environments contents start', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getEnvironmentContentStart.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getEnvironmentContentStart.expectedState);
  });
  it('get All Environments contents success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getEnvironmentContentSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getEnvironmentContentSuccess.expectedState);
  });
  it('get All Environments contents error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getEnvironmentContentError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getEnvironmentContentError.expectedState);
  });
  it('ingest data model start', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.ingestDatamodelStart.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDatamodelStart.expectedState);
  });
  it('ingest data model success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.ingestDatamodelSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDatamodelSuccess.expectedState);
  });
  it('ingest data model error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.ingestDatamodelError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDatamodelError.expectedState);
  });
  it('clea modal content', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.clearModalContent.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.clearModalContent.expectedState);
  });
  it('fetch dmts of dm from selected env', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsListFromDMByEnv.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsListFromDMByEnv.expectedState);
  });
  it('fetch dmts of dm from selected env success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsListFromDMByEnvSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsListFromDMByEnvSuccess.expectedState);
  });
  it('fetch dmts of dm from selected env error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsListFromDMByEnvError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsListFromDMByEnvError.expectedState);
  });
  it('ingest dmt of dm from selected env', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.ingestDMT.action);
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDMT.expectedState);
  });
  it('ingest dmts of dm from selected env success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.ingestDMTSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDMTSuccess.expectedState);
  });
  it('ingest dmts of dm from selected env error', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.ingestDMTError.action);
    expect(state).toEqual(datamodelsConLibMockReducer.ingestDMTError.expectedState);
  });
  it('get status of ingested dmts of dm from selected env', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsIngestionStatus.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsIngestionStatus.expectedState);
  });
  it('get status of ingested dmts of dm from selected env success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsIngestionStatusSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsIngestionStatusSuccess.expectedState);
  });
  it('get status of ingested dmts of dm from selected env error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMTsIngestionStatusError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMTsIngestionStatusError.expectedState);
  });
  it('validate name for DMT', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.validateDMTName.action);
    expect(state).toEqual(datamodelsConLibMockReducer.validateDMTName.expectedState);
  });
  it('validate name for DMT success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.validateDMTNameSuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.validateDMTNameSuccess.expectedState);
  });
  it('validate name for DMT error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.validateDMTNameFailure.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.validateDMTNameFailure.expectedState);
  });
  it('clear DMTs of DM by environment', () => {
    const state = reducer(datamodelsConLibMockReducer.initialState, datamodelsConLibMockReducer.clearDMTsByDM.action);
    expect(state).toEqual(datamodelsConLibMockReducer.clearDMTsByDM.expectedState);
  });
  it('Datamodel Versions History', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMVersionsHistory.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMVersionsHistory.expectedState);
  });
  it('Datamodel Versions History Success', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMVersionsHistorySuccess.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMVersionsHistorySuccess.expectedState);
  });
  it('Datamodel Versions History Error', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.getDMVersionsHistoryError.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.getDMVersionsHistoryError.expectedState);
  });
  it('handles the refresh Icon', () => {
    const state = reducer(
      datamodelsConLibMockReducer.initialState,
      datamodelsConLibMockReducer.handlesRefreshIcon.action
    );
    expect(state).toEqual(datamodelsConLibMockReducer.handlesRefreshIcon.expectedState);
  });
});
