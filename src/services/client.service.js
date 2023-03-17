import BaseService from './baseService';
import { ContentTypes } from './constants/constants';

class ClientService extends BaseService {
  name = 'Client Service';

  getUrl(path) {
    return `/client-service/${path}`;
  }

  async getClientById(id) {
    return this.makeRequest(`clients/${id}`);
  }

  async getClientList() {
    return this.makeRequest('clients');
  }

  async getPaginationList(name = '', limit = 20, offset = 0, updatePerm = true) {
    return this.makeRequest(
      name !== ''
        ? `clients?query=${name}&offset=${offset}&limit=${limit}&allClients=${updatePerm}`
        : `clients?offset=${offset}&limit=${limit}&allClients=${updatePerm}`
    );
  }

  async getMyClientsList() {
    return this.makeRequest('clients/my');
  }

  async searchMatClients(query, count, memberFirmCode, globalClient) {
    return this.makeRequest(
      `globalization/clients/${memberFirmCode}/search?query=${query}&count=${count}&globalClient=${globalClient}`
    );
  }

  async createClient(client) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: client,
    };

    return this.makeRequest('clients', options);
  }

  async deleteClient(clientId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`clients/${clientId}`, options);
  }

  async getCSAUsers(clientName) {
    const name = clientName.slice(-1) === '.' ? clientName.slice(0, -1) : clientName;

    return this.makeRequest(`clients/csaUsers?name=${name}`);
  }

  async createStorage(clientId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: {},
    };

    return this.makeRequest(`clients/${clientId}/storage`, options);
  }

  async getEntities(clientId) {
    return this.makeRequest(`clients/${clientId}/entities`);
  }

  async getMatClient(matClientId) {
    return this.makeRequest(`clients/by-mat/${matClientId}`);
  }

  async getMatClientEntities(matClientId) {
    return this.makeRequest(`clients/mat/${matClientId}/entities`);
  }

  async saveClient(client) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(client),
    };

    return this.makeRequest(`clients/${client.id}`, options);
  }

  async addDomain(clientId, domainName) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(domainName),
    };

    return this.makeRequest(`clients/${clientId}/domain`, options);
  }

  async deleteDomain(clientId, domainName) {
    const options = {
      method: 'DELETE',
      headers: {},
    };

    return this.makeRequest(`clients/${clientId}/domain/${domainName}`, options, false);
  }

  async deleteClientOrg(clientId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`clients/${clientId}/org`, options, false);
  }

  async createClientOrg(clientId) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      body: '',
    };

    return this.makeRequest(`clients/${clientId}/org`, options, false);
  }

  async mapClientToOrg(clientId, orgId) {
    const options = {
      method: 'PUT',
    };

    return this.makeRequest(`clients/${clientId}/org/${orgId}`, options);
  }

  async addEntity(clientId, payload) {
    const options = {
      method: 'POST',
      headers: {},
      data: payload,
    };

    return this.makeRequest(`clients/${clientId}/entities`, options);
  }

  async saveEntity(clientId, entity) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(entity),
    };

    return this.makeRequest(`clients/${clientId}/entities/${entity.id}`, options);
  }

  async deleteEntity(clientId, entityId) {
    const options = {
      method: 'DELETE',
    };

    return this.makeRequest(`clients/${clientId}/entities/${entityId}`, options);
  }

  async postSubOrg(clientId, data) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data),
    };

    return this.makeRequest(`clients/${clientId}/suborgs`, options);
  }

  async updateSubOrg(clientId, subOrgId, data) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify(data),
    };

    return this.makeRequest(`clients/${clientId}/suborgs/${subOrgId}`, options);
  }

  async deleteSubOrg(clientId, subOrgId) {
    const options = {
      method: 'DELETE',
      headers: {},
    };

    return this.makeRequest(`clients/${clientId}/suborgs/${subOrgId}`, options, false);
  }

  async getEntity(clientId, entityId) {
    return this.makeRequest(`/clients/${clientId}/entities/${entityId}`);
  }

  async updateClientUsesSecureAgent(clientId, usesSecureAgent) {
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': ContentTypes.APPLICATION_JSON,
      },
      data: JSON.stringify({ usesSecureAgent }),
    };

    return this.makeRequest(`clients/${clientId}/usesSecureAgent`, options, false);
  }
}

export default new ClientService();
