import reducer from './reducer';
import { workpaperProcessStep1Mock } from './reducer.mock';

describe('workpaperProcessStep1 reducer', () => {
  it('CreateInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInput.expectedState);
  });

  it('CreateInputSuccess', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInputSuccess.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInputSuccess.expectedState);
  });

  it('CreateInputError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInputError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInputError.expectedState);
  });
  it('updateInputRequired', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.updateInputRequired.action);
    expect(state).toEqual(workpaperProcessStep1Mock.updateInputRequired.expectedState);
  });

  it('updateInputRequiredSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.updateInputRequiredSuccess.inputInitialState,
      workpaperProcessStep1Mock.updateInputRequiredSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.updateInputRequiredSuccess.expectedState);
  });

  it('updateInputRequiredError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.updateInputRequiredError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.updateInputRequiredError.expectedState);
  });
  it('deleteTrifactaInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.deleteTrifactaInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.deleteTrifactaInput.expectedState);
  });

  it('deleteTrifactaInputSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.deleteTrifactaInputSuccess.inputInitialState,
      workpaperProcessStep1Mock.deleteTrifactaInputSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.deleteTrifactaInputSuccess.expectedState);
  });

  it('deleteTrifactaInputError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.deleteTrifactaInputError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.deleteTrifactaInputError.expectedState);
  });
  it('renameTrifactaInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.renameTrifactaInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.renameTrifactaInput.expectedState);
  });

  it('renameTrifactaInputSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.renameTrifactaInputSuccess.renameInitialState,
      workpaperProcessStep1Mock.renameTrifactaInputSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.renameTrifactaInputSuccess.expectedState);
  });

  it('renameTrifactaInputError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.renameTrifactaInputError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.renameTrifactaInputError.expectedState);
  });

  it('CreateInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInput.expectedState);
  });

  it('CreateInputSuccess', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInputSuccess.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInputSuccess.expectedState);
  });

  it('CreateInputError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInputError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInputError.expectedState);
  });
  it('updateInputRequired', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.updateInputRequired.action);
    expect(state).toEqual(workpaperProcessStep1Mock.updateInputRequired.expectedState);
  });

  it('deleteTrifactaInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.deleteTrifactaInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.deleteTrifactaInput.expectedState);
  });

  it('renameTrifactaInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.renameTrifactaInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.renameTrifactaInput.expectedState);
  });

  it('CreateInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.createInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.createInput.expectedState);
  });

  it('clearInput', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.clearInput.action);
    expect(state).toEqual(workpaperProcessStep1Mock.clearInput.expectedState);
  });

  it('clearInputSuccess', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.clearInputSuccess.action);
    expect(state).toEqual(workpaperProcessStep1Mock.clearInputSuccess.expectedState);
  });

  it('clearInputError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.clearInputError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.clearInputError.expectedState);
  });
  it('createNewDataModelInput', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.createNewDataModelInput.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.createNewDataModelInput.expectedState);
  });

  it('createNewDataModelInputSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.createNewDataModelInputSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.createNewDataModelInputSuccess.expectedState);
  });

  it('createNewDataModelInputError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.createNewDataModelInputError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.createNewDataModelInputError.expectedState);
  });
  it('uploadZipFile', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.uploadZipFile.action);
    expect(state).toEqual(workpaperProcessStep1Mock.uploadZipFile.expectedState);
  });

  it('uploadZipFileSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.uploadZipFileSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.uploadZipFileSuccess.expectedState);
  });

  it('uploadZipFileError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.uploadZipFileError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.uploadZipFileError.expectedState);
  });
  it('connectDatasetToFlow', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectDatasetToFlow.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectDatasetToFlow.expectedState);
  });

  it('connectDatasetToFlowSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectDatasetToFlowSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectDatasetToFlowSuccess.expectedState);
  });

  it('connectDatasetToFlowError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectDatasetToFlowError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectDatasetToFlowError.expectedState);
  });
  it('retryInputFileCopy', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.retryInputFileCopy.action);
    expect(state).toEqual(workpaperProcessStep1Mock.retryInputFileCopy.expectedState);
  });

  it('retryInputFileCopySuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.retryInputFileCopySuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.retryInputFileCopySuccess.expectedState);
  });

  it('retryInputFileCopyError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.retryInputFileCopyError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.retryInputFileCopyError.expectedState);
  });
  it('checkZipFile', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.checkZipFile.action);
    expect(state).toEqual(workpaperProcessStep1Mock.checkZipFile.expectedState);
  });

  it('checkZipFileSuccess', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.checkZipFileSuccess.action);
    expect(state).toEqual(workpaperProcessStep1Mock.checkZipFileSuccess.expectedState);
  });

  it('checkZipFileError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.checkZipFileError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.checkZipFileError.expectedState);
  });

  it('getInputData', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.getInputData.action);
    expect(state).toEqual(workpaperProcessStep1Mock.getInputData.expectedState);
  });

  it('getInputDataSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.getInputDataSuccess.inputInitialState,
      workpaperProcessStep1Mock.getInputDataSuccess.action
    );

    expect(state).toEqual(workpaperProcessStep1Mock.getInputDataSuccess.expectedState);
  });

  it('getInputDataError', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.getInputDataError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.getInputDataError.expectedState);
  });

  it('refreshCentralizedData', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.refreshCentralizedData.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.refreshCentralizedData.expectedState);
  });

  it('refreshCentralizedDataInProgress', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.refreshCentralizedDataInProgress.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.refreshCentralizedDataInProgress.expectedState);
  });

  it('refreshCentralizedDataSuccess', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.refreshCentralizedDataSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.refreshCentralizedDataSuccess.expectedState);
  });

  it('refreshCentralizedDataError', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.refreshCentralizedDataError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.refreshCentralizedDataError.expectedState);
  });

  it('trigger DMVs for Zip Uploads', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.triggerDMVs.action);
    expect(state).toEqual(workpaperProcessStep1Mock.triggerDMVs.expectedState);
  });

  it('trigger DMVs for Zip Uploads success', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.triggerDMVsSuccess.action);
    expect(state).toEqual(workpaperProcessStep1Mock.triggerDMVsSuccess.expectedState);
  });

  it('trigger DMVs for Zip Uploads error', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.triggerDMVsError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.triggerDMVsError.expectedState);
  });

  it('should get trifacta bundles', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.getTrifactaBundles.action);
    expect(state).toEqual(workpaperProcessStep1Mock.getTrifactaBundles.expectedState);
  });

  it('should get trifacta bundles success', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.getTrifactaBundlesSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.getTrifactaBundlesSuccess.expectedState);
  });

  it('should get trifacta bundles error', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.getTrifactaBundlesError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.getTrifactaBundlesError.expectedState);
  });

  it('should get autoDMTFlag', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.getAutoDmtFlag.action);
    expect(state).toEqual(workpaperProcessStep1Mock.getAutoDmtFlag.expectedState);
  });

  it('should get autoDMTFlag success', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.getAutoDmtFlagSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.getAutoDmtFlagSuccess.expectedState);
  });

  it('should get autoDMTFlag error', () => {
    const state = reducer(workpaperProcessStep1Mock.initialState, workpaperProcessStep1Mock.getAutoDmtFlagError.action);
    expect(state).toEqual(workpaperProcessStep1Mock.getAutoDmtFlagError.expectedState);
  });

  it('should get connect to trifacta bundles', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectToTrifactaBundles.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectToTrifactaBundles.expectedState);
  });

  it('should get connect to trifacta bundles success', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectToTrifactaBundlesSuccess.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectToTrifactaBundlesSuccess.expectedState);
  });

  it('should get connect to trifacta bundles error', () => {
    const state = reducer(
      workpaperProcessStep1Mock.initialState,
      workpaperProcessStep1Mock.connectToTrifactaBundlesError.action
    );
    expect(state).toEqual(workpaperProcessStep1Mock.connectToTrifactaBundlesError.expectedState);
  });
});
