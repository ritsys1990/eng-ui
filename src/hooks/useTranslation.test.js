import * as ReactHooks from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as ReactReduxHooks from 'react-redux';
import { Map as ImmutableMap } from 'immutable';
import useTranslation, { nameSpaces } from './useTranslation';
import { mockL10nContent } from '../utils/testUtils';
import fallback from '../languages/fallback.json';
import { testHook } from '../utils/testHook';

jest.mock('../languages/fallback.json', () => ({
  Engagement_Key_From_Fallback_Test: 'Translated value from fallback',
  // eslint-disable-next-line no-template-curly-in-string
  Engagement_Key_From_Fallback_Test_Placeholders: 'Translated value from fallback ${test1} ${test2} ${test3}',
}));

describe('Custom hook: useTranslation', () => {
  let state;
  let mockSetState;

  beforeEach(() => {
    state = configureStore([thunk])({
      settings: ImmutableMap({ content: mockL10nContent }),
    });

    mockSetState = jest.fn();
    jest.spyOn(ReactReduxHooks, 'useSelector').mockImplementation(cb => cb(state.getState()));
    jest.spyOn(ReactHooks, 'useState').mockImplementation(initial => [initial, mockSetState]);
  });

  const setup = (params = {}) => {
    let hook;
    testHook(() => {
      hook = useTranslation(params);
    });

    return hook;
  };

  it('should return translated value', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test';
    const value = mockL10nContent[`${nameSpaces.TRANSLATE_NAMESPACE_ENGAGEMENT}${key}`];

    const { t } = hook;
    const result = t(key);

    expect(result).toEqual(value);
  });

  it('should concat default prefix and return the translated value', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test';

    const { t } = hook;
    const result = t(key);

    expect(result).not.toBeUndefined();
  });

  it('should concat general prefix and return the translated value', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test';
    const value = mockL10nContent[`${nameSpaces.TRANSLATE_NAMESPACE_GENERAL}${key}`];

    const { t } = hook;
    const result = t(key, nameSpaces.TRANSLATE_NAMESPACE_GENERAL);

    expect(result).toEqual(value);
  });

  it('should return translated value from fallback when key is not defined', () => {
    const hook = setup();
    const key = 'Key_From_Fallback_Test'; // This key doesnt exits in the response content
    const value = fallback[`${nameSpaces.TRANSLATE_NAMESPACE_ENGAGEMENT}${key}`];

    const { t } = hook;
    const result = t(key);

    expect(result).toEqual(value);
  });

  it('should return translated value sanitized', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test_Sanitize'; // This key doesnt exits in the response content
    // eslint-disable-next-line no-template-curly-in-string
    const value = 'Translated value from response test1 test2 test3';

    const { t } = hook;
    const result = t(key);

    expect(result).toEqual(value);
  });

  it('exists should return true', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test_Sanitize';

    const { exists } = hook;
    const result = exists(key);

    expect(result).toEqual(true);
  });

  it('exists should return false', () => {
    const hook = setup();
    const key = 'Key_From_Response_Test_Sanitize_123';

    const { exists } = hook;
    const result = exists(key);

    expect(result).toEqual(false);
  });

  it('should return the original key if doesnt exists in the response or the fallback', () => {
    const hook = setup();
    const key = 'Key_From_Fallback_Test_123_ABC'; // This key doesnt exits in the response or the fallback

    const { t } = hook;
    const result = t(key);

    expect(result).toEqual(`${nameSpaces.TRANSLATE_NAMESPACE_ENGAGEMENT}${key}`);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
