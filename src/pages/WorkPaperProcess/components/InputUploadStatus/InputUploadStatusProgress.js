import React from 'react';
import { Button, ButtonTypes, IconTypes, Tag, Text } from 'cortex-look-book';
import { inputStatusProgressDataByKey } from '../../utils/WorkPaperProcess.utils';
import { useSelector } from 'react-redux';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { COMPONENT_NAME } from '../../constants/WorkPaperProcess.const';
import useTranslation from 'src/hooks/useTranslation';

export const InputUploadStatusProgress = props => {
  const { t } = useTranslation();
  const { inputStatusData, inputName, currentInput, isAnyInputProcessing } = props;
  const currentInputStatusError = currentInput ? inputStatusData.error : null;
  const currentInputStatus = currentInput ? inputStatusData.status : 'done';
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);

  return inputName ? (
    <Text>
      <Tag
        type={inputStatusProgressDataByKey(currentInputStatus, 'type', currentInputStatusError)}
        progress={inputStatusProgressDataByKey(currentInputStatus, 'progress')}
      >
        {inputName}
      </Tag>
    </Text>
  ) : (
    <Button
      disabled={isAnyInputProcessing || readOnlyfromWP}
      type={ButtonTypes.LINK}
      icon={IconTypes.PLUS}
      onClick={props.setIsUploaderShown}
      dataInstance={COMPONENT_NAME}
    >
      {t('Pages_WorkpaperProcess_Step1_Table_AttachSourceFile')}
    </Button>
  );
};
