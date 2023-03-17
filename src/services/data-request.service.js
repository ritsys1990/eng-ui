import BaseService from './baseService';

class DataRequestService extends BaseService {
  name = 'DataRequest Service';

  getUrl(path) {
    return `/datarequest-service/${path}`;
  }

  async dataRequestsByAgentId(id) {
    return this.makeRequest(`/datarequests/byAgent/${id}`);
  }
}

export default new DataRequestService();
