import { useState, useEffect } from 'react';
import { ONE_TRUST_ACTIVE_GROUPS } from '../utils/oneTrustUtils';
import useAdobeInit from './adobeAnalytics/useAdobeInit';
import useWalkMe from './useWalkMe';

export default isOneTrustDisabled => {
  const [activeGroups, setActiveGroups] = useState('');

  const updateActiveGroups = () => {
    setActiveGroups(window.OnetrustActiveGroups);
  };

  // After the cookie consent is changed, One Trust will trigger a script that will dispatch this event and let us know about the updte.
  useEffect(() => {
    window.addEventListener('oneTrustActiveGroupChange', updateActiveGroups, false);

    return () => window.removeEventListener('oneTrustActiveGroupChange', updateActiveGroups);
  }, []);

  // category status depends on one trust being disabled
  const categoriesStatus = {
    strictlyNecessary:
      isOneTrustDisabled || (activeGroups !== '' && activeGroups.includes(ONE_TRUST_ACTIVE_GROUPS.STRICTLY_NECESSARY)),
    analytics:
      isOneTrustDisabled ||
      (activeGroups !== '' && activeGroups.includes(ONE_TRUST_ACTIVE_GROUPS.ANALYTICS_AND_PERFORMANCE)),
    functional:
      isOneTrustDisabled || (activeGroups !== '' && activeGroups.includes(ONE_TRUST_ACTIVE_GROUPS.FUNCTIONAL)),
    advertising:
      isOneTrustDisabled ||
      (activeGroups !== '' && activeGroups.includes(ONE_TRUST_ACTIVE_GROUPS.ADVERTISING_AND_TARGETING)),
  };

  const { isWalkMeReady } = useWalkMe({
    allowed: categoriesStatus.functional && categoriesStatus.analytics,
  });
  const { isAdobeReady, isUserReady, isAdobeDisabled } = useAdobeInit({
    allowed: categoriesStatus.analytics,
  });

  // if adobe is not ready yet, it might be because the user has not logged in yet, or it also may be blocked.
  return {
    categoriesStatus,
    requiredServicesReady: isAdobeReady || (!isAdobeReady && !isUserReady) || isAdobeDisabled,
    otherServicesReady: isWalkMeReady,
  };
};
