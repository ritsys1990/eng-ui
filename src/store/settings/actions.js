import { SettingsActionTypes } from './actionTypes';
import localizationService from '../../services/localization.service';
import { keyExist, getValue, saveValue } from '../../utils/localStorageHelper';
import * as locale from '../../utils/localization.const';
import fallback from '../../languages/fallback.json';
import { addGlobalError } from '../errors/actions';
import { AlertTypes } from 'cortex-look-book';
import { getTranslation } from '../../hooks/useTranslation';
import { datesFormats, localeLanguages } from '../../utils/formats.const';
import { getBrowserLocale } from 'src/utils/localeHelper';

const browserLocale = getBrowserLocale(localeLanguages);

export function getContent(lang, cortexAppName) {
  return async dispatch => {
    let content;
    try {
      dispatch({ type: SettingsActionTypes.GET_LOCALIZATION_REQUEST });
      const key = `${locale.LOCALIZATION_CACHE_KEY}.${lang}`;

      if (keyExist(key)) {
        content = JSON.parse(getValue(key));
        dispatch({
          type: SettingsActionTypes.GET_LOCALIZATION_CACHED_SUCCESS,
          payload: { content },
        });
      } else {
        content = await localizationService.getContent(lang, cortexAppName);

        dispatch({
          type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS,
          payload: { content: content.Values },
        });
        saveValue(key, JSON.stringify(content.Values));
      }

      return true;
    } catch (err) {
      // 404 Cases:
      // 1 - When the endpoint returns 404 with content, we set the data with response content
      // 2 - When the endpoint returns 404 with no content, we set the data with fallback.json
      if (err.code === 404) {
        if (err.body && err.body.values && Object.keys(err.body.values).length > 0) {
          content = err.body.values;
        } else {
          content = fallback;
        }
      } else if (err.code !== 200) {
        // Anything else, including 500, set data with fallback.json
        content = fallback;
      }

      dispatch({ type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK, payload: { content, err } });
      dispatch({ type: SettingsActionTypes.GET_CONTENT_ERROR });
      dispatch(
        addGlobalError({
          ...err,
          message: getTranslation(content).t('Pages_Fallback_Error_Message'),
          type: AlertTypes.ERROR,
        })
      );

      return false;
    }
  };
}

export function getLocale() {
  return async dispatch => {
    try {
      dispatch({ type: SettingsActionTypes.GET_USER_LOCALE_REQUEST });

      const userLocaleCode = await localizationService.getUserLocale();
      const supportedLocales = await localizationService.getSupportedLocales(locale.LOCALIZATION_APP_NAME);
      const mappedSupportedLocales =
        supportedLocales &&
        supportedLocales.map(supportedLocale => ({
          value: supportedLocale.localeCode,
          text: supportedLocale.language,
        }));
      let userLocale;
      if (
        userLocaleCode &&
        userLocaleCode.preferredLanguage &&
        mappedSupportedLocales &&
        mappedSupportedLocales.length
      ) {
        userLocale =
          mappedSupportedLocales.find(supportedLocale => supportedLocale.value === userLocaleCode.preferredLanguage) ||
          locale.LOCALIZATION_DEFAULT_LANG_OBJECT;
      } else {
        userLocale = locale.LOCALIZATION_DEFAULT_LANG_OBJECT;
        localizationService.setUserLocale(userLocale.value);
      }

      dispatch(getContent(userLocale.value, 'Audit-Cortex'));

      dispatch({
        type: SettingsActionTypes.GET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale,
          mappedSupportedLocales,
          localeFormats: datesFormats[browserLocale.value],
        },
      });

      return true;
    } catch (err) {
      dispatch({ type: SettingsActionTypes.GET_USER_LOCALE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}

export function setLocale(newLocale) {
  return async dispatch => {
    try {
      dispatch({ type: SettingsActionTypes.SET_USER_LOCALE_REQUEST });
      await localizationService.setUserLocale(newLocale.value);

      dispatch({
        type: SettingsActionTypes.SET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale: newLocale,
          localeFormats: datesFormats[browserLocale.value],
        },
      });

      dispatch(getContent(newLocale.value, 'Audit-Cortex'));

      return true;
    } catch (err) {
      dispatch({ type: SettingsActionTypes.SET_USER_LOCALE_ERROR });
      dispatch(addGlobalError(err));

      return false;
    }
  };
}
