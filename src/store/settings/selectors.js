const selectLocalization = state => state.settings.get('content');
const selectFetchingLocalization = state => state.settings.get('fetchingLocalization');
const selectLocaleFormats = state => state.settings.get('localeFormats');
const selectLocale = state => state.settings.get('locale');
const selectfetchingUserLocale = state => state.settings.get('fetchingUserLocale');
const selectfetchingUserLocaleError = state => state.settings.get('fetchingUserLocaleError');
const selectSupportedLocales = state => state.settings.get('supportedLocales');
const selectDefaultSupportedLocales = state => state.settings.get('defaultSupportedLocales');
const selectFetchingSetUserLocale = state => state.settings.get('fetchingSetUserLocale');
const selectFetchingSetUserLocaleError = state => state.settings.get('fetchingSetUserLocaleError');
const selectDefaultLocaleFormats = state => state.settings.get('defaultLocaleFormats');

export const settingsSelectors = {
  selectLocalization,
  selectFetchingLocalization,
  selectLocaleFormats,
  selectLocale,
  selectfetchingUserLocale,
  selectfetchingUserLocaleError,
  selectSupportedLocales,
  selectDefaultSupportedLocales,
  selectFetchingSetUserLocale,
  selectFetchingSetUserLocaleError,
  selectDefaultLocaleFormats,
};
