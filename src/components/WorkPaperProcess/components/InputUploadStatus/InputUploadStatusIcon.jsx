import React, { useContext } from 'react';
import { Icon, IconTypes, Intent } from 'cortex-look-book';
import { WP_PROCESS_INPUT_STATUS, WP_INPUT_CENTRALIZED_DATA_STATUS } from '../../constants/WorkPaperProcess.const';
import { inputIconColorByStatus } from '../../utils/WorkPaperProcess.utils';
import { ThemeContext } from 'styled-components';
import {
  isInputConnectedToDataRequest,
  getDataRequestStatusDataByKey,
  getDataRequestStatus,
} from '../InputDataRequestStatus/utils/InputDataRequestStatus.utils';

export const COMPONENT_NAME = 'INPUT-UPLOAD-STATUS-ICON';

export const InputUploadStatusIcon = props => {
  const { inputStatusData, workpaperType } = props;
  const currentInputStatusError = inputStatusData.error;
  const currentInputStatus = inputStatusData.status;
  const theme = useContext(ThemeContext);
  let dataRequestStatusType = null;
  const isDataRequest = isInputConnectedToDataRequest(inputStatusData);
  if (isDataRequest) {
    dataRequestStatusType = getDataRequestStatusDataByKey(getDataRequestStatus(inputStatusData), 'statusType');
  }

  const iconProps = () => {
    if (
      (inputStatusData?.centralizedData &&
        inputStatusData.centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.ERROR) ||
      dataRequestStatusType === Intent.INFO
    ) {
      return { height: 25, width: 25, type: IconTypes.MINUS_CIRCLE };
    }
    if (currentInputStatus === WP_PROCESS_INPUT_STATUS.DONE || dataRequestStatusType === Intent.SUCCESS) {
      return { height: 25, width: 25, type: IconTypes.CIRCLE_CHECKMARK };
    }

    return { height: 25, width: 25, type: IconTypes.MINUS_CIRCLE };
  };

  return (
    <Icon
      {...iconProps()}
      color={inputIconColorByStatus(currentInputStatus, theme, {
        error: currentInputStatusError,
        trifactaStatus: inputStatusData.trifactaStatus,
        trifactaInputId: inputStatusData.trifactaInputId,
        workpaperType,
        fileUrl: inputStatusData?.file?.url,
        centralizedData: inputStatusData?.centralizedData,
        isDataRequest,
        dataRequestStatusType,
      })}
      display='flex'
      alignItems='center'
      justifyContent='center'
      dataInstance={COMPONENT_NAME}
    />
  );
};
