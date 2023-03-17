import { Map as ImmutableMap } from 'immutable';
import { SettingsActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  locale: { value: 'en-US', text: `English (United States)` },
  content: {},
  fetchingLocalization: false,
  fetchingContent: false,
  defaultLocaleFormats: {
    date: 'M/D/YYYY',
  },
  localeFormats: {
    date: 'M/D/YYYY',
  },
  fetchingUserLocale: false,
  fetchingUserLocaleError: false,
  supportedLocales: [],
  defaultSupportedLocales: [{ value: 'en-US', text: `English (United States)` }],
  fetchingSetUserLocale: false,
  fetchingSetUserLocaleError: false,
  fetchingContentError: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case SettingsActionTypes.GET_USER_LOCALE_REQUEST:
      return state.merge({
        fetchingUserLocale: true,
      });

    case SettingsActionTypes.GET_USER_LOCALE_SUCCESS:
      return state.merge({
        fetchingUserLocale: false,
        locale: action.payload.userLocale,
        localeFormats: action.payload.localeFormats,
        fetchingUserLocaleError: false,
        supportedLocales: action.payload.mappedSupportedLocales,
      });

    case SettingsActionTypes.GET_USER_LOCALE_ERROR:
      return state.merge({
        fetchingUserLocale: false,
        fetchingUserLocaleError: true,
      });

    case SettingsActionTypes.SET_USER_LOCALE_REQUEST:
      return state.merge({
        fetchingSetUserLocale: true,
      });

    case SettingsActionTypes.SET_USER_LOCALE_SUCCESS:
      return state.merge({
        fetchingSetUserLocale: false,
        locale: action.payload.userLocale,
        localeFormats: action.payload.localeFormats,
        fetchingSetUserLocaleError: false,
      });

    case SettingsActionTypes.SET_USER_LOCALE_ERROR:
      return state.merge({
        fetchingSetUserLocale: false,
        fetchingSetUserLocaleError: true,
      });

    case SettingsActionTypes.GET_LOCALIZATION_REQUEST:
      return state.merge({
        fetchingLocalization: true,
      });

    case SettingsActionTypes.GET_LOCALIZATION_CACHED_SUCCESS:
    case SettingsActionTypes.GET_LOCALIZATION_SUCCESS:
      return state.merge({
        fetchingLocalization: false,
        content: action.payload.content,
      });

    case SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK:
      return state.merge({
        fetchingLocalization: false,
        fetchingLocalizationError: true,
        content: action.payload.content,
      });

    case SettingsActionTypes.SET_LOCALE:
      return state.merge({
        localeFormats: action.payload,
      });

    default:
      return state;
  }
}
