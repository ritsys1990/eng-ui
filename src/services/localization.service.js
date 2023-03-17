import BaseService from './baseService';

class LocalizationService extends BaseService {
  name = 'Localization Service';

  getUrl(path) {
    return `/localization-service/${path}`;
  }

  async getContent(lang = 'en-US', appName = 'Audit-Cortex') {
    return this.makeRequest(`localization/content?localeCode=${lang}&appName=${appName}`);
  }

  async getUserLocale() {
    return this.makeRequest(`localization/GetUserPreferredLanguage`);
  }

  async setUserLocale(preferredLanguage = 'en-US') {
    const options = {
      method: 'PUT',
      data: {
        preferredLanguage,
      },
    };

    return this.makeRequest(`localization/UpdateUserPreferredLanguage`, options);
  }

  async getSupportedLocales(appName = 'Audit-Cortex') {
    return this.makeRequest(`localization/GetLanguages?appName=${appName}`);
  }
}

export default new LocalizationService();
