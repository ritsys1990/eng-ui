import {
  ANALYTICS_SATELLITE_NAME,
  ANALYTICS_STACK_TIMEOUT,
  DATA_LAYER_NAME,
  AT_CHARACTER,
  DELOITTE,
} from './adobe-analytics.const';

class AdobeAnalyticsService {
  satellite = {};
  layersStack = [];

  set analyticsDataLayer(layer) {
    window[DATA_LAYER_NAME] = {
      pageInfo: layer,
    };
  }

  get analyticsDataLayer() {
    return window[DATA_LAYER_NAME].pageInfo;
  }

  constructor() {
    if (window.s_gi && window.s_account) {
      this.satellite = window.s_gi(window.s_account);

      return;
    }

    Object.defineProperty(window, ANALYTICS_SATELLITE_NAME, {
      get: () => this.satellite,
      set: satellite => {
        if (!satellite || !satellite.trackLayer) {
          return;
        }

        this.satellite = satellite;
        this.emptyLayersStack();
      },
    });
  }

  emptyLayersStack() {
    if (!this.layersStack.length) {
      return;
    }

    this.analyticsDataLayer = { ...this.layersStack[0] };
    this.trackLayer();

    setTimeout(() => {
      this.layersStack = this.layersStack.slice(1);
      this.emptyLayersStack();
    }, ANALYTICS_STACK_TIMEOUT);
  }

  trackLayer() {
    if (this.satellite) {
      this.satellite.t();
    }

    return !!this.satellite;
  }

  checkLayersStack = () => {
    if (!this.layersStack.length && this.trackLayer()) {
      return;
    }

    this.layersStack.push(this.analyticsDataLayer);
  };

  setDataLayer(actionName) {
    this.analyticsDataLayer = {
      eVar7: actionName,
    };

    this.checkLayersStack();
  }

  isDeloitteEmail = emailAddress => {
    const emailSections = (emailAddress || '').split(AT_CHARACTER);
    const emailDomain = emailSections && emailSections.length > 1 ? emailSections[1] : '';

    return typeof emailDomain !== 'undefined' && emailDomain !== '' && emailDomain.toLowerCase().includes(DELOITTE);
  };

  getUserId = emailAddress => {
    if (this.isDeloitteEmail(emailAddress)) {
      const emailSections = (emailAddress || '').split(AT_CHARACTER);

      return emailSections && emailSections.length > 1 ? emailSections[0] : '';
    }

    return '';
  };
}

export default new AdobeAnalyticsService();
