import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class DataWranglerService extends BaseService {
  name = 'Data Wrangler Service';

  getUrl(path) {
    return `/datawrangler-service/${path}`;
  }

  async addDatasetToFlow(trifactaFlowId, path, inputId, name) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        path,
        inputId,
        name,
      },
    };

    return this.makeRequest(`/dataset/importDataset/AddToFlow/${trifactaFlowId}`, options);
  }

  async renameDataSet(importedDataSetId, name, description) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        name,
        description,
      },
    };

    return this.makeRequest(`dataset/RenameImportedDataSet/${importedDataSetId}`, options);
  }

  async deleteDataSet(importedDataSetId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`dataset/DeleteImportedDataSet/${importedDataSetId}`, options);
  }

  async updateDatasetFilePath(datasetId, path) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        path,
      },
    };

    return this.makeRequest(`dataset/UpdateDatasetPath/${datasetId}`, options);
  }

  async runFlow(trifactaFlowId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`runFlow/v3/${trifactaFlowId}`, options);
  }

  async getFlowStatus(trifactaFlowId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`runFlow/v3/${trifactaFlowId}/latestJobStatus`, options);
  }

  async flowIsModified(trifactaFlowId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`flow/${trifactaFlowId}/isModified`, options);
  }

  async isUserPartOfTrifactaGroup(engagementid) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`user/isuserpartoftrifactausergroup/${engagementid}`, options);
  }

  async exportDataFlow(trifactaFlowId) {
    return this.makeFetchRequest(`flow/exportTrifactaFlow/${trifactaFlowId}`, {}, false);
  }

  async importFlow(workpaperId, flowId, file, bundleTransformation) {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': ContentTypes.MULTIPART_FORM_DATA,
      },
    };

    let importFlowURL = `flow/workpaperImportFlow?workpaperId=${workpaperId}&oldFlowId=${flowId}`;

    importFlowURL = bundleTransformation ? `${importFlowURL}&bundleTransformation=true` : importFlowURL;

    return this.makeRequest(importFlowURL, options);
  }

  async getFlowOutputs(flowId) {
    return this.makeRequest(`flow/${flowId}/outputs`);
  }

  async getAndSyncFlowOutputs(workpaperId) {
    const options = {
      method: 'POST',
    };

    return this.makeRequest(`flow/outputs/sync/${workpaperId}`, options);
  }

  async getAndSyncFlowOutputsDmts(workpaperId) {
    const options = {
      method: 'POST',
    };

    return this.makeRequest(`flow/outputs/syncdmts/${workpaperId}`, options);
  }

  async getTrifactaParameters(flowId) {
    return this.makeRequest(`flow/${flowId}/recipeParameters`);
  }

  async setTrifactaParameter(paramInfo) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: paramInfo,
    };

    return this.makeRequest('flow/runParameters', options);
  }

  async getTrifactaJRSteps(flowId) {
    return this.makeRequest(`flow/${flowId}/JRSteps`);
  }

  async setTrifactaJRSteps(flowId, jrStepInfo) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: jrStepInfo,
    };

    return this.makeRequest(`flow/${flowId}/setJrStepConfirmationFlag`, options);
  }

  async getOutputSchema(jobId) {
    const options = {
      method: 'GET',
    };

    return this.makeRequest(`flow/getOutputSchemaByJobId/${jobId}`, options);
  }

  async getFlowDetails(flowId) {
    const options = {
      method: 'GET',
    };

    return this.makeRequest(`/flow/${flowId}/flowDetails`, options);
  }

  async runSpecificDataFlows(flowId, runFlowIds) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        nodeIds: runFlowIds,
      },
    };

    return this.makeRequest(`runFlow/v4/${flowId}/jobGroups/runAsUser`, options);
  }

  async validateFlowRecipes(flowId) {
    const options = {
      method: 'GET',
    };

    return this.makeRequest(`/flow/${flowId}/validate`, options);
  }

  async getEditRecipesHistory(flowId, startdate, enddate, timezone) {
    const options = {
      method: 'GET',
    };

    const params = startdate && enddate && timezone ? `?startDate=${startdate}&endDate=${enddate}&tz=${timezone}` : '';

    return this.makeRequest(`/flow/${flowId}/edithistory${params}`, options);
  }

  async replaceDataModelInFlowInput(flowId, inputDataSetId, newDataModelInputId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        inputDataSetId,
        newDataModelInputId,
      },
    };

    return this.makeRequest(`/dataset/${flowId}/replaceDataModel`, options);
  }
}

export default new DataWranglerService();
