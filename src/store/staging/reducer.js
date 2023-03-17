import { Map as ImmutableMap } from 'immutable';
import { StagingActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  engagementFolders: [],
  isValidatingZipFile: false,
  hasZipValidationErrors: false,
  zipFileContents: null,
  zipFolders: [],
  zipFileStructure: null,
  inputNodeInfo: null,
  isDownloadingFile: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case StagingActionTypes.GET_ENGAGEMENT_FOLDERS:
    case StagingActionTypes.GET_ENGAGEMENT_FOLDERS_ERROR:
      return state.merge({
        engagementFolders: [],
      });

    case StagingActionTypes.GET_ENGAGEMENT_FOLDERS_SUCCESS:
      return state.merge({
        engagementFolders: action.payload.filter(folder => folder.fileName !== 'tmp'),
      });

    case StagingActionTypes.VALIDATE_ZIP_FILE:
      return state.merge({
        isValidatingZipFile: true,
        hasZipValidationErrors: false,
      });

    case StagingActionTypes.VALIDATE_ZIP_FILE_SUCCESS: {
      const obj = {};
      const folders = [];
      action.payload.forEach((folder, i) => {
        folders.push(folder.folderName);
        obj[folder.folderName] = {
          name: folder.folderName,
          root: true,
          level: 0,
          typeOfNode: 2,
          nodes: ImmutableMap(),
          id: i,
        };
        folder.files.forEach((file, j) => {
          obj[folder.folderName].nodes = obj[folder.folderName].nodes.merge({
            [`${file.fileName}`]: { name: file.fileName, typeOfNode: 0, level: 1, id: j },
          });
        });
      });

      return state.merge({
        zipFileContents: ImmutableMap(obj),
        isValidatingZipFile: false,
        zipFolders: folders,
        zipFileStructure: action.payload,
        hasZipValidationErrors: false,
      });
    }

    case StagingActionTypes.VALIDATE_ZIP_FILE_ERROR:
      return state.merge({
        isValidatingZipFile: false,
        hasZipValidationErrors: true,
      });

    case StagingActionTypes.GET_NODE_INFO_SUCCESS:
      return state.merge({
        inputNodeInfo: action.payload,
      });

    case StagingActionTypes.RESET:
      return initialState;

    case StagingActionTypes.DOWNLOAD_FILE:
      return state.merge({
        isDownloadingFile: true,
      });

    case StagingActionTypes.DOWNLOAD_FILE_SUCCESS:
    case StagingActionTypes.DOWNLOAD_FILE_ERROR:
      return state.merge({
        isDownloadingFile: false,
      });

    default:
      return state;
  }
}
