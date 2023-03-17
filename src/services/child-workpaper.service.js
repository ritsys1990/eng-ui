import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class ChildWorkpaperService extends BaseService {
  name = 'Child Workpaper Service';

  getUrl(path) {
    return `/workpaper-service/${path}`;
  }

  async getChildWorkPapers(parentId) {
    return this.makeRequest(`parent/${parentId}`);
  }

  async checkWorkpaperNameExists(engagementId, workpaperName, childDetailId = '') {
    return this.makeRequest(
      `childworkpapers/nameexists/${engagementId}/${encodeURIComponent(workpaperName)}?childDetailId=${childDetailId}`
    );
  }

  async saveChildWpFilterData(data, isUpdate) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };
    let request = 'childworkpapers/saveFilters';
    if (isUpdate) {
      const wpId = data?.id;
      request = `${request}/${wpId}`;
    }

    return this.makeRequest(request, options);
  }

  async deleteChildWorkpaper(childwpId) {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`childworkpapers/${childwpId}`, options);
  }

  async generateChildWorkpapers(data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data,
    };

    return this.makeRequest('childworkpapers/generateOutputs', options);
  }
}

export default new ChildWorkpaperService();
