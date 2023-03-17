import { TRANSLATION_KEY, SubscriptionStatus } from './constants';

/**
 * Gets the translation for a given subscription status.
 * Since this is API data, it validates if the status is recognize by the app first,
 * otherwise it will fallback to the orignal status.
 *
 * @param {Func} t
 * @param {string} status
 */
export const getSubscriptionStatusText = (t, status) => {
  const isKnownStatus = Object.values(SubscriptionStatus).indexOf(status) > -1;

  return isKnownStatus ? t(`${TRANSLATION_KEY}SubscriptionStatus_${status}`) : status;
};

/**
 * Gets the translation for a given subscription status CTA.
 * Since this is API data, it validates if the status is recognize by the app first,
 * otherwise it will fallback to the orignal status.
 *
 * @param {Func} t
 * @param {string} status
 */
export const getSubscriptionStatusCTAText = (t, status) => {
  const isKnownStatus = Object.values(SubscriptionStatus).indexOf(status) > -1;

  return isKnownStatus ? t(`${TRANSLATION_KEY}SubscriptionStatusCTA_${status}`) : status;
};
