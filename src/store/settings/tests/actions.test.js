import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import localizationService from '../../../services/localization.service';
import { getContent, getLocale, setLocale } from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { SettingsActionTypes } from '../actionTypes';
import { mockL10nContent, userLocale, supportedLocales, newUserLocale } from '../../../utils/testUtils';
import ServerError from '../../../utils/serverError';
import { ErrorActionTypes } from '../../errors/actionTypes';
import * as locale from '../../../utils/localization.const';
import fallback from '../../../languages/fallback.json';
import { datesFormats } from '../../../utils/formats.const';
import { keyExist, getValue } from '../../../utils/localStorageHelper';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
    content: {},
  }),
});

const mockErrorMessage = 'Test message error';
const mockLocaleText = 'English (United States)';

describe('Settings actions: ', () => {
  let localStorageMock = {};
  const lang = 'en-US';
  const cacheKey = `${locale.LOCALIZATION_CACHE_KEY}.${lang}`;

  beforeAll(() => {
    window.scrollTo = jest.fn();

    global.Storage.prototype.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn(key => localStorageMock[key]);
  });

  beforeEach(() => {
    mockStore.clearActions();
    localStorageMock = {};
  });

  it('getContent should return the translation content from the response', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localizationService.getContent = jest.fn().mockImplementation(() => {
      return { Values: mockL10nContent };
    });

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
    expect(global.Storage.prototype.setItem).toHaveBeenCalledTimes(1);
  });

  it('getContent should return the translation content from the cache', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_CACHED_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localStorageMock = { [cacheKey]: JSON.stringify(mockL10nContent) };

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
    expect(global.Storage.prototype.getItem).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getContent with server errors (500)', async () => {
    const expectedError = new ServerError(mockErrorMessage);

    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK,
        payload: { content: fallback, err: expectedError },
      },
      { type: SettingsActionTypes.GET_CONTENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: { ...expectedError, message: fallback['Engagement_Pages_Fallback_Error_Message'] },
      },
    ];

    localizationService.getContent = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getContent with server errors (404 and content from the body)', async () => {
    const expectedError = new ServerError(mockErrorMessage, 404, { values: mockL10nContent });

    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK,
        payload: { content: mockL10nContent, err: expectedError },
      },
      { type: SettingsActionTypes.GET_CONTENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: { ...expectedError, message: fallback['Engagement_Pages_Fallback_Error_Message'] },
      },
    ];

    localizationService.getContent = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getContent with server errors (404 and non content from the body)', async () => {
    const expectedError = new ServerError(mockErrorMessage, 404, { values: {} }); // Body is null or values field is null

    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK,
        payload: { content: fallback, err: expectedError },
      },
      { type: SettingsActionTypes.GET_CONTENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: { ...expectedError, message: fallback['Engagement_Pages_Fallback_Error_Message'] },
      },
    ];

    localizationService.getContent = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getContent with server errors (404 and body null)', async () => {
    const expectedError = new ServerError(mockErrorMessage, 404); // Body is null or values field is null

    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK,
        payload: { content: fallback, err: expectedError },
      },
      { type: SettingsActionTypes.GET_CONTENT_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: { ...expectedError, message: fallback['Engagement_Pages_Fallback_Error_Message'] },
      },
    ];

    localizationService.getContent = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getLocale should return the locale', async () => {
    const mappedSupportedLocales = supportedLocales.map(s => ({
      value: s.localeCode,
      text: s.language,
    }));

    const expectedActions = [
      { type: SettingsActionTypes.GET_USER_LOCALE_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale: { value: 'en-US', text: mockLocaleText },
          mappedSupportedLocales,
          localeFormats: datesFormats[userLocale.preferredLanguage],
        },
      },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localizationService.getUserLocale = jest.fn().mockImplementation(() => {
      return userLocale;
    });
    localizationService.getSupportedLocales = jest.fn().mockImplementation(() => {
      return supportedLocales;
    });
    localizationService.getContent = jest.fn().mockImplementation(() => {
      return { Values: mockL10nContent };
    });

    await mockStore.dispatch(getLocale(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getLocale should return default user locale (English)', async () => {
    const mappedSupportedLocales = supportedLocales.map(s => ({
      value: s.localeCode,
      text: s.language,
    }));

    const expectedActions = [
      { type: SettingsActionTypes.GET_USER_LOCALE_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale: { value: 'en-US', text: mockLocaleText },
          mappedSupportedLocales,
          localeFormats: datesFormats[userLocale.preferredLanguage],
        },
      },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localizationService.getUserLocale = jest.fn().mockImplementation(() => {
      return { ...userLocale, preferredLanguage: 'test-Test' }; // Unknow language code
    });
    localizationService.getSupportedLocales = jest.fn().mockImplementation(() => {
      return supportedLocales;
    });
    localizationService.getContent = jest.fn().mockImplementation(() => {
      return { Values: mockL10nContent };
    });

    await mockStore.dispatch(getLocale(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getLocale should return default user locale (English) when user preference or supported locales are empty', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.GET_USER_LOCALE_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      {
        type: SettingsActionTypes.GET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale: { value: 'en-US', text: mockLocaleText },
          mappedSupportedLocales: null,
          localeFormats: datesFormats['en-US'],
        },
      },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localizationService.getUserLocale = jest.fn().mockImplementation(() => {
      return null; // Unknow language code
    });
    localizationService.getSupportedLocales = jest.fn().mockImplementation(() => {
      return null;
    });
    localizationService.getContent = jest.fn().mockImplementation(() => {
      return { Values: mockL10nContent };
    });

    await mockStore.dispatch(getLocale(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('getLocale with server errors', async () => {
    const expectedError = new ServerError(mockErrorMessage);

    const expectedActions = [
      { type: SettingsActionTypes.GET_USER_LOCALE_REQUEST },
      { type: SettingsActionTypes.GET_USER_LOCALE_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];

    localizationService.getUserLocale = jest.fn().mockImplementation(() => {
      throw expectedError; // Unknow language code
    });

    await mockStore.dispatch(getLocale(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('setLocale should set the new locale value', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.SET_USER_LOCALE_REQUEST },
      {
        type: SettingsActionTypes.SET_USER_LOCALE_SUCCESS,
        payload: {
          userLocale: newUserLocale,
          localeFormats: datesFormats['en-US'],
        },
      },
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localizationService.setUserLocale = jest.fn().mockImplementation(() => {
      return newUserLocale;
    });
    localizationService.getContent = jest.fn().mockImplementation(() => {
      return { Values: mockL10nContent };
    });

    await mockStore.dispatch(setLocale(newUserLocale));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('setLocale with server errors', async () => {
    const expectedError = new ServerError(mockErrorMessage);

    const expectedActions = [
      { type: SettingsActionTypes.SET_USER_LOCALE_REQUEST },
      { type: SettingsActionTypes.SET_USER_LOCALE_ERROR },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: expectedError,
      },
    ];

    localizationService.setUserLocale = jest.fn().mockImplementation(() => {
      throw expectedError;
    });

    await mockStore.dispatch(setLocale(newUserLocale));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('localStorageHelper check if content is getting cached', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload: { content: mockL10nContent } },
    ];

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
    expect(global.Storage.prototype.setItem).toHaveBeenCalledTimes(1);
    expect(keyExist(cacheKey)).toEqual(true);
  });

  it('localStorageHelper check if cached content exists and can be obtained', async () => {
    const expectedActions = [
      { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST },
      { type: SettingsActionTypes.GET_LOCALIZATION_CACHED_SUCCESS, payload: { content: mockL10nContent } },
    ];

    localStorageMock = { [cacheKey]: JSON.stringify(mockL10nContent) };

    await mockStore.dispatch(getContent(lang, 'Cortex'));
    expect(mockStore.getActions()).toEqual(expectedActions);
    expect(global.Storage.prototype.getItem).toHaveBeenCalledTimes(2);
    expect(JSON.parse(getValue(cacheKey))).toEqual(mockL10nContent);
    expect(keyExist(cacheKey)).toEqual(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.Storage.prototype.setItem.mockReset();
    global.Storage.prototype.getItem.mockReset();
  });
});
