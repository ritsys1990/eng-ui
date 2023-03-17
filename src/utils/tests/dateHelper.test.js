import { formatDate, isValidDate } from '../dateHelper';

const initialFormat = {
  initialValue: 'Tue Apr 06 2021 08:35:12 GMT-0600',
};

const dateTimeFormats = {
  timeStamp: true,
  custom: null,
  formatedDate: 'YYYY/M/D',
  formatedTime: 'H:mm:ss',
};

const customFormat = {
  timeStamp: true,
  custom: 'D/M H:mm',
  formatedDate: 'YYYY/M/D',
  formatedTime: 'H:mm:ss',
};

const noTimeStampFormat = {
  timeStamp: false,
  custom: null,
  formatedDate: 'D/M',
  formatedTime: 'H:mm:ss',
};

const noTimeFormat = {
  timeStamp: true,
  custom: null,
  formatedDate: 'D/M/YYYY',
};

const onlyDateFormat = {
  timeStamp: false,
  custom: null,
  formatedDate: 'yyyy-MM-dd',
  formatedTime: 'H:mm:ss',
};

const formatsTime1 = {
  timeStamp: false,
  custom: '',
  formatedDate: '',
  formatedTime: undefined,
};

const formatsLower = {
  timeStamp: true,
  custom: null,
  formatedDate: 'yyyy-MM-dd',
  formatedTime: 'H:mm:ss a',
};

describe('DateHelper', () => {
  it('date formated', () => {
    expect(formatDate(initialFormat.initialValue, dateTimeFormats)).toBe('2021/4/6 8:35:12');
  });

  it.only('no date with formats', () => {
    expect(formatDate('', dateTimeFormats)).toBe('Invalid Date');
  });

  it('date with custom format', () => {
    expect(formatDate(initialFormat.initialValue, customFormat)).toBe('6/4 8:35');
  });

  it('date without timeStamp', () => {
    expect(formatDate(initialFormat.initialValue, noTimeStampFormat)).toBe('6/4');
  });

  it('date timeStamp without time format', () => {
    expect(formatDate(initialFormat.initialValue, noTimeFormat)).toBe('4/6/2021, 8:35:12 AM');
  });

  it('date timeStamp lower am', () => {
    expect(formatDate(initialFormat.initialValue, formatsLower)).toBe('2021-04-06 8:35:12 am');
  });

  it('date with no time', () => {
    expect(formatDate('2021-10-08', onlyDateFormat)).toBe('2021-10-08');
  });

  it('date notimeStamp', () => {
    expect(formatDate('2021-04-06T19:11:01.249Z', formatsTime1)).toBe('4/6/2021');
  });

  it.only('date isValidDate', () => {
    expect(isValidDate(13, 18, 2021)).toBe(false);
  });

  it.only('date isValidDate true', () => {
    expect(isValidDate(13, 11, 2021)).toBe(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
