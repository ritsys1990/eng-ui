import { getBrowserLocale } from '../localeHelper';
import { localeLanguages } from '../formats.const';

describe('Browser locale', () => {
  beforeEach(() => {
    Object.defineProperty(global.navigator, 'language', { value: 'en-US', configurable: true });
  });

  it('locale valid', () => {
    expect(getBrowserLocale(localeLanguages)).toStrictEqual({ text: 'English (United States)', value: 'en-US' });
  });

  it('with no localeLanguages', () => {
    expect(getBrowserLocale()).toStrictEqual({ value: 'en-US', text: `English (United States)` });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
