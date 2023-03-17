import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { getUserEmail } from '../../utils/authHelper';
import { eventName } from './appInsights.const';
import env from 'env';

let appInsights = null;
// possible null value during enabling/disabling with cookie consent needs to be avoided, thus we initialize the value up here.
const reactPlugin = new ReactPlugin();

const createTelemetryService = () => {
  const initialize = (instrumentationKey, browserHistory) => {
    if (!browserHistory) {
      throw new Error('Could not initialize Telemetry Service');
    }
    if (!instrumentationKey) {
      throw new Error('Instrumentation key not provided in ./src/telemetry-provider.jsx');
    }

    appInsights = new ApplicationInsights({
      config: {
        instrumentationKey,
        maxBatchInterval: 0,
        disableFetchTracking: false,
        extensions: [reactPlugin],
        extensionConfig: {
          [reactPlugin.identifier]: {
            history: browserHistory,
          },
        },
      },
    });

    appInsights.loadAppInsights();
  };

  return { reactPlugin, appInsights, initialize };
};

/* eslint-disable */
export const trackEvent = (name, properties = null, metrics = null) => {
  const payload = { ...properties };
  const measurements = { ...metrics };

  const callTrackEvent = params => {
    if (env.APPINSIGHTS_INSTRUMENTATIONKEY && appInsights) {
      appInsights?.trackEvent({ name, properties: params, measurements });
    }
  };

  if (name == eventName.FILE_UPLOAD || name == eventName.TABLEAU_REQUEST) {
    getUserEmail().then(email => {
      payload.user = email;
      callTrackEvent(payload);
    });
  } else {
    callTrackEvent(payload);
  }
};

export const ai = createTelemetryService();
export const getAppInsights = () => appInsights;
