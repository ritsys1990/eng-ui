import { Actions, Permissions } from '../../../utils/permissionsHelper';
import { ContextMenuOptions } from '../constants/ContextMenuOptions.const';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_WorkpaperTable';

export const getTabs = t => {
  return [
    {
      id: 'workpapers',
      label: t(`${TRANSLATION_KEY}_Tabs_ActiveWorkpapers`),
    },
    {
      id: 'outputs',
      label: t(`${TRANSLATION_KEY}_Tabs_OutputsAccount`),
    },
  ];
};

export const getContextMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Edit`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPERS,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.COPY,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Copy`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPERS,
        action: Actions.ADD,
      },
    },
    {
      id: ContextMenuOptions.DELETE,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Delete`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPERS,
        action: Actions.DELETE,
      },
    },
    {
      id: ContextMenuOptions.SUBMIT_REVIEW,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Submit`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPER_REVIEW,
        action: Actions.SUBMIT,
      },
    },
    {
      id: ContextMenuOptions.RETURN_PREPARER,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Return`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPER_REVIEW,
        action: Actions.APPROVE,
      },
    },
    {
      id: ContextMenuOptions.REVERT_PROGRESS,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Revert`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPER_REVIEW,
        action: Actions.APPROVE,
      },
    },
    {
      id: ContextMenuOptions.COMPLETE,
      text: t(`${TRANSLATION_KEY}_ContextMenu_Complete`),
      permission: {
        permission: Permissions.ENGAGEMENT_WORKPAPER_REVIEW,
        action: Actions.APPROVE,
      },
    },
  ];
};
