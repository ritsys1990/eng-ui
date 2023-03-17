import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

const CONTENT_LIBRARY_ID = '0000-engagement';
class PipelineService extends BaseService {
  name = 'Pipeline Service';

  getUrl(path) {
    return `/pipeline-service/${path}`;
  }

  async getContendLibraryPipelines(statuses) {
    let endPoint = `pipeline/${CONTENT_LIBRARY_ID}?clientWorkpapers=true&latestVersion=true`;
    if (statuses) {
      endPoint = `${endPoint}&statuses=${statuses}`;
    }

    return this.makeRequest(endPoint);
  }

  async addCLPipeline(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`pipeline/${CONTENT_LIBRARY_ID}`, options);
  }

  async updateCLPipeline(data) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`pipeline/${CONTENT_LIBRARY_ID}/${data.id}`, options);
  }

  async deleteCLPipeline(data) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`pipeline/${CONTENT_LIBRARY_ID}/${data.id}`, options);
  }

  async switchPipelineBackToDraft(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`pipeline/makedraft/${CONTENT_LIBRARY_ID}/${data.id}`, options);
  }

  async submitPipeline(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`pipeline/submitforreview`, options);
  }

  async approvePipeline(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`pipeline/approve/${CONTENT_LIBRARY_ID}/${data.id}`, options);
  }

  async rejectPipeline(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest('pipeline/reject', options);
  }

  async getPipelineList(engagementId) {
    return this.makeRequest(`pipeline/${engagementId}?clientWorkpapers=true`);
  }

  async createPipeline(engagementId, data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`pipeline/${engagementId}`, options);
  }

  async removePipeline(engagementId, pipelineId) {
    const options = {
      method: 'DELETE',
      headers: {},
    };

    return this.makeRequest(`pipeline/${engagementId}/${pipelineId}`, options);
  }

  async updatePipeline(engagementId, data) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`pipeline/${engagementId}/${data.id}`, options);
  }

  async getCLPipelineList(clientId, query, limit, offset) {
    return this.makeRequest(
      `pipeline/${CONTENT_LIBRARY_ID}?clientId=${clientId}&clientWorkpapers=true&statuses=Published&query=${query}&limit=${limit}&offset=${offset}&latestVersion=true`
    );
  }

  async pipelineNameExists(engagementId, pipelineName) {
    return this.makeRequest(`pipeline/nameexists/${engagementId}/${pipelineName}`);
  }

  async submitCLPipeline(engagementId, data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`engagement/${engagementId}/pipelinecloning`, options);
  }

  async getInputRelationship(engagementId, workpaperId) {
    const id = engagementId || CONTENT_LIBRARY_ID;

    return this.makeRequest(`relationship/engagement/${id}/workpaper/${workpaperId}`);
  }
}

export default new PipelineService();
