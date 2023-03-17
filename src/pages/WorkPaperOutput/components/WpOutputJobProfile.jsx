import React, { useContext } from 'react';
import Iframe from 'react-iframe';
import { Box, TextTypes, Text } from 'cortex-look-book';
import env from 'env';
import { ThemeContext } from 'styled-components';
import useTranslation from 'src/hooks/useTranslation';

const WpOutputJobProfile = ({ IframeTitle, jobId }) => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  return (
    <>
      <Text mb={5} textAlign='left' type={TextTypes.H1}>
        {t('Pages_Trifacta_Data_Profile')}
      </Text>
      <Box
        sx={{
          borderRadius: '1px',
          borderWidth: '1px',
          borderStyle: 'solid',
          marginBottom: '20px',
          borderColor: theme.colors['gray2'],
        }}
      >
        <Iframe
          url={`${env.TRIFACTA_URL}/jobs/${jobId}?activeTab=profile`}
          frameBorder='0'
          id='farme'
          height='700px'
          width='100%'
          scrolling='no'
          aria-hidden='true'
          title={IframeTitle}
          allow='clipboard-read; clipboard-write'
        />
      </Box>
    </>
  );
};

export default WpOutputJobProfile;
