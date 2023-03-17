import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { Map as ImmutableMap } from 'immutable';
import { mockL10nContent } from '../testUtils';
import getLocalizedErrorMessage, { formatString } from '../formatMessageHelper';
import store from '../../store';

jest.mock('../../languages/fallback.json', () => ({
  Engagement_Key_From_Fallback_Test: 'Translated value from fallback',
  // eslint-disable-next-line no-template-curly-in-string
  Engagement_Key_From_Fallback_Test_Placeholders: 'Translated value from fallback ${test1} ${test2} ${test3}',
}));

describe('formatMessageHelper: ', () => {
  let state;
  // eslint-disable-next-line no-template-curly-in-string
  const template = 'This is template sample for the farmatting: ${a} ${b} ${c}';
  const placeholder = { a: 'unit', b: 'test', c: 'jest' };

  const metadata = {
    key: 'Engagement_Key_From_Response_Test_Sanitize',
    values: { test1: 'test1', test2: 'test2', test3: 'test3' },
  };

  beforeEach(() => {
    state = configureStore([thunk])({
      settings: ImmutableMap({ content: mockL10nContent }),
    });

    store.getState = () => state.getState();
  });

  it('formatString should replace the plaholders when the values from the metadata are correct', () => {
    const result = formatString(template, placeholder);

    expect(result).toEqual('This is template sample for the farmatting: unit test jest');
  });

  it('formatString should return plaeholder names when the values does not match', () => {
    const result = formatString(template, { aa: 'unit', bb: 'test', cc: 'jest' });

    // eslint-disable-next-line no-template-curly-in-string
    expect(result).toEqual('This is template sample for the farmatting: ${a} ${b} ${c}');
  });

  it('getLocalizedErrorMessage should format the message when the metadata exists', () => {
    const result = getLocalizedErrorMessage(metadata);

    expect(result).toEqual('Translated value from response test1 test2 test3');
  });

  it('getLocalizedErrorMessage should format the message from the fallback when the content is null', () => {
    const result = getLocalizedErrorMessage({ ...metadata, key: 'Engagement_Key_From_Fallback_Test_Placeholders' });
    store.getState = () => null;

    expect(result).toEqual('Translated value from fallback test1 test2 test3');
  });

  it('getLocalizedErrorMessage should format the message from the fallback when key does not exists', () => {
    const result = getLocalizedErrorMessage({ ...metadata, key: 'Engagement_Key_From_Fallback_Test_Placeholders' });

    expect(result).toEqual('Translated value from fallback test1 test2 test3');
  });

  it('getLocalizedErrorMessage should return null when the key does not exisist in content and callback', () => {
    const result = getLocalizedErrorMessage({ ...metadata, key: 'some_random_key' });

    expect(result).toEqual(null);
  });

  it('getLocalizedErrorMessage should return null when metadata is null', () => {
    const result = getLocalizedErrorMessage(null);

    expect(result).toEqual(null);
  });

  it('getLocalizedErrorMessage should return null when metadata is empty', () => {
    const result = getLocalizedErrorMessage({});

    expect(result).toEqual(null);
  });

  it('getLocalizedErrorMessage should return null when key is null', () => {
    const result = getLocalizedErrorMessage({ ...metadata, key: null });

    expect(result).toEqual(null);
  });

  it('getLocalizedErrorMessage should return null when key is empty', () => {
    const result = getLocalizedErrorMessage({ ...metadata, key: '' });

    expect(result).toEqual(null);
  });

  it('getLocalizedErrorMessage should return the template when the placeholders are null', () => {
    const result = getLocalizedErrorMessage({ ...metadata, values: null });

    // eslint-disable-next-line no-template-curly-in-string
    expect(result).toEqual('Translated value from response ${test1} ${test2} ${test3}');
  });

  it('getLocalizedErrorMessage should return the template when the placeholders are empty', () => {
    const result = getLocalizedErrorMessage({ ...metadata, values: {} });

    // eslint-disable-next-line no-template-curly-in-string
    expect(result).toEqual('Translated value from response ${test1} ${test2} ${test3}');
  });

  it('getLocalizedErrorMessage throws an exception', () => {
    store.getState = jest.fn().mockImplementation(() => {
      throw new Error('some exception error');
    });

    expect(() => {
      getLocalizedErrorMessage(metadata);
    }).toThrow(Error);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
