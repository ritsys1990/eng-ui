import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Alert, AlertTypes } from 'cortex-look-book';

dayjs.extend(utc);
const COMPONENT_NAME = 'MaintenanceBanner';

const MaintenanceBanner = props => {
  let alertText = '';
  const { alert } = props;
  const [countDown, setCountDown] = useState('');

  const currentTime = new Date();
  const endTime = new Date(alert.endDate);
  const diffTime = endTime - currentTime;
  const duration = dayjs.utc(diffTime).format('HH:mm:ss');

  useEffect(() => {
    if (countDown === '00:00:00' || diffTime < 0) {
      setCountDown('00:00:00');
    } else {
      setTimeout(() => {
        setCountDown(duration);
      }, 1000);
    }
  }, [duration, countDown]);

  alertText = `${alert.text} ${countDown}`;

  return (
    <>
      {' '}
      {alert.id && countDown !== '00:00:00' && (
        <Alert type={AlertTypes.ERROR} dataInstance={COMPONENT_NAME} message={alertText} />
      )}{' '}
    </>
  );
};

export default MaintenanceBanner;
