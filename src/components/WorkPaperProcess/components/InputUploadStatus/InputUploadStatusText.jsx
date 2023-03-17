import React, { useContext } from 'react';
import { Text } from 'cortex-look-book';
import { inputStatusColorByStatus, showStatusTextByStatus } from '../../utils/WorkPaperProcess.utils';
import { WP_PROCESS_INPUT_STATUS, TRIFACTA_WP_PROCESS_INPUT_STATUS } from '../../constants/WorkPaperProcess.const';
import { ThemeContext } from 'styled-components';
import useTranslation from '../../../../hooks/useTranslation';

export const COMPONENT_NAME = 'INPUT-UPLOAD-STATUS-TEXT';

export const InputUploadStatusText = props => {
  const { t } = useTranslation();

  const theme = useContext(ThemeContext);
  const { inputStatusData, currentInput, workpaperType, lastFile, centralizedData } = props;
  const currentInputStatusError = currentInput ? inputStatusData.error : null;
  const currentInputStatus = currentInput ? inputStatusData.status : WP_PROCESS_INPUT_STATUS.DONE;
  const showStatusOnTrifactaFail =
    (!inputStatusData.trifactaInputId ||
      inputStatusData.trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS) &&
    inputStatusData?.file?.url;

  return !showStatusOnTrifactaFail && !currentInputStatus && !currentInputStatusError && !centralizedData ? null : (
    <Text
      color={inputStatusColorByStatus(currentInputStatus, theme, {
        error: currentInputStatusError,
        trifactaStatus: inputStatusData.trifactaStatus,
        trifactaInputId: inputStatusData.trifactaInputId,
        workpaperType,
        lastFile,
        fileUrl: inputStatusData?.file?.url,
        centralizedData: inputStatusData?.centralizedData,
      })}
      dataInstance={COMPONENT_NAME}
    >
      {t(
        showStatusTextByStatus(
          currentInputStatus,
          currentInputStatusError,
          inputStatusData.trifactaStatus,
          inputStatusData.trifactaInputId,
          workpaperType,
          lastFile,
          inputStatusData?.file?.url,
          inputStatusData?.centralizedData
        )
      )}
    </Text>
  );
};
