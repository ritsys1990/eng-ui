import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class JobOrchestratorService extends BaseService {
  name = 'Job Orchestrator Service';

  getUrl(path) {
    return `/joborchestrator-service/${path}`;
  }

  // Create one request with all the output names as the job metadata
  async runDataWrangleOutputs(engagementId, flowId, jobType, outputsNames) {
    const outputMetadataList = outputsNames.map(outputName => ({
      metadataKey: 'OutputName',
      metadataValue: outputName,
    }));

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        engagementId,
        jobs: [
          {
            jobType,
            metadata: [
              {
                metadataKey: 'FlowId',
                metadataValue: flowId,
              },
              ...outputMetadataList,
            ],
          },
        ],
      },
    };

    return this.makeRequest(`job/submit`, options);
  }

  // Runs specific Trifacta job accociated with the given output name
  async runDataModelJobByOutput(engagementId, flowId, jobType, outputName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        engagementId,
        jobs: [
          {
            jobType,
            metadata: [
              {
                metadataKey: 'FlowId',
                metadataValue: flowId,
              },
              {
                metadataKey: 'OutputName',
                metadataValue: outputName,
              },
            ],
          },
        ],
      },
    };

    return this.makeRequest(`job/submit`, options);
  }

  // Runs Trifacta flow
  async runFlow(engagementId, trifactaFlowId, jobType) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {
        engagementId,
        jobs: [
          {
            jobType,
            metadata: [
              {
                metadataKey: 'FlowId',
                metadataValue: trifactaFlowId,
              },
            ],
          },
        ],
      },
    };

    return this.makeRequest(`job/submit`, options);
  }

  // Gets the status of all jobs in the flow
  async getFlowStatus(trifactaFlowId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`monitor/status?flowId=${trifactaFlowId}`, options);
  }
}

export default new JobOrchestratorService();
