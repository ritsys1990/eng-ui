import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { securitySelectors } from '../../store/security/selectors';
import {
  APP_NAME,
  ANALYTICS_SATELLITE_NAME,
  AnalyticsTrackTypes,
} from '../../services/adobe-analytics/adobe-analytics.const';
import AdobeAnalyticsService from '../../services/adobe-analytics/adobe-analytics.service';

export default () => {
  const [initialLoadFinished, setInitialLoadFinished] = useState(false);
  const [prevUrl, setPrevUrl] = useState('');
  const me = useSelector(securitySelectors.selectMe);

  const updateAnalyticsDataLayer = userId => {
    AdobeAnalyticsService.analyticsDataLayer = {
      userID: userId,
      appName: APP_NAME,
      pageName: window.location.pathname,
    };
  };

  // we need to make sure the first page is logged into adobe launch, and for that we need the
  // satellite object from the adobe script, thus we need to run an update when it becomes available.
  if (
    !initialLoadFinished &&
    window.analyticsDataLayer &&
    window[ANALYTICS_SATELLITE_NAME] &&
    window[ANALYTICS_SATELLITE_NAME].track
  ) {
    setInitialLoadFinished(true);
  }

  useEffect(() => {
    if (
      window.analyticsDataLayer &&
      window[ANALYTICS_SATELLITE_NAME] &&
      window[ANALYTICS_SATELLITE_NAME].track &&
      prevUrl !== window.location.pathname
    ) {
      // the next operation needs to be performed on every page load, according to the instructions provided in the original PBI
      updateAnalyticsDataLayer(AdobeAnalyticsService.getUserId(me.email));
      window[ANALYTICS_SATELLITE_NAME].track(AnalyticsTrackTypes.PAGE_VIEW);
      setPrevUrl(window.location.pathname);
    }
  }, [window.location.pathname, initialLoadFinished]);
};
