import React, { useContext, useEffect } from 'react';
import { Link, Text, TextTypes, Box } from 'cortex-look-book';
import env from 'env';
import { ThemeContext } from 'styled-components';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Components_UserNotFound';

const UserNotFound = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    document.title = `${t('PageTitle_Error')} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
  }, [t]);

  return (
    <Box p={theme.space[10]} textAlign='left'>
      <Text forwardedAs='h3' type={TextTypes.H3} mb={5}>
        {t(`${TRANSLATION_KEY}_Title`)}
      </Text>
      <Text type={TextTypes.H3} mb={5}>
        <Box as='ul'>
          <Box as='li'>{t('Components_UserNotFound_Options_NotAccesingViaVPN')}</Box>
          <Box as='li'>{t('Components_UserNotFound_Options_NotCortexRole')}</Box>
          <Box as='li'>{t('Components_UserNotFound_Options_NotClientEngagement')}</Box>
        </Box>
      </Text>
      <Text forwardedAs='p' type={TextTypes.H3}>
        {t(`${TRANSLATION_KEY}_DescriptionAudit`)}
        <br />
        {t(`${TRANSLATION_KEY}_DescriptionCOE`)}{' '}
        <Link forwardedAs='span' to={`mailto:${env.EMAIL_SUPPORT}`} external>
          {env.EMAIL_SUPPORT}
        </Link>
      </Text>
    </Box>
  );
};

export default UserNotFound;
