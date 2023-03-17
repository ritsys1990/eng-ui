import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class EngagementService extends BaseService {
  name = 'Engagement Service';

  getUrl(path) {
    return `/engagement-service/${path}`;
  }

  async getEngagementById(id) {
    return this.makeRequest(`engagements/${id}`);
  }

  async getMyEngagementsByClient(clientId) {
    return this.makeRequest(`engagements/${clientId}/my`);
  }

  async getDatasources(engagementId, bundleBaseId) {
    return this.makeRequest(`/datasources/byEngagementAndBundleBase/${engagementId}/${bundleBaseId}/subscribed`);
  }

  async initiateLegalhold(engagementId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`engagements/${engagementId}/legalhold/initiate`, options);
  }

  async getDataSourcesByClient(clientId) {
    return this.makeRequest(`/datasources/byclient/${clientId}`);
  }

  async getDataSourcesSubscriptions(dataSourceId) {
    return this.makeRequest(`/datasourcesubscriptions/byDataSource/${dataSourceId}`);
  }

  async getDataSourcesConnections(dataSourceId) {
    return this.makeRequest(`connections/bydatasource/${dataSourceId}`);
  }

  async testConnection(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data),
    };

    return this.makeRequest(`connections/test`, options);
  }

  async testExistingConnection(id) {
    const options = {
      method: 'POST',
    };

    return this.makeRequest(`connections/${id}/test`, options);
  }

  async getEngagementsByClient(clientId) {
    return this.makeRequest(`engagements/byClient/${clientId}`);
  }

  async getMatGlobalClientEngagements(matCustomerNumber, matClientId) {
    let query = '';
    if (matCustomerNumber && matClientId) {
      query = `?MatCustomerNumber=${matCustomerNumber}&MatClientId=${matClientId}`;
    } else {
      query = matCustomerNumber ? `?MatCustomerNumber=${matCustomerNumber}` : `?MatClientId=${matClientId}`;
    }

    return this.makeRequest(`engagements/mat/searchByCustomerNumber${query}`);
  }

  async getMatClientEngagements(matClientId) {
    return this.makeRequest(`engagements/mat/byMatClientId/${matClientId}`);
  }

  async addNewEngagement(data) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`engagements`, options);
  }

  async rollforwardEngagement(data, confirmed = false) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`engagements/rollforward?confirmed=${confirmed}`, options);
  }

  async reconсileEngagements(engagements) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(engagements),
    };

    return this.makeRequest('engagements/reconcile', options);
  }

  async provisionEngagement(engagementIds) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(engagementIds),
    };

    return this.makeRequest('engagements/provisionEngagements', options);
  }

  async deleteEngagement(engagementId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`engagements/${engagementId}`, options);
  }

  async updateDataSource(payload) {
    const options = {
      method: 'PUT',
      data: payload,
    };

    return this.makeRequest('/datasources', options);
  }

  async approveDataSourceSubscription(dataSourceId) {
    const options = {
      method: 'POST',
    };

    return this.makeRequest(`datasourcesubscriptions/${dataSourceId}/approve`, options);
  }

  async rejectDataSourceSubscription(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(payload),
    };

    return this.makeRequest(`datasourcesubscriptions/reject`, options);
  }

  async deleteDataSource(dataSourceId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`datasources/${dataSourceId}`, options);
  }

  async deleteDataSourceConfig(dataSourceId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`datasources/${dataSourceId}/config`, options);
  }

  async configureDataSourceExtractionScript(dataSourceId, payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(payload),
    };

    return this.makeRequest(`datasources/${dataSourceId}/configure-extraction-script`, options);
  }

  async createDataSourceConnection(payload, isUpdate) {
    const options = {
      method: isUpdate ? 'PUT' : 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(payload),
    };

    return this.makeRequest(`connections`, options);
  }

  async deleteConnection(connectionId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`connections/${connectionId}`, options);
  }

  async setConnectionsAsDefault(id) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`connections/${id}/setasdefault`, options);
  }

  async getEngagementRenameStatus(engagementId) {
    return this.makeRequest(`engagements/${engagementId}/renamestatus`);
  }

  async updatepathEngagementPath(engagementId, clientId, email) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        clientId,
        engagementId,
        email,
      },
    };

    return this.makeRequest(`engagements/${engagementId}/updatepath`, options);
  }
}

export default new EngagementService();
