import React from 'react';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/dateHelper';
import { settingsSelectors } from '../../store/settings/selectors';
import { useSelector } from 'react-redux';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const LocalizedDate = ({ date, customFormat, isTimeStamp = false }) => {
  const selectLocaleFormats = useSelector(settingsSelectors.selectLocaleFormats);
  const selectDefaultLocaleFormats = useSelector(settingsSelectors.selectDefaultLocaleFormats);
  const newDate = isTimeStamp ? date : dayjs.utc(date, 'DD/MM/YYYY');

  const formats = {
    timeStamp: isTimeStamp,
    custom: customFormat,
    formatedDate: selectLocaleFormats.date ? selectLocaleFormats.date : selectDefaultLocaleFormats.date,
    formatedTime: selectLocaleFormats.time ? selectLocaleFormats.time : selectDefaultLocaleFormats.time,
  };

  return <>{formatDate(newDate, formats)}</>;
};

export default LocalizedDate;
