import { EngagementTabs } from '../constants/constants';
import { isEmpty } from 'lodash';
import { PagePermissions } from '../../../utils/permissionsHelper';

export const getTabs = (t, pagePermissions, options, isExternal) => {
  if (isEmpty(pagePermissions) || !options.useEngagementPermissions) {
    return [];
  }

  const tabs = [
    {
      id: EngagementTabs.WORKPAPERS,
      label: t('Pages_Engagement_Tabs_Workpapers'),
      tooltipText: t('Pages_Engagement_TabPermissionTooltip'),
      tooltipWidth: 150,
      disabled: !pagePermissions[PagePermissions.ENGAGEMENT_WORK_ITEMS_DASHBOARD],
      showTooltip: !pagePermissions[PagePermissions.ENGAGEMENT_WORK_ITEMS_DASHBOARD],
    },
    {
      id: EngagementTabs.PIPELINES,
      label: t('Pages_Engagement_Tabs_Pipelines'),
      tooltipText: t('Pages_Engagement_TabPermissionTooltip'),
      tooltipWidth: 150,
      disabled: !pagePermissions[PagePermissions.ENGAGEMENT_DATA_PIPELINE],
      showTooltip: !pagePermissions[PagePermissions.ENGAGEMENT_DATA_PIPELINE],
    },
    {
      id: EngagementTabs.DATA_MANAGEMENT,
      label: t('Pages_Engagement_Tabs_DataManagment'),
      disabled: false,
    },
    {
      id: EngagementTabs.TEAM,
      label: t('Pages_Engagement_Tabs_EngagementTeam'),
      tooltipText: t('Pages_Engagement_TabPermissionTooltip'),
      tooltipWidth: 150,
      disabled: !pagePermissions[PagePermissions.ENGAGEMENT_USERS_DASHBOARD],
      showTooltip: !pagePermissions[PagePermissions.ENGAGEMENT_USERS_DASHBOARD],
    },
  ];

  return tabs.filter(tab => !(tab.disabled && isExternal));
};

export const getLandingTab = pagePermissions => {
  if (pagePermissions[PagePermissions.ENGAGEMENT_WORK_ITEMS_DASHBOARD]) {
    return EngagementTabs.WORKPAPERS;
  }
  if (pagePermissions[PagePermissions.ENGAGEMENT_DATA_PIPELINE]) {
    return EngagementTabs.PIPELINES;
  }
  if (
    pagePermissions[PagePermissions.ENGAGEMENT_USERS_DASHBOARD] &&
    !pagePermissions[PagePermissions.ENGAGEMENT_SUBSCRIBE_TO_DATA_SOURCES] &&
    !pagePermissions[PagePermissions.ENGAGEMENT_CONFIGURE_APPROVAL_WORKFLOW] &&
    !pagePermissions[PagePermissions.ENGAGEMENT_STAGING] &&
    !pagePermissions[PagePermissions.ENGAGEMENT_DATA_REQUEST] &&
    !pagePermissions[PagePermissions.ENGAGEMENT_DATA_REQUEST_OUTGOING]
  ) {
    return EngagementTabs.TEAM;
  }

  return EngagementTabs.DATA_MANAGEMENT;
};
