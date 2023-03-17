import React from 'react';
import { Box, Text, TextTypes, ProgressBar, ProgressBarTypes } from 'cortex-look-book';
import { WB_PROCESS_TYPE } from 'src/utils/workbooks.const';
import useTranslation from 'src/hooks/useTranslation';

const COMPONENT_NAME = 'PublishWorkbookProgress';

const PublishWorkbookProgress = ({ publishStatus, ...otherProps }) => {
  const { t } = useTranslation();

  const getProgress = () => {
    const status = publishStatus?.status;

    switch (status) {
      case WB_PROCESS_TYPE.TABLEMISMATCH:
        return {
          progress: 20,
          status: ProgressBarTypes.ERROR,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_TableMismatch'),
        };
      case WB_PROCESS_TYPE.ERROR:
        return {
          progress: 20,
          status: ProgressBarTypes.ERROR,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Error'),
        };
      case WB_PROCESS_TYPE.UPLOADING:
        return {
          progress: 20,
          status: ProgressBarTypes.WAITING,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Uploading'),
        };
      case WB_PROCESS_TYPE.VALIDATING:
        return {
          progress: 40,
          status: ProgressBarTypes.RUNNING,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Validating'),
        };
      case WB_PROCESS_TYPE.PUBLISHING:
        return {
          progress: 60,
          status: ProgressBarTypes.RUNNING,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Publishing'),
        };
      case WB_PROCESS_TYPE.SAVING:
        return {
          progress: 80,
          status: ProgressBarTypes.RUNNING,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Saving'),
        };
      case WB_PROCESS_TYPE.DONE:
        return {
          progress: 100,
          status: ProgressBarTypes.RUNNING,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Done'),
        };
      default:
        return {
          progress: 0,
          status: ProgressBarTypes.NOTSTARTED,
          header: t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Default'),
        };
    }
  };

  return (
    <Box {...otherProps}>
      <Text type={TextTypes.BODY} color='gray' mb={4}>
        {t('Pages_WorkpaperProcess_Step3_Publish_ProgressStatus_Title')}
      </Text>
      <ProgressBar {...getProgress()} dataInstance={COMPONENT_NAME} />
    </Box>
  );
};

export default PublishWorkbookProgress;
