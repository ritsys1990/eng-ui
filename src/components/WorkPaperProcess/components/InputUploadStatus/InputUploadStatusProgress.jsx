import React from 'react';
import { Button, ButtonTypes, IconTypes, Tag, Text } from 'cortex-look-book';
import { inputStatusProgressDataByKey } from '../../utils/WorkPaperProcess.utils';
import { WP_PROCESS_INPUT_STATUS, TRIFACTA_WP_PROCESS_INPUT_STATUS } from '../../constants/WorkPaperProcess.const';
import { useSelector } from 'react-redux';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import useTranslation from '../../../../hooks/useTranslation';

export const COMPONENT_NAME = 'INPUT-UPLOAD-STATUS-PROGRESS';

export const InputUploadStatusProgress = props => {
  const { inputStatusData, inputName, currentInput, isAnyInputProcessing, workpaperType, lastFile } = props;
  const currentInputStatusError = currentInput ? inputStatusData.error : null;
  const currentInputStatus = currentInput ? inputStatusData.status : WP_PROCESS_INPUT_STATUS.DONE;
  const { t } = useTranslation();
  let readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const disableButtonOnTrifactaFail =
    (!inputStatusData.trifactaInputId ||
      inputStatusData.trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS) &&
    inputStatusData?.file?.url;

  readOnlyfromWP = !readOnlyfromWP ? useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted) : readOnlyfromWP;

  return inputName ? (
    <Text>
      <Tag
        type={inputStatusProgressDataByKey(
          currentInputStatus,
          'type',
          currentInputStatusError,
          inputStatusData.trifactaStatus,
          inputStatusData.trifactaInputId,
          workpaperType,
          lastFile,
          inputStatusData?.file?.url,
          inputStatusData?.centralizedData
        )}
        progress={inputStatusProgressDataByKey(
          currentInputStatus,
          'progress',
          '',
          inputStatusData.trifactaStatus,
          inputStatusData.trifactaInputId,
          workpaperType,
          lastFile,
          inputStatusData?.file?.url,
          inputStatusData?.centralizedData
        )}
      >
        {inputName}
      </Tag>
    </Text>
  ) : (
    <Button
      disabled={isAnyInputProcessing || readOnlyfromWP || disableButtonOnTrifactaFail}
      type={ButtonTypes.LINK}
      icon={IconTypes.PLUS}
      onClick={props.setIsUploaderShown}
      dataInstance={COMPONENT_NAME}
    >
      {inputStatusData?.file
        ? t('Pages_WorkpaperProcess_Step1_Table_AttachSourceFile')
        : t('Pages_WorkpaperProcess_Step1_Table_AddSourceFile')}
    </Button>
  );
};
