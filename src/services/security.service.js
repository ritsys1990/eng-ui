import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class SecurityService extends BaseService {
  name = 'Security Service';

  getUrl(path) {
    return `/security-service/${path}`;
  }

  async getMyGlobalPermissions() {
    // return SecurityMockJSON;
    return this.makeRequest('Users/access');
  }

  async getEngagementPermissions(engagementId, clientId = null) {
    const formattedURL = clientId
      ? `/Users/access/engagement/${engagementId}?clientId=${clientId}`
      : `/Users/access/engagement/${engagementId}`;

    return this.makeRequest(formattedURL);
  }

  async getMe() {
    return this.makeRequest('Users/me');
  }

  async getMeRoles() {
    return this.makeRequest(`Users/me/roles`);
  }

  async createClientUser(clientId, user) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': ContentTypes.APPLICATION_JSON },
      data: user,
    };

    return this.makeRequest(`client/${clientId}/users`, options);
  }

  async createEngagementUser(engagementId, user) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': ContentTypes.APPLICATION_JSON },
      data: user,
    };

    return this.makeRequest(`engagement/${engagementId}/users`, options);
  }

  async createClientExternalUser(clientId, user) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: user,
    };

    return this.makeRequest(`client/${clientId}/users/external`, options);
  }

  async getRoleList(tier, offset = 0, limit = 99) {
    return this.makeRequest(`roles/${tier}?offset=${offset}&limit=${limit}`);
  }

  async getMyEngagementsUserRole(engagementId) {
    return this.makeRequest(`engagement/${engagementId}/users`);
  }

  async fetchGeoCode() {
    return this.makeRequest(`GeoCountries/GeoInformation`);
  }

  async fetchCountries(memberFirmCode, geoCode, globalClient) {
    return this.makeRequest(
      `GeoCountries/Cortexcountries?geoCode=${geoCode}&memberfirmcode=${memberFirmCode}&globalClient=${globalClient}`
    );
  }

  async getUnacceptedTOU() {
    return this.makeRequest('tou/unaccepted');
  }

  async acceptTOU(tou) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
    };

    return this.makeRequest(`tou/accept/${tou}`, options);
  }

  async getClientPermissions(clientId) {
    return this.makeRequest(`/Users/access/client/${clientId}`);
  }

  async getClientRecertificationStatus(clientId) {
    return this.makeRequest(`recertification/client/${clientId}`);
  }

  async getClientExternalRecertificationStatus(clientId) {
    return this.makeRequest(`recertification/client/${clientId}/external`);
  }

  async getAlertsList(limit = 99) {
    return this.makeRequest(`alerts?limit=${limit}&order=Descending`);
  }

  async addTokenToBlacklist() {
    return this.makeRequest(`/auth/logout`, {});
  }
}

export default new SecurityService();
