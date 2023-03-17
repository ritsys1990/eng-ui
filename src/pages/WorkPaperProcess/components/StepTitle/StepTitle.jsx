import React from 'react';
import { Text, TextTypes } from 'cortex-look-book';

const StepTitle = ({ stepNum, title }) => {
  return (
    <>
      <Text type={TextTypes.H2} fontWeight='m'>
        {stepNum}
      </Text>
      <Text type={TextTypes.H2} fontWeight='s'>
        &nbsp;{title}
      </Text>
    </>
  );
};

export default StepTitle;
