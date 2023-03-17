import React from 'react';
import { Box, Button, ButtonTypes, Text, TextTypes } from 'cortex-look-book';

const VALIDATE_TRANSLATE_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_Validate';

export const generateValidateAlertMessage = (t, hasErrors, downloadCallback) => {
  if (!hasErrors) {
    return (
      <Box>
        <Text type={TextTypes.H3} fontWeight='m' mb={4}>
          {t(`${VALIDATE_TRANSLATE_KEY}_NoErrorsTitle`)}
        </Text>
        <Text type={TextTypes.BODY}>{t(`${VALIDATE_TRANSLATE_KEY}_NoErrorsDescription`)}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text type={TextTypes.Body} fontWeight='m' mb={5}>
        {t(`${VALIDATE_TRANSLATE_KEY}_ErrorsTitle`)}
      </Text>
      <Text type={TextTypes.BODY} mb={1}>
        {t(`${VALIDATE_TRANSLATE_KEY}_ErrorsDescription`)}
      </Text>
      {downloadCallback && (
        <Text>
          <Button
            type={ButtonTypes.LINK}
            display='inline-block'
            mr={3}
            onClick={downloadCallback}
            dataInstance='DownloadValidation'
          >
            {t(`${VALIDATE_TRANSLATE_KEY}_ErrorsDownload`)}
          </Button>
          {t(`${VALIDATE_TRANSLATE_KEY}_ErrorsInstructions`)}
        </Text>
      )}
    </Box>
  );
};
