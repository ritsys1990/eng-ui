import BaseService from './baseService';
import queryString from 'query-string';
import { ContentTypes } from './constants/constants';
import { DMT_SOURCE } from '../pages/ContentLibrary/DataModels/constants/constants';
import { WB_PROCESS_TYPE } from '../utils/workbooks.const';

class WorkpaperService extends BaseService {
  name = 'Workpaper Service';

  getUrl(path) {
    return `/workpaper-service/${path}`;
  }

  async getList(path) {
    return this.makeRequest(`workpapers/getworkpaperviewmodels/${path}`);
  }

  async getPaginatedList(query) {
    return this.makeRequest(`workpapers?${queryString.stringify(query)}`);
  }

  async getWorkpaperLinks() {
    return this.makeRequest('links');
  }

  async getDetails(id, getIsOutdated) {
    return this.makeRequest(`workpaper/${id}?getIsOutdated=${getIsOutdated}`);
  }

  async getRevisions(id) {
    return this.makeRequest(`workpaper/${id}/revisions`);
  }

  async createWorkpaper(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest('workpapers', options);
  }

  async createWPWithWorkflowAsync(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest('workpapers/createwithworkflowasync', options);
  }

  async updateWorkpaper(params) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: params,
    };

    return this.makeRequest('workpapers', options);
  }

  async deleteWorkpaper(id) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`workpapers/${id}`, options);
  }

  async checkWorkpaperNameExists(engagementId, workpaperName) {
    return this.makeRequest(`workpapers/nameexists/${engagementId}/${encodeURIComponent(workpaperName)}`);
  }

  async getLabelConflicts(workpaperId, engagementId) {
    return this.makeRequest(`getlabelconflicts/${workpaperId}/engagement/${engagementId}`);
  }

  async addNewWorkPaper(formData, engagementId) {
    return this.makeRequest(`workpapers`, {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        ...formData,
        engagementId,
      },
    });
  }

  async updateReviewStatus(params) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: params,
    };

    return this.makeRequest('workpapers/updatereviewstatus', options);
  }

  async saveToJEOutputRequest(workpaperId, outputUrl, stagingNodeId, outputType, outputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        workpaperId,
        outputUrl,
        stagingNodeId,
        outputType,
        outputId,
      },
    };

    return this.makeRequest(`/workpapers/savetojeoutputrequest`, options);
  }

  async getWPbyIds(ids = [], getIsOutdated) {
    const options = {
      headers: { 'Content-Type': ContentTypes.APPLICATION_JSON },
      data: ids,
      method: 'POST',
    };

    return this.makeRequest(`workpaper/byids?getIsOutdated=${getIsOutdated}`, options);
  }

  async copyWorkpaper(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/workpapers/copyWorkpaper?workpaperId=${workpaperId}`, options);
  }

  async exportTrifactaWorkpaper(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeFetchRequest(`workpapers/exportTrifactaWorkPaper?workpaperId=${workpaperId}`, options, false);
  }

  async getWorkPaperConfigByKey(configKey) {
    return this.makeRequest(`/workpapers/getworkpaperconfig/${configKey}`);
  }

  async addCentralizedDatasetEvent(workpaperId, eventStatus, inputName, centralizedDataCategoryName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        id: workpaperId,
        Status: eventStatus,
        AdditionalInfo: {
          inputName,
          centralizedDataCategoryName,
        },
      },
    };

    return this.makeRequest(`workpaper/addCentralizedDataEvent`, options);
  }

  async createDMT(dmName, datamodelId, name, IsTrifactaWorkpaper) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        DatamodelName: dmName,
        DatamodelId: datamodelId,
        DatamodelTransformationName: name,
        IsTrifactaWorkpaper,
      },
    };

    return this.makeRequest(`workpapers/createDMT`, options);
  }

  async getDMTsFromDM(datamodelId) {
    return this.makeRequest(`/workpapers/${datamodelId}/getDMT`);
  }

  async renameDMT(dmtId, name) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        DatamodelTransformationName: name,
      },
    };

    return this.makeRequest(`workpapers/${dmtId}/renameDMT`, options);
  }

  async getLatestWorkPaperIfUpdatePossible(chainId, templateVersion) {
    return this.makeRequest(`latestUpdatableWorkPaper/${chainId}/version/${templateVersion}`);
  }

  async getDatamodelMappings(datamodelId, datamodelName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        datamodelId,
        datamodelName,
      },
    };

    return this.makeRequest(`/workpapers/datamodelMappings`, options);
  }

  async updateWorkpaperTemplate(params) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: params,
    };

    return this.makeRequest('updatetemplate', options);
  }

  async addDMTSourceOutput(DatamodelId, DatamodelTransformationId, IsSource) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        DatamodelId,
        DatamodelTransformationId,
        IsSource,
        workpaperSource: DMT_SOURCE.TRIFACTA,
      },
    };

    return this.makeRequest(`/workpapers/addDMTSourceOutput`, options, false);
  }

  async removeDMTSourceOutput(sourceObj) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: sourceObj,
    };

    return this.makeRequest(`/workpapers/removeDMTSourceOutput`, options, false);
  }

  async configureTrifactaBundleTransformation(bundleId, bundleName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify({
        bundleId,
        name: bundleName,
      }),
    };

    return this.makeRequest(`/workpapers/createTrifactaBundleTransformation`, options);
  }

  async getWorkpaperDMTs(workpaperId) {
    return this.makeRequest(`workpapers/${workpaperId}/dmts`);
  }

  async getChildWorkpapersStatus(id) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`childworkpapers/getChildWorkpapersStatus/${id}`, options);
  }

  async getDMTsofDMByEnv(datamodelName, environment) {
    return this.makeRequest(`workpapers/getDMTListByDataModelName/${environment}?dataModelName=${datamodelName}`);
  }

  async ingestDMT(ingestRequest) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: ingestRequest,
    };

    return this.makeRequest(`/workpapers/QueueDMTIngestion`, options);
  }

  async getDMTsIngestionStatus(datamodelName) {
    return this.makeRequest(
      `ingestionstatus/getDMTStatusListByDataModelName?dataModelName=${datamodelName}&ingestionType=DMTIngest`
    );
  }

  async getSBTIngestionStatus(id) {
    return this.makeRequest(
      `ingestionstatus/getIngestionStatus?bundleId=${id}&type=1&ingestionType=BundleTransformationIngest`
    );
  }

  async validateDMTName(dmtName) {
    return this.makeRequest(`/workpapers/ValidateNameForDMT?dmtName=${dmtName}`);
  }

  async ingestBundleTransformation(ingestRequest) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: ingestRequest,
    };

    return this.makeRequest(`/workpapers/QueueTrifactaBundleTransformationIngestion `, options);
  }

  async attachNotebook(selectedNotebook, workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: selectedNotebook,
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/attachNotebook`, options);
  }

  async getDatabrickNotebookParameters(workpaperId) {
    return this.makeRequest(`/v1/workpapers/${workpaperId}/parameters`);
  }

  async saveDatabrickNotebookParameters(workpaperId, payload) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: payload,
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/parameters`, options);
  }

  async getWorkPaperInputs(workpaperId) {
    return this.makeRequest(`/v1/inputs?workpaperId=${workpaperId}`);
  }

  async getInput(workpaperId, inputId) {
    return this.makeRequest(`/v1/inputs?id=${inputId}&workpaperid=${workpaperId}`);
  }

  async saveFileForDataTable(fileSchema, file, fileName, fileDelimiter, dataTableId) {
    const payload = {
      fileSchema,
      file,
      fileName,
      fileDelimiter,
    };

    const options = {
      method: 'PATCH',
      data: payload,
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/v1/inputs/${dataTableId}/file`, options);
  }

  async replaceNotebook(selectedNotebook, workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: selectedNotebook,
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/replaceNotebook`, options);
  }

  async executeNotebook(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/execute`, options);
  }

  async getNotebookExecutionStatus(workpaperId, includingTableCreationStatus = true) {
    return this.makeRequest(
      `/v1/workpapers/${workpaperId}/status?includingTableCreationStatus=${includingTableCreationStatus}`
    );
  }

  async updateInput(inputId, mappings) {
    const payload = {
      schemaMap: mappings,
    };
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: payload,
    };

    return this.makeRequest(`/v1/inputs/${inputId}/SchemaMapping`, options);
  }

  async getInputFilePreview(inputId) {
    return this.makeRequest(`/v1/inputs/${inputId}/preview`);
  }

  async getNotebookWPOutputs(workpaperId) {
    return this.makeRequest(`/v1/outputs?workpaperId=${workpaperId}`);
  }

  async getOutputPreview(outputId) {
    return this.makeRequest(`/v1/outputs/${outputId}/preview`);
  }

  async downloadWPOutputs(workpaperId, outputId = null) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };
    if (outputId) {
      return this.makeRequest(`/v1/outputs/saveAsZip?workpaperId=${workpaperId}&id=${outputId}`, options);
    }

    return this.makeRequest(`/v1/outputs/saveAsZip?workpaperId=${workpaperId}`, options);
  }

  async downloadWPOutputsJob(id) {
    return this.makeRequest(`/v1/outputs/saveAsZipJobs/${id}`);
  }

  async updateWorkbookDataSource(workpaperId, workbookDataSource) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(workbookDataSource),
    };

    return this.makeRequest(`/workpapers/${workpaperId}/updatedatasourcetype`, options);
  }

  async getWorkbooks(workpaperId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/workbook`, options);
  }

  async publishWorkbook(workpaperId, workbookName, file, onProgress = null) {
    const formData = new FormData();
    formData.append('workbook', file);
    let error = null;
    const options = {
      method: 'POST',
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

    const response = await this.makeRequest(
      `/v1/workpapers/${workpaperId}/workbook/publish?workbookName=${workbookName}`,
      options
    );
    if (error) {
      throw error;
    }

    return response;
  }

  async removeWorkbooks(workpaperId, force = false) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/v1/workpapers/${workpaperId}/workbook?force=${force}`, options);
  }

  async executeJEReconciliationReport(workpaperId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/workpapers/${workpaperId}/ReconReport`, options);
  }
}

export default new WorkpaperService();
