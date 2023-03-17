import BaseService from './baseService';

class InformaticaService extends BaseService {
  name = 'Informatica Service';

  getUrl(path) {
    return `/informatica-service/${path}`;
  }

  async getOrgWithSubOrgTokens(orgId) {
    return this.makeRequest(`/org/${orgId}/withSubOrgTokens`);
  }

  async getOrg(orgId) {
    return this.makeRequest(`/org/${orgId}`);
  }

  async getToken(orgId) {
    return this.makeRequest(`/users/${orgId}/informaticatoken`);
  }

  async getTokenWithForceRefresh(orgId) {
    return this.makeRequest(`/users/${orgId}/informaticatoken?forceRefresh=true`);
  }

  async getRuntimeEnvironments(orgId) {
    return this.makeRequest(`org/${orgId}/runtimeenvironments`);
  }

  async getAgents(orgId) {
    return this.makeRequest(`/org/${orgId}/agents/suborgs`);
  }

  async getAgentsSuborgs(orgId) {
    return this.makeRequest(`/org/${orgId}/agents/suborgs`);
  }
}

export default new InformaticaService();
