import { saveValue, getValue, keyExist } from '../localStorageHelper';
import * as locale from '../localization.const';

describe('Local storage helper', () => {
  let mockGetItem;
  let mockSetItem;
  let mockClear;
  let mockRemoveItem;

  beforeEach(() => {
    mockGetItem = jest.fn();
    mockSetItem = jest.fn();
    mockClear = jest.fn();
    mockRemoveItem = jest.fn();

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'setItem').mockImplementation(mockSetItem);
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockImplementation(mockGetItem);
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'clear').mockImplementation(mockClear);
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'removeItem').mockImplementation(mockRemoveItem);
  });

  it('set value', () => {
    const key = locale.LOCALIZATION_APP_NAME;
    const value = 'test 1';
    saveValue(key, value);
    expect(mockSetItem).toHaveBeenCalledWith(key, value);
  });

  it('get value', () => {
    const key = locale.LOCALIZATION_APP_NAME;
    getValue(key);
    expect(mockGetItem).toHaveBeenCalledWith(key);
  });

  it('key exist', () => {
    const key = locale.LOCALIZATION_APP_NAME;
    keyExist(key);
    expect(mockGetItem).toHaveBeenCalledWith(key);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
