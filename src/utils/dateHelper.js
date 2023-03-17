import dayjs from 'dayjs';
import { localeLanguages } from './formats.const';
import { getBrowserLocale } from './localeHelper';

const daysInMonth = (month, year = dayjs().year()) => {
  switch (month) {
    // February
    case 2:
      return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
    // April, June, September, November
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
};
export const isValidDate = (day = 1, month, year) =>
  month > 0 && month <= 12 && day > 0 && day <= daysInMonth(month, year);

export const toDateFormat = (date, separator = '/') => {
  return new Date(date)
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .split('/')
    .join(separator);
};

export const formatDate = (date, formats) => {
  const language = getBrowserLocale(localeLanguages);
  let dateTimeFormat;
  const dateFormat = formats.formatedDate;

  if (formats.custom) {
    dateTimeFormat = formats.custom;
  } else if (formats.timeStamp) {
    dateTimeFormat = `${dateFormat.toUpperCase()} ${formats.formatedTime}`;
  } else {
    dateTimeFormat = `${dateFormat.toUpperCase()}`;
  }

  const formatedDate = new Date(date);

  if (formats.formatedTime !== undefined) {
    return dayjs(date).format(dateTimeFormat);
  }
  if (formats.timeStamp) {
    return formatedDate.toLocaleString(language.value);
  }

  return formatedDate.toLocaleDateString(language.value);
};
