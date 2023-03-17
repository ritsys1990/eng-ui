import { TABS_OPTION } from './connectToBundleConstants';

export const getTabs = t => {
  return [
    {
      id: TABS_OPTION.BUNDLES_LIST,
      label: t('Components_AddWorkpaperModal_Step1_ConnectToBundle_BundlesList_Tab'),
    },
    {
      id: TABS_OPTION.SELECTED_BUNDLES,
      label: t('Components_AddWorkpaperModal_Step1_ConnectToBundle_SelectedBundles_Tab'),
    },
  ];
};
