import BaseService from './baseService';

class SparkJobManagementService extends BaseService {
  name = 'SparkJobManagement Service';

  getUrl(path) {
    return `/sparkjobmanagement-service/${path}`;
  }

  async getNotebookWorkPapers() {
    return this.makeRequest('v1/notebooks');
  }
}

export default new SparkJobManagementService();
