import { CONTEXT_MENU_OPTIONS } from '../constants/constants';
import { Actions, Permissions } from '../../../utils/permissionsHelper';

export const getContextMenuOptions = t => {
  return [
    {
      id: CONTEXT_MENU_OPTIONS.OPEN,
      text: t(`Pages_Engagement_PipelinesListing_ContextMenu_Open`),
      permission: {
        permission: Permissions.DATA_PIPELINE,
        action: Actions.VIEW,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.EDIT,
      text: t(`Pages_Engagement_PipelinesListing_ContextMenu_Edit`),
      permission: {
        permission: Permissions.DATA_PIPELINE,
        action: Actions.UPDATE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.DELETE,
      text: t(`Pages_Engagement_PipelinesListing_ContextMenu_Delete`),
      permission: {
        permission: Permissions.DATA_PIPELINE,
        action: Actions.DELETE,
      },
    },
  ];
};
