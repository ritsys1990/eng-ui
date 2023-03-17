import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Text, Button, ButtonTypes, TextTypes, Link, Logo, LogoSizes } from 'cortex-look-book';
import { downloadNotices } from '../../store/client/actions';
import { clientSelectors } from '../../store/client/selectors';
import Cortex from './assets/cortex.png';
import env from 'env';
import fallback from '../../languages/fallback.json';
import { openOneTrustPopup } from '../../utils/oneTrustUtils';

const PAGE_NAME = 'Login';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const noticesBlob = useSelector(clientSelectors.selectNoticesBlob);
  const currentAuditYear = new Date().getFullYear();

  const handleLoginClick = () => {
    history.push('/clients');
  };

  useEffect(() => {
    document.title = `${fallback.Engagement_PageTitle_Login} ${fallback.Engagement_PageTitle_Separator} ${fallback.Engagement_PageTitle_AppName}`;
  }, [fallback]);

  useEffect(() => {
    let name = null;
    if (noticesBlob?.caller === 'disclaimer') {
      name = 'FRONT-END NOTICE.pdf';
    } else if (noticesBlob?.caller === 'cortex tou') {
      name = 'CORTEX TOU.pdf';
    } else if (noticesBlob?.caller === 'privacy') {
      name = 'Privacy Statement.pdf';
    } else if (noticesBlob?.caller === 'cookie notice') {
      name = 'Cookie Notice.pdf';
    }
    if (name) {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(noticesBlob.file, name);
      } else {
        const url = (window.URL ? window.URL : window.webkitURL).createObjectURL(noticesBlob.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
      }
      dispatch(downloadNotices(true));
    }
  }, [noticesBlob]);

  return (
    <Flex height='100vh' width='100%'>
      <Box bg='black' width='60%' height='100vh'>
        <Flex height='100vh' flexDirection='column' justifyContent='center' alignItems='center' position='relative'>
          <Box position='absolute' sx={{ top: '0', left: '0' }}>
            <Box ml={12} mt={12}>
              <Logo showOmniaLogo size={LogoSizes.MEDIUM} />
            </Box>
          </Box>
          <Flex height='60vh' alignItems='flex-end'>
            <img src={Cortex} alt='Cortex Logo' height='200' width='200' />
          </Flex>
          <Flex height='40vh' alignItems='flex-end'>
            <Text color='white' type={TextTypes.H4} ml={12} mb={10} mr={10}>
              {fallback.Engagement_Pages_Login_TOU_Help}&nbsp;
              <Link to={`mailto:${fallback.Engagement_Pages_Login_TOU_Email}`} external>
                {fallback.Engagement_Pages_Login_TOU_Email}
              </Link>
              <br />
              {fallback.Engagement_Pages_Login_TOU_Contact.replace('{year}', currentAuditYear)}&nbsp;
              <Link
                external
                to='#'
                onClick={() =>
                  dispatch(downloadNotices(false, `/${env.ENVIRONMENT_NAME}/static/CORTEX TOU.pdf`, 'cortex tou'))
                }
              >{`${fallback.Engagement_Pages_Login_TOU_Terms}`}</Link>
              ,&nbsp;
              <Link
                external
                to='#'
                onClick={() =>
                  dispatch(downloadNotices(false, `/${env.ENVIRONMENT_NAME}/static/Privacy Statement.pdf`, 'privacy'))
                }
              >
                {fallback.Engagement_Pages_Login_TOU_PrivacyStatement}
              </Link>
              &nbsp;
              {fallback.Engagement_Pages_Login_TOU_And}&nbsp;
              <Link
                external
                to='#'
                onClick={() =>
                  dispatch(
                    downloadNotices(false, `/${env.ENVIRONMENT_NAME}/static/FRONT-END NOTICES.pdf`, 'disclaimer')
                  )
                }
              >
                {fallback.Engagement_Pages_Login_TOU_Noitces}
              </Link>
              &nbsp;
              {fallback.Engagement_Pages_Login_TOU_MoreInformation}
              <br />
              <br />
              {fallback.Engagement_Pages_Login_TOU_DeloitteRefers}
              <br />
              {fallback.Engagement_Pages_Login_TOU_DTTL}
              <Link external to='https://www.deloitte.com/about' target='_blank'>
                {fallback.Engagement_Pages_Login_TOU_About}
              </Link>
              &nbsp;
              {fallback.Engagement_Pages_Login_TOU_DetailedDescription}
              <Button type={ButtonTypes.LINK} display='inline-block' height={10} onClick={openOneTrustPopup}>
                <Text type={TextTypes.BODY_COPY_SMALL}>
                  {fallback.Engagement_Components_AuditDisclaimer_Line10_cookie_settings}
                </Text>
              </Button>{' '}
              {fallback.Engagement_Components_AuditDisclaimer_Line10_and}{' '}
              <Link
                external
                to='#'
                onClick={() =>
                  dispatch(
                    downloadNotices(false, `/${env.ENVIRONMENT_NAME}${fallback.General_cookie_notice}`, 'cookie notice')
                  )
                }
              >
                {fallback.Engagement_Components_AuditDisclaimer_Line10_cookie_notice}
              </Link>{' '}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Box width='40%' height='100vh'>
        <Flex justifyContent='center' height='100vh' flexDirection='column' ml={15} lineHeight='1'>
          <Text type={TextTypes.HEADLINE} letterSpacing='-1.5px'>
            {fallback.Engagement_Pages_Login_WelcomeToCortex}
          </Text>
          <Text type={TextTypes.H1} color='subtitleGray' letterSpacing='-1.5px' mb={14}>
            {fallback.Engagement_Pages_Login_HarnessPowerOfData}
          </Text>
          <Button type={ButtonTypes.LOGIN} onClick={() => handleLoginClick()} dataInstance={PAGE_NAME}>
            {fallback.Engagement_Pages_Login_LoginButton}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Home;
