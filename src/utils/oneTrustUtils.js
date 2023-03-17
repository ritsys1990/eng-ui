/**
 * One Trust cookie categories.
 */
export const ONE_TRUST_ACTIVE_GROUPS = {
  STRICTLY_NECESSARY: '1',
  ANALYTICS_AND_PERFORMANCE: '2',
  FUNCTIONAL: '3',
  ADVERTISING_AND_TARGETING: '4',
  SOCIAL_MEDIA: '5',
};

/**
 * Opens the One Trust cookie settings banner by using the OneTrust API.
 */
export const openOneTrustPopup = () => {
  if (window.OneTrust) {
    window.OneTrust.ToggleInfoDisplay();
  }
};

/**
 * Declare function to be executed after cookie consent is changed.
 */
export const setConsentChangeAction = fn => {
  if (window.OneTrust && fn instanceof Function) {
    window.OneTrust.OnConsentChanged(fn);
  }
};
