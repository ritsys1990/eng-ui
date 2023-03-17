const engagementFolders = state => state.staging.get('engagementFolders');
const zipFileContents = state => state.staging.get('zipFileContents');
const isValidatingZipFile = state => state.staging.get('isValidatingZipFile');
const zipFolders = state => state.staging.get('zipFolders');
const zipFileStructure = state => state.staging.get('zipFileStructure');
const inputNodeInfo = state => state.staging.get('inputNodeInfo');
const hasZipValidationErrors = state => state.staging.get('hasZipValidationErrors');
const selectIsDownloadingFile = state => state.staging.get('isDownloadingFile');

export const stagingSelectors = {
  engagementFolders,
  zipFileContents,
  isValidatingZipFile,
  zipFolders,
  zipFileStructure,
  inputNodeInfo,
  hasZipValidationErrors,
  selectIsDownloadingFile,
};
