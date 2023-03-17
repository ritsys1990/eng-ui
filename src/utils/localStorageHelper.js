import * as locale from './localization.const';

export const keyExist = key => {
  try {
    return !!window.localStorage.getItem(key);
  } catch (err) {
    return false;
  }
};

export const getValue = key => {
  try {
    return window.localStorage.getItem(key);
  } catch (err) {
    return null;
  }
};

export const saveValue = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    // Log the error
    throw new Error('Error accessing session storage');
  }
};

export const removeValue = x => {
  try {
    localStorage.removeItem(x);
  } catch (err) {
    throw new Error('Error cleaning the session');
  }
};

export const clearLocalizationKeys = () => {
  try {
    Object.entries(localStorage)
      .map(x => x[0])
      .filter(x => x.substring(0, 4) === locale.LOCALIZATION_CACHE_KEY)
      .map(x => removeValue(x));
  } catch (err) {
    throw new Error('Error clearing localization keys');
  }
};
