import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class BundlesService extends BaseService {
  name = 'Bundles Service';

  getUrl(path) {
    return `/bundle-service/${path}`;
  }

  async fetchAllTagsWithGroups() {
    return this.makeRequest('taggroups/tags');
  }

  async fetchOnlyPublishedTagsWithGroups(latest = false) {
    return this.makeRequest(`taggroups/tags?publishState=published&latest=${latest}`);
  }

  async getDatamodelFromId(datamodelId) {
    return this.makeRequest(`datamodels/${datamodelId}`);
  }

  async getDatamodelFields(datamodelId) {
    return this.makeRequest(`datamodels/${datamodelId}/fields`);
  }

  async getAllDataModelsForWB(publishstate = 'published', isLatestDataModel = true) {
    return this.makeRequest(`/datamodels/alldatamodelslist/${publishstate}/${isLatestDataModel}`);
  }

  async deleteField(dataModelId, id, confirmed = true, permanent = true) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(
      `/datamodels/${dataModelId}/fields/${id}?confirmed=${confirmed}&permanent=${permanent}`,
      options
    );
  }

  async getPublishedBundleBaseList(limit = 9999999, offset = 0, tags = [], name, sort) {
    const params = ['?publishState=published'];
    if (limit) {
      params.push(`limit=${limit}`);
    }
    if (offset) {
      params.push(`offset=${offset}`);
    }
    if (name) {
      params.push(`name=${name}`);
    }
    if (tags.length) {
      params.push(...tags.map(tag => `tagIds=${tag}`));
    }
    if (sort) {
      params.push(`sort=${sort}`);
    }

    return this.makeRequest(`/bundlebases/releases/${params.join('&')}`);
  }

  // returns source systems with published bundles
  async fetchPublishedBundlesList(id, limit, offset, sort) {
    const params = ['?publishState=published'];
    if (limit) {
      params.push(`limit=${limit}`);
    }
    if (offset) {
      params.push(`offset=${offset}`);
    }
    if (sort) {
      params.push(`sort=${sort}`);
    }

    return this.makeRequest(`/bundlebases/releases/${id}/${params.join('&')}`);
  }

  async getPublishedDatamodelList() {
    try {
      return await this.makeRequest('/datamodels?publishState=published');
    } catch (err) {
      return {};
    }
  }

  async getDatamodelsList() {
    return this.makeRequest('/datamodels');
  }

  async cloneDataModelFromOldDataModel(dataModelId, engagementId, nodeId, delimiter = ',') {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: { dataModelId, engagementId, nodeId, delimiter },
    };

    return this.makeRequest(`/datamodels/clonedataModel`, options);
  }

  async getSourceSystemNames() {
    return this.makeRequest('/sourcesystems/names');
  }

  async getFieldTypes() {
    return this.makeRequest('/enums/fielddatatypes');
  }

  async updateDMField(datamodelId, field) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: field,
    };

    return this.makeRequest(`/datamodels/${datamodelId}/fields`, options);
  }

  async updateDataModel(dataModel) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: dataModel,
    };

    return this.makeRequest(`/datamodels`, options);
  }

  async switchDMToDraft(datamodelId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/datamodels/${datamodelId}/state?newPublishState=Draft`, options);
  }

  async postAddGuidance(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data.body),
    };

    return this.makeRequest(`/datamodels/${data.id}/generalinstructions`, options);
  }

  async exportDataModels(params) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(params),
    };

    return this.makeRequest('/datamodels/export', options);
  }

  async uploadDataModels(file) {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: formData,
    };

    return this.makeRequest(`/datamodels/import?bundleBaseId=`, options);
  }

  async submitDMForReview(datamodelId, comments, releaseType, rationaleComments) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(
      `/datamodels/${datamodelId}/state?newPublishState=readyForReview&comment=${comments}&releaseType=${releaseType}&releaseTypeComment=${rationaleComments}`,
      options
    );
  }

  async deleteDM(datamodelId, confirmed = true, permanent = true) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`/datamodels/${datamodelId}?confirmed=${confirmed}&permanent=${permanent}`, options);
  }

  async redirectToDMValidations(datamodel) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: datamodel,
    };

    return this.makeRequest(`/datamodels/redirectToDMValidations`, options);
  }

  async fetchDatamodelContents(datamodel) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: datamodel,
    };

    return this.makeRequest('/datamodels/externaldatamodelstransformlist', options);
  }

  async fetchDMTContents(option) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: option,
    };

    return this.makeRequest('/datamodels/externaldatamodelstransformlist', options);
  }

  async ingestDatamodel(ingestingDatamodel) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: ingestingDatamodel,
    };

    return this.makeRequest('/datamodels/ingestexternaldatamodels', options);
  }

  async ingestDMT(option) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: option,
    };

    return this.makeRequest('/datamodels/ingestdatamodelstransformation', options);
  }

  async changeDataModelState(dataModelId, sampleDSNodeId) {
    return this.makeRequest(`/datamodels/updateSampleDSInfo/${dataModelId}/${sampleDSNodeId}`);
  }

  async getDatamodelsByIds(datamodelsIds) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: datamodelsIds,
    };

    return this.makeRequest('/datamodels/datamodelsDataByIds', options);
  }

  async getTemplateDetails(templateId) {
    return this.makeRequest(`/connectiontemplates/${templateId}`);
  }

  async getTemplateProperties(templateId) {
    return this.makeRequest(`/connectiontemplates//${templateId}/properties`);
  }

  async fetchAllPublishedConTemp() {
    return this.makeRequest(`/connectiontemplates?publishState=published`);
  }

  async fetchAllEnvironments() {
    return this.makeRequest(`/bundles/ingestenvslist`);
  }

  async getBundleNameDetails(bundleId) {
    return this.makeRequest(`/bundles/${bundleId}/name`);
  }

  async createSourceVersionFilter(sourceVersionId, data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data),
    };

    return this.makeRequest(`/sourceversions/${sourceVersionId}/sourceFilter`, options);
  }

  async fetchBundleContexts(bundleId, all) {
    return this.makeRequest(`/bundles/${bundleId}/bundlecontexts?all=${all}`);
  }

  async fetchTableContexts(bundleId, bundleContextId, all = false) {
    return this.makeRequest(`/bundles/${bundleId}/bundlecontexts/${bundleContextId}/tablecontexts?all=${all}`);
  }

  async fetchFieldsContext(bundleId, bundleContextId, tableContextId, all = false) {
    return this.makeRequest(
      `/bundles/${bundleId}/bundlecontexts/${bundleContextId}/tablecontexts/${tableContextId}/fieldcontexts?all=${all}`
    );
  }

  async getSourceVersionAllFilters(bundleId, sourceVersionId) {
    return this.makeRequest(`/sourceversions/${bundleId}/${sourceVersionId}/sourceFilter`);
  }

  async deleteSourceVersionFilter(sourceVersionId, filterId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`/sourceversions/${sourceVersionId}/sourceFilter/${filterId}`, options);
  }

  async editSourceVersionFilter(sourceVersionId, filterId, data) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data),
    };

    return this.makeRequest(`/sourceversions/${sourceVersionId}/sourceFilter/${filterId}`, options);
  }

  async fetchContents(environment = 'dev', publishstate = 'published') {
    return this.makeRequest(`/datamodels/externaldatamodelslist/${environment}/${publishstate}`);
  }

  async getTrifactaBundles() {
    return this.makeRequest(`/bundles/trifactabundles`);
  }

  async getBundlesFromId(bundleId) {
    return this.makeRequest(`/bundles/${bundleId} `);
  }

  async getAllCommonDataModels() {
    return this.makeRequest('/common-datamodels');
  }

  async updateCommonDataModel(commonDM) {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: commonDM,
    };

    return this.makeRequest('/common-datamodels', options);
  }

  async deleteCommonDataModel(cdmId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`/common-datamodels/${cdmId}`, options);
  }

  async getMappedDMsofCDM(cdmId) {
    return this.makeRequest(`/common-datamodels/${cdmId}/mappedDMs`);
  }
}
export default new BundlesService();
