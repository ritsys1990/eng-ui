import { combineReducers } from 'redux';
import bundles from './bundles/reducer';
import client from './client/reducer';
import engagement from './engagement/reducer';
import errors from './errors/reducer';
import notifications from './notifications/reducer';
import security from './security/reducer';
import workpaper from './workpaper/reducer';
import settings from './settings/reducer';
import general from './workpaperProcess/reducer';
import step1 from './workpaperProcess/step1/reducer';
import step2 from './workpaperProcess/step2/reducer';
import step3 from './workpaperProcess/step3/reducer';
import wpHistory from './wpHistory/reducer';
import attachFilesDialog from './dialogs/attachFiles/reducer';
import wpViewOutputs from './wpViewOutputs/reducer';
import staging from './staging/reducer';
import dataWrangler from './dataWrangler/reducer';
import contentLibraryDMs from './contentLibrary/datamodels/reducer';
import dataExchange from './dataExchange/reducer';
import contentLibraryPipelines from './contentLibrary/pipelines/reducer';
import commonDatamodels from './contentLibrary/commonDataModels/reducer';
import engagementPipelines from './engagement/pipelines/reducer';
import childWorkpapers from './childWorkpapers/reducer';
import notebookWPGeneral from './notebookWorkpaperProcess/reducer';
import notebookWPStep1 from './notebookWorkpaperProcess/step1/reducer';
import notebookWPStep3 from './notebookWorkpaperProcess/step3/reducer';
import signalR from './signalR/reducer';

const rootReducer = combineReducers({
  bundles,
  client,
  contentLibraryDMs,
  dataWrangler,
  dialogs: combineReducers({ attachFilesDialog }),
  engagement,
  errors,
  notifications,
  security,
  settings,
  staging,
  workpaper,
  wpHistory,
  wpProcess: combineReducers({ general, step1, step2, step3 }),
  notebookWPProcess: combineReducers({ notebookWPGeneral, notebookWPStep1, notebookWPStep3 }),
  wpViewOutputs,
  dataExchange,
  contentLibraryPipelines,
  engagementPipelines,
  childWorkpapers,
  commonDatamodels,
  signalR,
});

export default rootReducer;
