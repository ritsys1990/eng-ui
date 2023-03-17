import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class NotificationService extends BaseService {
  name = 'Notification Service';

  getUrl(path) {
    return `/notification-service/${path}`;
  }

  async getNotifications(limit = 5, offset = 0, type) {
    let params = limit ? `?limit=${limit}&offset=${offset}` : '';
    if (type) {
      if (params) {
        params += `&type=${type}`;
      } else {
        params = `?type=${type}`;
      }
    }

    return this.makeRequest(`Notifications/in-app${params}`);
  }

  async getUnread(limit = 10, offset = 0) {
    const params = limit ? `?limit=${limit}&offset=${offset}` : '';

    return this.makeRequest(`Notifications/in-app/unread${params}`);
  }

  async markAsRead(ids = []) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: ids,
    };

    return this.makeRequest(`Notifications/in-app/read`, options);
  }
}

export default new NotificationService();
