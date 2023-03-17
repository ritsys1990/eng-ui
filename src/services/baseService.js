import { v4 as uuidv4 } from 'uuid';
import { apiFetch } from '../utils/authHelper';
import ServerError from '../utils/serverError';
import pathUtils from 'path';
import axios from 'axios';

const PROXY_PATH = '/proxy';

class BaseService {
  async makeRequest(apiPath = '', customOptions = {}) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      ...customOptions,
    };
    options.headers.ConversationID = uuidv4();
    options.headers['Cache-Control'] = 'no-store, no-cache';
    options.headers.Pragma = 'no-cache';
    options.headers.Expires = '0';
    const path = pathUtils.join(PROXY_PATH, this.getUrl(apiPath));

    const name = this.name || this.constructor.name;
    try {
      const response = await apiFetch(axios, path, options);
      // Return null when the response has No Content
      if (response.status === 204) {
        return null;
      }

      return response.data;
    } catch (e) {
      if (e instanceof ServerError) {
        throw e;
      }
      throw new ServerError(e.message, e?.response?.status, e?.response?.data, name);
    }
  }

  async makeFetchRequest(apiPath = '', customOptions = {}, json = true) {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      ...customOptions,
    };
    options.headers.ConversationID = uuidv4();
    options.headers['Cache-Control'] = 'no-store, no-cache';
    options.headers.Pragma = 'no-cache';
    options.headers.Expires = '0';
    const path = pathUtils.join(PROXY_PATH, this.getUrl(apiPath));

    const name = this.name || this.constructor.name;
    try {
      const response = await apiFetch(fetch, path, options);
      if (response.status >= 300) {
        let errorText = '';
        let errorBody = null;
        try {
          errorBody = await response.json();
          errorText = response.statusText;
        } catch (e) {
          // Do nothing if couldn't parse error as JSON
          errorText = '';
        }
        throw new ServerError(errorText, response.status, errorBody, name);
      }

      // Return null when the response has No Content
      if (response.status === 204) {
        return null;
      }

      return json ? response.json() : response;
    } catch (e) {
      if (e instanceof ServerError) {
        throw e;
      }
      throw new ServerError(e);
    }
  }
}

export default BaseService;
