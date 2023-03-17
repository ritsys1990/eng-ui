import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

const CONTENT_LIBRARY_ID = '0000-engagement';

class PipelineExecutionService extends BaseService {
  name = 'PipelineExecution Service';

  getUrl(path) {
    return `/pipelineexecution-service${path}`;
  }

  async checkWPStatus(engagementId, data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };
    const id = engagementId || CONTENT_LIBRARY_ID;

    return this.makeRequest(`/PipelineExecution/WpBatches/engagement/${id}/checkWPStatus`, options);
  }
}

export default new PipelineExecutionService();
