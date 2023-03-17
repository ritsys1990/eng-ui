import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link, Flex, Text } from 'cortex-look-book';
import { useSelector } from 'react-redux';
import env from 'env';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import {
  getDataRequestStatusTranslationKey,
  getDataRequestStatusType,
  isDataRequestNotSubmitted,
} from './utils/InputDataRequestStatus.utils';
import useTranslation from '../../../../hooks/useTranslation';
import { DATA_REQUEST_STATUS } from './constants/InputDataRequestStatus.const';
import { inputStatusColorByStatus } from '../../utils/WorkPaperProcess.utils';
import { ThemeContext } from 'styled-components';

export const COMPONENT_NAME = 'InputDataRequestStatusText';

export const InputDataRequestStatusText = props => {
  const { dataRequestStatus, dataRequestId } = props;
  const { t } = useTranslation();
  const engagementId = useSelector(engagementSelectors.selectEngagement)?.id;
  const theme = useContext(ThemeContext);

  let combinedStatuses = null;
  if (dataRequestStatus) {
    combinedStatuses = Object.keys(dataRequestStatus).map((status, index) => {
      const dataRequestStatusType = getDataRequestStatusType(status);

      return (
        <Flex pr={2} key={index}>
          <Text
            color={inputStatusColorByStatus(status, theme, { isDataRequest: true, dataRequestStatusType })}
            dataInstance={`${COMPONENT_NAME}-StatusText`}
          >
            {t(getDataRequestStatusTranslationKey(status))}
            {dataRequestStatus[status] !== null && ` (${dataRequestStatus[status]})`}
          </Text>
          {index !== Object.keys(dataRequestStatus).length - 1 && (
            <Text dataInstance={`${COMPONENT_NAME}-CommaText`}>, </Text>
          )}
        </Flex>
      );
    });
  }

  return (
    <Flex dataInstance={COMPONENT_NAME} flexWrap='wrap'>
      {t('Pages_WorkpaperProcess_Step1_Table_Data_Request_Text')}&nbsp;{combinedStatuses}
      {(isDataRequestNotSubmitted(dataRequestStatus) || DATA_REQUEST_STATUS.DRAFT in dataRequestStatus) && (
        <Link
          to={`${env.EXTRACTIONUI_URL}/engagement/${engagementId}/edit-data-request/${dataRequestId}`}
          external
          target='_blank'
          dataInstance={`${COMPONENT_NAME}-ReviewAndSubmitLink`}
        >
          <Text> {t('Pages_WorkpaperProcess_Step1_Table_Data_Request_Review_And_Submit')}</Text>
        </Link>
      )}
    </Flex>
  );
};

InputDataRequestStatusText.propTypes = {
  dataRequestStatus: PropTypes.object,
  dataRequestId: PropTypes.string,
};

InputDataRequestStatusText.defaultProps = {
  dataRequestStatus: {},
  dataRequestId: '',
};
