import { useState } from 'react';
import { setConsentChangeAction } from '../utils/oneTrustUtils';
import env from './env';

export default () => {
  const [isOneTrustReady, setIsOneTrustReady] = useState(false);

  if (env.ONETRUST_COOKIE_SCRIPT_SRC && env.ONETRUST_DOMAIN_SCRIPT_ID && !isOneTrustReady) {
    const oneTrustScriptEl = document.getElementById('oneTrustScript');

    if (!oneTrustScriptEl) {
      // Add one trust cookie script in the head tag
      const oneTrust = document.createElement('script');
      oneTrust.id = 'oneTrustScript';
      oneTrust.src = env.ONETRUST_COOKIE_SCRIPT_SRC;
      oneTrust.type = 'text/javascript';
      oneTrust.dataset.domainScript = env.ONETRUST_DOMAIN_SCRIPT_ID;

      const head = document.getElementsByTagName('head')[0];
      head.insertBefore(oneTrust, head.firstChild);

      setIsOneTrustReady(true);
    }
  }

  setConsentChangeAction(() => window.location.reload());

  return {
    isOneTrustReady,
    isOneTrustDisabled:
      !env.ONETRUST_COOKIE_SCRIPT_SRC ||
      env.ONETRUST_COOKIE_SCRIPT_SRC === '' ||
      !env.ONETRUST_DOMAIN_SCRIPT_ID ||
      env.ONETRUST_DOMAIN_SCRIPT_ID === '',
  };
};
