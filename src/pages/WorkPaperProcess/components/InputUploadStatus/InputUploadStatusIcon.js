import React, { useContext } from 'react';
import { Icon, IconTypes } from 'cortex-look-book';
import { WP_PROCESS_INPUT_STATUS } from '../../constants/WorkPaperProcess.const';
import { inputIconColorByStatus } from '../../utils/WorkPaperProcess.utils';
import { ThemeContext } from 'styled-components';

export const InputUploadStatusIcon = props => {
  const { inputStatusData } = props;
  const currentInputStatusError = inputStatusData.error;
  const currentInputStatus = inputStatusData.status;
  const theme = useContext(ThemeContext);

  const iconProps = () =>
    currentInputStatus === WP_PROCESS_INPUT_STATUS.DONE
      ? { height: 25, width: 25, type: IconTypes.CIRCLE_CHECKMARK }
      : { height: 25, width: 25, type: IconTypes.MINUS_CIRCLE };

  return (
    <Icon
      {...iconProps()}
      color={inputIconColorByStatus(currentInputStatus, currentInputStatusError, theme)}
      display='flex'
      alignItems='center'
      justifyContent='center'
    />
  );
};
