import fallback from '../languages/fallback.json';
import store from '../store';

const PLACEHOLDER_PATTERN = /\${([^}]+)\}/g;

export const formatString = (template = '', data = {}) => {
  return template.replace(PLACEHOLDER_PATTERN, (match, p1) => {
    const val = data[p1];

    return val || match;
  });
};

const getLocalizedErrorMessage = localizationMetadata => {
  try {
    if (!localizationMetadata) {
      return null;
    }

    const { key, values } = localizationMetadata;

    // Check if there is a key in the metadata
    if (!key) {
      return null;
    }

    // Grabt the current state
    const state = store.getState();

    // Get the localization json out of it
    const content = state.settings.get('content');
    let template;

    if (content && content[key]) {
      template = content[key];
    } else if (fallback && fallback[key]) {
      template = fallback[key];
    }

    // Return null if the template does not exist
    if (!template) {
      return null;
    }

    // Check if there is a values in the metadata, if not just return the message without formatting
    if (!values) {
      return template;
    }

    return formatString(template, values);
  } catch (err) {
    throw new Error(err);
  }
};

export default getLocalizedErrorMessage;
