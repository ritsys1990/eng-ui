import BaseService from './baseService';
import { getToken } from '../utils/authHelper';
import { WB_PROCESS_TYPE } from '../utils/workbooks.const';
import { ContentTypes } from './constants/constants';
import { DMT_SOURCE } from '../pages/ContentLibrary/DataModels/constants/constants';

class AnalyticsUIService extends BaseService {
  name = 'Analytics UI Service';

  getUrl(path) {
    return `/analytics-service/api/${path}`;
  }

  async getWorkPapersOutputs(workpaperId) {
    return this.makeRequest(`setup/workpapers/${workpaperId}/outputs`);
  }

  async cloneWorkbooks(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/workbooks/clone`, options);
  }

  async sendWorkpaperMessage(message) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: message,
    };

    return this.makeRequest(`pipelineexecution/sendworkpapermessage`, options);
  }

  async updateWorkbookRefreshFlag(workpaperId, shouldRefresh) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };
    this.makeRequest(`setup/workbook/${workpaperId}/refresh?shouldRefresh=${shouldRefresh}`, options);
  }

  async getWorkPaperInfo(workPaperId) {
    return this.makeRequest(`workpaper/${workPaperId}/info`);
  }

  async getWorkPaperInputs(workPaperId) {
    return this.makeRequest(`setup/workpapers/${workPaperId}/inputs`);
  }

  async getWorkPaperViewOutputs(id) {
    return this.makeRequest(`engagement/${id}/outputs`);
  }

  async getWorkpapersInfo(workpaperIds) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: workpaperIds,
    };

    return this.makeRequest(`workpapers/info`, options);
  }

  async getPreviewCSV(
    url,
    nodeId,
    delimiter = null,
    isEngagementWp = false,
    isTrifactaWP = false,
    isEncryptedFile = false
  ) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        url,
        nodeId,
        delimiter,
        isEngagementWp,
        isTrifactaWP,
        isEncryptedFile,
        userToken: token,
      },
    };

    return this.makeRequest(`getFilePreviewCSV`, options);
  }

  async getTableData(url, nodeId, delimiter = null, workpaperId, isEngagementWp = false, isTrifactaWP = false) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        file: { nodeId, url },
        delimiter,
        userToken: token,
        workpaperId,
        isEngagementWp,
        isTrifactaWP,
      },
    };

    return this.makeRequest(`table/data`, options);
  }

  async getTrifactaInputDetails(workpaperId, inputId) {
    const token = await getToken();
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        userToken: token,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/data`, options);
  }

  async decryptFiles(
    encryptedFilePaths = [],
    decryptedFilePaths = [],
    engagementId,
    jobType,
    checkEncryptdecryptmanagement
  ) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        encryptedFilePaths,
        decryptedFilePaths,
        engagementId,
        jobType,
        checkEncryptdecryptmanagement,
      },
    };

    return this.makeRequest(`setup/decryptFiles`, options);
  }

  async getPreviewXLSX(
    url,
    nodeId,
    delimiter = null,
    name,
    sheet,
    sheetInfo,
    isEngagementWp,
    isTrifactaWP,
    isEncryptedFile = false
  ) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        name,
        sheet,
        sheetInfo,
        url,
        nodeId,
        delimiter,
        userToken: token,
        isEngagementWp,
        isTrifactaWP,
        isEncryptedFile,
      },
    };

    return this.makeRequest(`getFilePreviewXLSX`, options);
  }

  async getSheets(url, nodeId, isEncryptedFile = false) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        file: {
          url,
          nodeId,
          isEncryptedFile,
        },
        userToken: token,
      },
    };

    return this.makeRequest(`getSheetList`, options);
  }

  async getInputDetails(workpaperId, inputId) {
    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}`);
  }

  async updateInput(workpaperId, inputId, mappings, existingMapping = null, completed = false, trifactaFlowId) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        mappings,
        existingMapping,
        completed,
        userToken: token,
        trifactaFlowId,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/updateMappings`, options);
  }

  async updateInputRequiredOptional(inputId, isRequired) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        id: inputId,
        required: isRequired,
        userToken: token,
      },
    };

    return this.makeRequest(`input/isRequired`, options);
  }

  async updateInputCentralizedData(inputId, type, unmark) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        id: inputId,
        type,
        unmark,
        userToken: token,
      },
    };

    return this.makeRequest(`input/updateCentralizedData`, options);
  }

  async attachNodeToInput(
    workpaperId,
    inputId,
    nodeId,
    fileSchema,
    shouldClean,
    delimiter = null,
    sheetList = [],
    trifactaProps = {},
    trifactaFlowId,
    ensureHeader = true
  ) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodeId,
        fileSchema,
        shouldClean,
        delimiter,
        sheetList,
        trifactaFlowId,
        ensureHeader,
      },
    };

    if (trifactaProps?.flowId) {
      options.data.trifactaProps = trifactaProps;
    }

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/attach-node`, options);
  }

  async attachNewFile(
    workpaperId,
    inputId,
    shouldClean,
    file,
    fileSchema,
    sheetList = [],
    delimiter = null,
    trifactaFlowId,
    trifactaProps = {},
    blankHeaders = false,
    ensureHeader = true
  ) {
    const formData = new FormData();

    formData.append('shouldClean', JSON.stringify(shouldClean));
    formData.append('fileSchema', JSON.stringify(fileSchema));
    formData.append('sheetList', JSON.stringify(sheetList));
    formData.append('delimiter', JSON.stringify(delimiter));
    formData.append('append', JSON.stringify(sheetList.length > 1));
    formData.append('trifactaFlowId', JSON.stringify(trifactaFlowId));
    formData.append('blankHeaders', JSON.stringify(blankHeaders));
    formData.append('ensureHeader', JSON.stringify(ensureHeader));

    if (trifactaProps?.flowId) {
      formData.append('trifactaProps', JSON.stringify(trifactaProps));
    }

    formData.append('file', file);

    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/attach`, options);
  }

  async uploadNewInput(
    trifactaFlowId,
    workpaperId,
    shouldClean,
    file,
    fileSchema,
    sheetList = [],
    delimiter = null,
    folderName,
    dataTableName,
    inputId,
    datamodelId,
    blankHeaders = false,
    ensureHeader = true
  ) {
    const formData = new FormData();

    formData.append('shouldClean', JSON.stringify(shouldClean));
    formData.append('headersSchema', JSON.stringify(fileSchema));
    formData.append('sheetList', JSON.stringify(sheetList));
    formData.append('delimiter', JSON.stringify(delimiter));
    formData.append('dataTableName', dataTableName);
    formData.append('folderName', folderName);
    formData.append('inputId', inputId);
    formData.append('trifactaFlowId', trifactaFlowId);
    formData.append('append', JSON.stringify(sheetList.length > 1));
    formData.append('datamodelId', datamodelId);
    formData.append('blankHeaders', JSON.stringify(blankHeaders));
    formData.append('ensureHeader', ensureHeader);
    formData.append('file', file);

    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputUpload`, options);
  }

  async uploadDataModel(
    workpaperId,
    headersSchema,
    delimiter,
    datamodelId,
    filename,
    fileContent,
    trifactaFlowId,
    isDMT = false,
    isPriorPeriod,
    priorPeriodYear
  ) {
    const formData = new FormData();

    formData.append('headersSchema', JSON.stringify(headersSchema));
    formData.append('delimiter', JSON.stringify(delimiter));
    formData.append('dataTableName', filename);
    formData.append('file', fileContent);
    formData.append('isDMT', isDMT);
    formData.append('trifactaFlowId', JSON.stringify(trifactaFlowId));

    if (isPriorPeriod) {
      formData.append('isPriorPeriod', isPriorPeriod);
      formData.append('priorPeriodYear', priorPeriodYear);
    }

    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/datamodelUpload/${datamodelId}`, options);
  }

  async uploadExistingInput(
    workpaperId,
    shouldClean,
    fileSchema,
    delimiter = null,
    dataTableName,
    nodeId,
    inputId,
    trifactaFlowId,
    datamodelId,
    sheetList,
    ensureHeader = true
  ) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        workpaperId,
        nodeId,
        fileSchema,
        shouldClean,
        delimiter,
        dataTableName,
        trifactaFlowId,
        inputId,
        datamodelId,
        sheetList,
        ensureHeader,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputExistingUpload`, options);
  }

  async getExistingMappings(engagementId) {
    return this.makeRequest(`engagement/${engagementId}/existingMappings`);
  }

  async getOutputDetails(workpaperId, outputId, wpType) {
    return this.makeRequest(`setup/workpapers/${workpaperId}/outputs/${outputId}/data?wpType=${wpType}`);
  }

  async getAllDCQs(workpaperId) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        userToken: token,
        workpaperId,
      },
    };

    return this.makeRequest(`downloadAllDQCsInZip/${workpaperId}`, options);
  }

  async saveOutputAsCSV(outputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/outputs/${outputId}/downloadAsCSV`, options);
  }

  async getParquetFileAddress(workpaperId, outputName, transformationId) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        userToken: token,
        workpaperId,
        transformationId,
        outputName,
      },
    };

    return this.makeRequest(`/output/getparquetfileaddress/`, options);
  }

  async getJrSteps(workpaperId) {
    return this.makeRequest(`workpaper/${workpaperId}/jrsteps`);
  }

  async approveJRStep(workpaperId, stepId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        workpaperId,
        stepId,
      },
    };

    return this.makeRequest('workpaper/jrconfirm', options);
  }

  async approveAllJRSteps(workpaperId, stepIds) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        workpaperId,
        stepIds,
      },
    };

    return this.makeRequest('workpaper/jrconfirmall', options);
  }

  async processWorkpaper(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpaper/${workpaperId}/processworkpaper`, options);
  }

  async getProcessWorkpaperStatus(workpaperId) {
    return this.makeRequest(`workpaper/${workpaperId}/processWorkpaperStatus`);
  }

  async resetOutputsDataLakePaths(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpaper/${workpaperId}/resetOutputsDataLakePaths`, options);
  }

  async renameTrifactaInput(inputId, name, description = '') {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        id: inputId,
        name,
        description,
      },
    };

    return this.makeRequest('workpapers/renameInput', options);
  }

  async deleteTrifactaInput(inputId, workpaperId, engagementId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        inputId,
        workpaperId,
        engagementId,
      },
    };

    return this.makeRequest('workpapers/deleteInput', options);
  }

  async clearInputData(workpaperId, inputId, trifactaFlowId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        trifactaFlowId,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/clearData`, options);
  }

  async getWorkpaperSetup(workpaperId) {
    return this.makeRequest(`setup/workpapers/${workpaperId}/getWorkpaperSetup`);
  }

  async updateWorkpaperSetupStatus(workpaperId, currentStatus) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        status: currentStatus,
      },
    };

    return this.makeRequest(`/setup/workpapers/${workpaperId}/updateImportStatus`, options);
  }

  async getWorkbooks(workpaperId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/workbooks`, options);
  }

  async makeFlowReadOnly(workpaperId, makeFlowReadOnly) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`readonly/trifactaflow/${workpaperId}/${makeFlowReadOnly}`, options);
  }

  async publishWorkbook(workpaperId, name, file, onProgress = null) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    let error = null;
    const options = {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
      onDownloadProgress: progressEvent => {
        try {
          const chunkString = progressEvent.currentTarget.response
            ?.split('\n')
            .filter(x => !!x)
            .pop();
          const chunk = JSON.parse(chunkString);
          if (chunk.status === WB_PROCESS_TYPE.ERROR) {
            throw new Error(chunk.message);
          }
          if (onProgress) {
            onProgress(chunk);
          }
        } catch (e) {
          error = e;
        }
      },
    };

    const response = await this.makeRequest(`setup/workpapers/${workpaperId}/workbooks`, options);
    if (error) {
      throw error;
    }

    return response;
  }

  async removeWorkbooks(workpaperId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/workbooks`, options);
  }

  async setupTableau(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/setupTableau`, options);
  }

  async uploadZipFile(workpaperId, fileContent, zipFolders, zipFileStructure, isAppend, trifactaProps = {}) {
    const formData = new FormData();

    formData.append('zipFolders', JSON.stringify(zipFolders));
    formData.append('zipFileStructure', JSON.stringify(zipFileStructure));
    formData.append('isAppend', isAppend);

    if (trifactaProps?.flowId) {
      formData.append('trifactaProps', JSON.stringify(trifactaProps));
    }

    formData.append('file', fileContent);

    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/uploadZipFile`, options);
  }

  async checkforZipfile(workpaperId) {
    return this.makeRequest(`setup/workpapers/${workpaperId}/hasZipMeta`);
  }

  async convertToCSV(path, nodeId, workpaperId, isContentLibrary = false) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        path,
        isContentLibrary,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/output/converttocsv/${nodeId}`, options);
  }

  async saveToSql(nodePath, nodeId, outputId, workpaperId, mapping, tableName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodePath,
        nodeId,
        outputId,
        mapping,
        tableName,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/output/savetosql`, options);
  }

  async getFileSchemaFromJob(nodePath, nodeId, workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodePath,
        nodeId,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/output/getfileschema`, options);
  }

  async generateWorkbooks(workpaperId, manual = false) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        manual,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/generateWorkbooks`, options);
  }

  async getGenWBStatus(workpaperId) {
    return this.makeRequest(`workpapers/${workpaperId}/getGenWBStatus`);
  }

  async saveToDL(nodePath, nodeId, outputId, workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodePath,
        nodeId,
        outputId,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/output/savetodl`, options);
  }

  async connectDataSetToFlow(workpaperId, trifactaFlowId, path, inputId, inputName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        trifactaFlowId,
        path,
        inputName,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/inputs/${inputId}/connectDataSetToFlow`, options);
  }

  async retryInputFileCopy(workpaperId, inputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/inputs/${inputId}/retryInputFileCopy`, options);
  }

  async updateInputStatus(inputs, status) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: inputs,
    };

    return this.makeRequest(`updateInputStatus/status?status=${status}`, options);
  }

  async updateCentralizedInput(workpaperId, inputs) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: inputs,
    };

    return this.makeRequest(`workpapers/${workpaperId}/updateCentralizedInputs`, options);
  }

  async getOutputLabelsForEngagement(engagementId) {
    return this.makeRequest(`/getOutputLabelsForEngagement/${engagementId}`);
  }

  async updateOutputDataSetNames(updateList) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: updateList,
    };

    return this.makeRequest(`/setup/updatelabels`, options);
  }

  async getDataModelStatus(datamodelId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        datamodelId,
      },
    };

    return this.makeRequest(`/getErrorsAndWarnings`, options);
  }

  async addInputForDMT(dmtId, datamodel, dmtType, trifactaFlowId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        dmtId,
        datamodel,
        dmtType,
        trifactaFlowId,
      },
    };

    return this.makeRequest(`/dmt/createInputForDMT`, options);
  }

  async triggerDMVForZipUploads(workpaperId, trifactaFlowId, inputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        trifactaFlowId,
        workpaperId,
        inputId,
      },
    };

    return this.makeRequest(`input/triggerDMV`, options);
  }

  async triggerSaveToJEWithStandardDateFormat(parquetFile, workpaperId, outputId, outputType) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        parquetFile,
        workpaperId,
        outputId,
        outputType,
      },
    };

    return this.makeRequest(`/workpaper/saveToJEStandardDataFormat`, options);
  }

  async addOmniaEngagementFileId(outputId, omniaEngagementFileId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        omniaEngagementFileId,
      },
    };

    return this.makeRequest(`/setup/addOmniaEngagementFileId/${outputId}`, options);
  }

  async downloadAllOutputsInZip(workpaperId, outputType) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/downloadAllOutputsInZip/${workpaperId}?outputType=${outputType}`, options);
  }

  async downloadOutputInZip(outputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/downloadOutputInZip/${outputId}`, options);
  }

  async addDMToOutput(workpaperId, selectedDMId, oldDataModelId, outputId, isBundle) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        workpaperId,
        selectedDMId,
        oldDataModelId,
        workpaperSource: DMT_SOURCE.TRIFACTA,
        isBundle,
      },
    };

    return this.makeRequest(`/connectDMToOutput/${outputId}`, options);
  }

  async getXLSXSheetSchema(nodeId, url, isEncryptedFile = false) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodeId,
        url,
        isEncryptedFile,
        userToken: token,
      },
    };

    return this.makeRequest(`/getFileSchemaXLSX`, options);
  }

  async tableauTailoring({ workpaperId, outputId, mappingTableau }) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        outputId,
        mappingTableau,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/output/tableauTailoring`, options);
  }

  async connectToBundle(inputId, connectedBundlesData) {
    const token = await getToken();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        connectedBundlesData,
        userToken: token,
      },
    };

    return this.makeRequest(`connectBundles/${inputId}`, options);
  }

  async decoupleDataRequest(workpaperId, inputId) {
    const options = {
      method: 'PATCH',
    };

    return this.makeRequest(`/setup/workpapers/${workpaperId}/inputs/${inputId}/decoupleDataRequest`, options);
  }

  async createDataRequest(workpaperId, bundleIds, dataSourcesByBundle, inputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify({
        bundleIds,
        dataSourcesByBundle,
      }),
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/inputs/${inputId}/createDataRequest`, options);
  }

  async cloneBundleFromInputDataRequest(workpaperId, inputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/cloneBundleFromInputDataRequest/${inputId}`, options);
  }

  async getAutoDmtFlag(workpaperId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/shouldAutoDmt`, options);
  }

  async setAutoDmtFlag(workpaperId, shouldAutoDmt) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: { shouldAutoDmt },
    };

    return this.makeRequest(`setup/workpapers/${workpaperId}/setAutoDmt`, options);
  }

  async autoRunWorkpaper(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpapers/${workpaperId}/tryAutorun`, options);
  }

  async updateInputTrifactaId(inputId, trifactaFlowId) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        inputId,
        trifactaFlowId,
      },
    };

    return this.makeRequest(`inputs/updateTrifactaInputId`, options);
  }
}

export default new AnalyticsUIService();
