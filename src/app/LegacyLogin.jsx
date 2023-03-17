import React, { useEffect, useState } from 'react';
import { Flex, Button, ButtonTypes, Text, TextTypes, Spinner, Icon, IconTypes } from 'cortex-look-book';
import { isInFrame } from '../utils/legacyUtils';
import { Auth } from '../utils/authHelper';
import fallback from '../languages/fallback.json';
import { CORTEX_LEGACY_LOGIN, CORTEX_AUTH_REFERER } from '../constants/legacyLoginConst';

const { location, document } = window;

const url = new URL(location.href);
const isPopUp = url.searchParams.get('popup') === 'true' && !isInFrame;
const shouldLogin = url.hash === '#login';

export const LegacyLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPopUp) {
      if (shouldLogin) {
        location.hash = '';
        Auth.login();
      } else {
        window.close();
      }
    } else {
      if (document.referrer.indexOf(CORTEX_LEGACY_LOGIN) < 0) {
        sessionStorage.setItem(CORTEX_AUTH_REFERER, document.referrer);
      }
      setIsLoading(false);
    }
  }, []);

  const waitForPopupClose = async win => {
    while (!win.closed) {
      await new Promise(res => setTimeout(res, 2000));
    }
  };

  const handleLoginClick = async () => {
    setIsLoading(true);
    const win = window.open('/legacy-login?popup=true#login', 'login', 'width=200,heigth=200,top=100,left=100');
    await waitForPopupClose(win);
    location.replace(sessionStorage.getItem(CORTEX_AUTH_REFERER));
  };

  const overlayOpacity = isPopUp ? 1 : 0.8;

  return (
    <Spinner spinning={isLoading} overlayOpacity={overlayOpacity}>
      <Flex justifyContent='center' alignItems='center' height='100vh' flexDirection='column' lineHeight='1'>
        <Icon type={IconTypes.CORTEX} width={64} height={64} mb={20} />
        <Text type={TextTypes.BODY} fontSize='21px' lineHeight='32px' fontWeight='300px' mb='8px'>
          {fallback.Engagement_Pages_Login_Reauth_Title}
        </Text>
        <Text type={TextTypes.BODY} fontSize='14px' lineHeight='24px' mb='38px'>
          {fallback.Engagement_Pages_Login_Reauth_Description}
        </Text>
        <Button
          type={ButtonTypes.PRIMARY}
          onClick={handleLoginClick}
          sx={{ button: { borderRadius: 4, padding: '6px 24px', backgroundColor: '#2375a4', height: 'auto' } }}
        >
          <Flex justifyContent='center' alignItems='center' flexDirection='row'>
            <Text type={TextTypes.BODY} textTransform='none' fontSize='14px' lineHeight='24px' fontWeight='normal'>
              {fallback.Engagement_Pages_Login_LoginButton}
            </Text>
            <Icon type={IconTypes.EXTERNAL_LINK} width={24} height={24} />
          </Flex>
        </Button>
      </Flex>
    </Spinner>
  );
};
