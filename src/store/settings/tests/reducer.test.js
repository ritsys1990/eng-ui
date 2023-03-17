import reducer, { initialState } from '../reducer';
import { SettingsActionTypes } from '../actionTypes';
import fallback from '../../../languages/fallback.json';
import { datesFormats } from '../../../utils/formats.const';
import { mockL10nContent, userLocale, supportedLocales } from '../../../utils/testUtils';

describe('Settings reducer: ', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('get user localer', () => {
    const expectedState = initialState.merge({
      fetchingUserLocale: true,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_USER_LOCALE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get user locale success', () => {
    const payload = {
      userLocale,
      localeFormats: datesFormats['en-US'],
      mappedSupportedLocales: supportedLocales.map(s => ({
        value: s.localeCode,
        text: s.language,
      })),
    };

    const expectedState = initialState.merge({
      fetchingUserLocale: false,
      locale: payload.userLocale,
      localeFormats: payload.localeFormats,
      fetchingUserLocaleError: false,
      supportedLocales: payload.mappedSupportedLocales,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_USER_LOCALE_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('get user locale error', () => {
    const expectedState = initialState.merge({
      fetchingUserLocale: false,
      fetchingUserLocaleError: true,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_USER_LOCALE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('set user locale request', () => {
    const expectedState = initialState.merge({
      fetchingSetUserLocale: true,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.SET_USER_LOCALE_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('set user locale success', () => {
    const payload = {
      userLocale,
      localeFormats: datesFormats['en-US'],
    };

    const expectedState = initialState.merge({
      fetchingSetUserLocale: false,
      locale: payload.userLocale,
      localeFormats: payload.localeFormats,
      fetchingSetUserLocaleError: false,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.SET_USER_LOCALE_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('set user locale error', () => {
    const expectedState = initialState.merge({
      fetchingSetUserLocale: false,
      fetchingSetUserLocaleError: true,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.SET_USER_LOCALE_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get localization request', () => {
    const expectedState = initialState.merge({
      fetchingLocalization: true,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_LOCALIZATION_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get localization cached success', () => {
    const payload = {
      content: mockL10nContent,
    };

    const expectedState = initialState.merge({
      fetchingLocalization: false,
      content: payload.content,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_LOCALIZATION_CACHED_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('get localization success', () => {
    const payload = {
      content: mockL10nContent,
    };

    const expectedState = initialState.merge({
      fetchingLocalization: false,
      content: payload.content,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_LOCALIZATION_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('get localization error fallback', () => {
    const payload = {
      content: fallback,
    };

    const expectedState = initialState.merge({
      fetchingLocalization: false,
      fetchingLocalizationError: true,
      content: payload.content,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.GET_LOCALIZATION_ERROR_FALLBACK, payload });
    expect(state).toEqual(expectedState);
  });

  it('set locales', () => {
    const payload = userLocale;

    const expectedState = initialState.merge({
      localeFormats: payload,
    });

    const state = reducer(initialState, { type: SettingsActionTypes.SET_LOCALE, payload });
    expect(state).toEqual(expectedState);
  });
});
