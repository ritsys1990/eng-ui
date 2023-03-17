import { Actions, Permissions } from '../../../utils/permissionsHelper';
import { ContextMenuOptions } from '../constants/clients.constants';

export const getContextMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t('Pages_Clients_ContextMenu_Edit'),
      permission: {
        permission: Permissions.CLIENT,
        action: Actions.UPDATE,
      },
    },
    {
      id: ContextMenuOptions.DELETE,
      text: t('Pages_Clients_ContextMenu_Delete'),
      permission: {
        permission: Permissions.CLIENT,
        action: Actions.DELETE,
      },
    },
  ];
};
