import { useEffect, useState } from 'react';
import env from '../env';
import { useSelector } from 'react-redux';
import { securitySelectors } from '../../store/security/selectors';
import { APP_NAME } from '../../services/adobe-analytics/adobe-analytics.const';
import AdobeAnalyticsService from '../../services/adobe-analytics/adobe-analytics.service';

export default props => {
  const [isAdobeReady, setIsAdobeReady] = useState(false);
  const me = useSelector(securitySelectors.selectMe);
  const { allowed } = props;

  useEffect(() => {
    if (allowed && !isAdobeReady && me) {
      const currentUrl = window.location.pathname;
      const analyticsDataLayerId = 'analyticsDataLayer';
      const analyticsDataLayer = document.createElement('script');
      analyticsDataLayer.type = 'text/javascript';
      analyticsDataLayer.id = analyticsDataLayerId;

      if (me && me.email) {
        const userId = AdobeAnalyticsService.getUserId(me.email);
        analyticsDataLayer.text = `
        var analyticsDataLayer = {
          pageInfo:{
            userID: '${userId}',
            appName: '${APP_NAME}',
            pageName: '${currentUrl}'
          }
        };`;

        const adobeAnalytics = document.createElement('script');
        const adobeScriptId = 'adobeAnalytics';
        adobeAnalytics.src = env.ADOBE_ACCOUNT;
        adobeAnalytics.async = true;
        adobeAnalytics.id = adobeScriptId;
        adobeAnalytics.className = 'optanon-category-2';

        const body = document.getElementsByTagName('body')[0];
        body.appendChild(analyticsDataLayer);
        body.appendChild(adobeAnalytics);
        setIsAdobeReady(true);
      }
    }
  }, [allowed, isAdobeReady, me, me?.email]);

  return { isAdobeReady, isUserReady: me, isAdobeDisabled: !allowed };
};
