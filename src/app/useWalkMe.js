import { useState, useEffect } from 'react';
import env from 'env';
import { settingsSelectors } from 'src/store/settings/selectors';
import { useSelector } from 'react-redux';

const DEFAULT_LANG = 'en-US';
const SCRIPT_ID = 'walk-me-src';

export default props => {
  const [isWalkMeReady, setIsWalkMeReady] = useState(false);
  const locale = useSelector(settingsSelectors.selectLocale);
  const { allowed } = props;

  useEffect(() => {
    if (!allowed || document.getElementById(SCRIPT_ID) || !env.WALKME_SCRIPT_SRC) {
      return;
    }

    // Preparing WalkMe external script markup.
    const walkme = document.createElement('script');
    walkme.id = SCRIPT_ID;
    walkme.type = 'text/javascript';
    walkme.async = true;
    walkme.src = env.WALKME_SCRIPT_SRC;
    walkme.className = 'optanon-category-3';
    const head = document.getElementsByTagName('head')[0];

    // Declaring initialization function.
    window.walkme_ready = () => {
      setIsWalkMeReady(true);
    };

    // Configuring WalkMe
    window._walkmeConfig = { smartLoad: true }; // eslint-disable-line no-underscore-dangle

    // Adding WalkMe script into the DOM.
    head.appendChild(walkme);
  }, [allowed]);

  useEffect(() => {
    // Syncing Cortex and WalkMe locales.
    if (isWalkMeReady && locale?.value) {
      const currentLang = window.WalkMeAPI.getCurrentLanguage();
      if (currentLang === locale.value) {
        return;
      }
      const success = window.WalkMeAPI.changeLanguage(locale.value);
      // Falls-back to default language mechanism.
      if (!success && currentLang !== DEFAULT_LANG) {
        window.WalkMeAPI.changeLanguage(DEFAULT_LANG);
      }
    }
  }, [isWalkMeReady, locale]);

  return { isWalkMeReady };
};
