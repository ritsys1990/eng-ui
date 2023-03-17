import WORKPAPER_TYPES from '../../../utils/WorkpaperTypes.const';

export const WORKPAPER_PROCESS_CONFIG = [
  {
    type: WORKPAPER_TYPES.CORTEX_ENGAGEMENT_WIZARD,
    headers: ['Step 1 - Daivik', 'Step 2 - Carlos MVP', 'Step 3 - Cesar'],
  },
  {
    type: WORKPAPER_TYPES.ENGAGEMENT_WIZARD,
    headers: ['Step 1 - Data', 'Step 2 - Wrangling', 'Step 3 - Output'],
  },
];

export const WORKPAPER_PROCESS_GET_CONFIG = type => {
  return WORKPAPER_PROCESS_CONFIG.find(config => type === config.type);
};
