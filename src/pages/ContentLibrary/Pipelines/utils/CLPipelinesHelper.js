import { CONTEXT_MENU_OPTIONS } from '../constants/constants';
import { Actions, Permissions } from '../../../../utils/permissionsHelper';

export const getContextMenuOptions = t => {
  return [
    {
      id: CONTEXT_MENU_OPTIONS.EDIT,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Edit`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.UPDATE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.SUBMIT_REVIEW,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Submit`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.SUBMIT,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.DELETE,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Delete`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.DELETE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.BACK_TO_DRAFT,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_SwitchToDraft`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.UPDATE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.APPROVE,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Approve`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.APPROVE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.REJECT,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Reject`),
      permission: {
        permission: Permissions.CONTENT_LIBRARY_PIPELINES,
        action: Actions.APPROVE,
      },
    },
    {
      id: CONTEXT_MENU_OPTIONS.DEACTIVATE,
      text: t(`Pages_Content_Library_PipelinesListing_ContextMenu_Deactivate`),
      permission: {
        permission: Permissions.DATA_PIPELINE,
        action: Actions.UPDATE,
      },
    },
  ];
};
