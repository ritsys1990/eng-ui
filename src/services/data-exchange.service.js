import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class DataRequestService extends BaseService {
  name = 'DataExchange Service';

  getUrl(path) {
    return `/dataexchange-service/${path}`;
  }

  async linkOmniaEngagement(token) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: { token },
    };

    return this.makeRequest(`/omniaIntegration/linkOmniaEngagement`, options);
  }

  async submitFileSharingRequest(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`/omniaIntegration/submitFileSharingRequest`, options);
  }

  async checkFileSharingRequestStatusById(omniaEngagementFileId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(
      `/omniaIntegration/checkFileSharingRequestStatusById?omniaEngagementFileId=${omniaEngagementFileId}`,
      options
    );
  }

  async getSendToOmniaOutputHistory(outputId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`/omniaIntegration/getBriefOmniaEngagementFiles?outputId=${outputId}`, options);
  }

  async getBriefLinkedOmniaEngagements(cortexEngagementId) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(
      `/omniaIntegration/getBriefLinkedOmniaEngagements?cortexEngagementId=${cortexEngagementId}`,
      options
    );
  }

  async unlinkOmniaEngagement(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest(`/omniaIntegration/unlinkOmniaEngagement`, options);
  }
}

export default new DataRequestService();
