import * as formatMessageHelper from '../formatMessageHelper';
import ServerError from '../serverError';

const mockExceptionMessage = 'Original exception message';

describe('ServerError: ', () => {
  const errorMessage = 'Translated error message';

  const bodyFromNetServices = {
    errors: [
      {
        localizationMetadata: {
          key: 'Some_Random_Key',
          values: { test1: 'test1' },
        },
        msg: mockExceptionMessage,
      },
    ],
  };

  const bodyFromNodeServices = {
    localizationMetadata: {
      key: 'Some_Random_Key',
      values: { test1: 'test1' },
    },
    error: mockExceptionMessage,
  };

  beforeEach(() => {
    jest.spyOn(formatMessageHelper, 'default').mockImplementation(() => errorMessage);
  });

  it('should return the translated error message from .Net services', () => {
    const result = new ServerError('', 500, bodyFromNetServices);

    expect(result.message).toEqual(errorMessage);
  });

  it('should return the original error message when the translated message is null from .Net services', () => {
    jest.spyOn(formatMessageHelper, 'default').mockImplementation(() => null);

    const result = new ServerError('', 500, bodyFromNetServices);
    expect(result.message).toEqual(mockExceptionMessage);
  });

  it('should return the translated error message from Node service', () => {
    const result = new ServerError('', 500, bodyFromNodeServices);

    expect(result.message).toEqual(errorMessage);
  });

  it('should return the original error message when the translated message is null from Node service', () => {
    jest.spyOn(formatMessageHelper, 'default').mockImplementation(() => null);

    const result = new ServerError('', 500, bodyFromNodeServices);
    expect(result.message).toEqual(mockExceptionMessage);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
