const error = state => state.dialogs.attachFilesDialog.get('error');
const folderStructure = state => state.dialogs.attachFilesDialog.get('folderStructureMap');
const datamodelTreeData = state => state.dialogs.attachFilesDialog.get('datamodelTreeData');
const allBundleList = state => state.dialogs.attachFilesDialog.get('allBundleList');
const isLoading = state => state.dialogs.attachFilesDialog.get('isLoading');
const previewLoading = state => state.dialogs.attachFilesDialog.get('isFilePreviewLoading');
const preview = state => state.dialogs.attachFilesDialog.get('preview');
const nodeId = state => state.dialogs.attachFilesDialog.get('nodeId');
const sheetData = state => state.dialogs.attachFilesDialog.get('sheetData');

export const attachDialogSelectors = {
  error,
  folderStructure,
  isLoading,
  previewLoading,
  preview,
  nodeId,
  sheetData,
  allBundleList,
  datamodelTreeData,
};
