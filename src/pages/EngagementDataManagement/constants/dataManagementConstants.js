import { PagePermissions } from '../../../utils/permissionsHelper';
import { IconTypes } from 'cortex-look-book';

export const dataNavigationOptions = [
  {
    name: 'SourceSystem',
    link: 'data-sources',
    icon: IconTypes.LOCK_HIERARCHY,
    external: true,
    permissions: [
      PagePermissions.ENGAGEMENT_SUBSCRIBE_TO_DATA_SOURCES,
      PagePermissions.ENGAGEMENT_CONFIGURE_APPROVAL_WORKFLOW,
    ],
  },
  {
    name: 'DataRequests',
    link: 'data-request',
    icon: IconTypes.SERVER_DOWNLOAD,
    external: true,
    permissions: [PagePermissions.ENGAGEMENT_DATA_REQUEST, PagePermissions.ENGAGEMENT_DATA_REQUEST_OUTGOING],
  },
  {
    name: 'DataStaging',
    link: 'staging',
    icon: IconTypes.HIERARCHY_FILES,
    external: true,
    permissions: [PagePermissions.ENGAGEMENT_STAGING],
  },
];
