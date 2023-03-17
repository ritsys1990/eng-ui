import React, { useContext } from 'react';
import { Text } from 'cortex-look-book';
import { inputStatusColorByStatus, showStatusTextByStatus } from '../../utils/WorkPaperProcess.utils';
import { ThemeContext } from 'styled-components';
import useTranslation from 'src/hooks/useTranslation';

export const InputUploadStatusText = props => {
  const { t } = useTranslation();

  const theme = useContext(ThemeContext);
  const { inputStatusData, currentInput } = props;
  const currentInputStatusError = currentInput ? inputStatusData.error : null;
  const currentInputStatus = currentInput ? inputStatusData.status : 'done';

  return !currentInputStatus && !currentInputStatusError ? null : (
    <Text color={inputStatusColorByStatus(currentInputStatus, currentInputStatusError, theme)}>
      {t(showStatusTextByStatus(currentInputStatus, currentInputStatusError))}
    </Text>
  );
};
