import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'cortex-look-book';
import { getDataRequestStatusDataByKey } from './utils/InputDataRequestStatus.utils';
import useTranslation from '../../../../hooks/useTranslation';

export const COMPONENT_NAME = 'InputDataRequestProgress';

export const InputDataRequestStatusProgress = props => {
  const { t } = useTranslation();
  const { dataRequestStatus } = props;

  return (
    <Tag
      dataInstance={COMPONENT_NAME}
      type={getDataRequestStatusDataByKey(dataRequestStatus, 'statusType')}
      progress={getDataRequestStatusDataByKey(dataRequestStatus, 'progress')}
    >
      {t('Pages_WorkpaperProcess_Step1_Table_Connected_To_Data_Request')}
    </Tag>
  );
};

InputDataRequestStatusProgress.propTypes = {
  dataRequestStatus: PropTypes.object,
};

InputDataRequestStatusProgress.defaultProps = {
  dataRequestStatus: '',
};
