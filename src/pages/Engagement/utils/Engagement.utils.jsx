import React from 'react';
import { Box, Button, ButtonTypes, Text, TextTypes } from 'cortex-look-book';

const ENGAGEMENT_ALERT_TRANSLATE_KEY = 'Pages_EngagementWorkpapers_File_Path_Error';

const serialNumber = { one: '1.', two: '2.' };

export const generateFilePathAlertMessage = (t, retryCallback, downloadCallback) => {
  return (
    <Box>
      <Text type={TextTypes.BODY} mb={1}>
        {t(`${ENGAGEMENT_ALERT_TRANSLATE_KEY}_Description`)}
      </Text>
      <br />
      <Text type={TextTypes.BODY} mb={1}>
        {serialNumber.one}
        {retryCallback && (
          <Button
            type={ButtonTypes.LINK}
            display='inline-block'
            mr={3}
            onClick={retryCallback}
            dataInstance='RetryDownloadValidation'
          >
            &nbsp; {t(`${ENGAGEMENT_ALERT_TRANSLATE_KEY}_Click_Here`)}
          </Button>
        )}
        {t(`${ENGAGEMENT_ALERT_TRANSLATE_KEY}_Fix_File_Path`)}
      </Text>
      <Text type={TextTypes.BODY} mb={1}>
        {serialNumber.two} &nbsp;{t(`${ENGAGEMENT_ALERT_TRANSLATE_KEY}_Download_Log_Details`)}
        {downloadCallback && (
          <Button
            type={ButtonTypes.LINK}
            display='inline-block'
            mr={3}
            onClick={downloadCallback}
            dataInstance='ErrorLogsDownloadValidation'
          >
            &nbsp;{t(`${ENGAGEMENT_ALERT_TRANSLATE_KEY}_Here`)}
          </Button>
        )}
      </Text>
    </Box>
  );
};
