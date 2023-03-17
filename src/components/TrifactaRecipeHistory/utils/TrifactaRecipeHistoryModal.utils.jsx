import React from 'react';
import { Box, Button, ButtonTypes, Text, TextTypes } from 'cortex-look-book';

const RECIPE_HISTORY_TRANSLATE_KEY = 'Pages_TrifactaWorkpaperProcess_Step2_Recipe_History';

export const generateRecipeHistoryAlertMessage = (t, hasEntries, downloadCallback) => {
  if (!hasEntries) {
    return (
      <Box>
        <Text type={TextTypes.H3} fontWeight='m' mb={4}>
          {t(`${RECIPE_HISTORY_TRANSLATE_KEY}_NoRecipeTitle`)}
        </Text>
        <Text type={TextTypes.BODY}>{t(`${RECIPE_HISTORY_TRANSLATE_KEY}_NoRecipeDescription`)}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text type={TextTypes.H3} fontWeight='m' mb={5}>
        {t(`${RECIPE_HISTORY_TRANSLATE_KEY}_RecipeTitle`)}
      </Text>
      <Text type={TextTypes.BODY} mb={1}>
        {t(`${RECIPE_HISTORY_TRANSLATE_KEY}_RecipeDescription`)}
        {downloadCallback && (
          <Button
            type={ButtonTypes.LINK}
            display='inline-block'
            mr={3}
            onClick={downloadCallback}
            dataInstance='DownloadValidation'
          >
            &nbsp;
            {t(`${RECIPE_HISTORY_TRANSLATE_KEY}_RecipeDownload`)}
          </Button>
        )}
      </Text>
    </Box>
  );
};
