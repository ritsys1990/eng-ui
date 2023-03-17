export const PAGE_NAME = 'DefineFilters';

export const DefineFilterTabs = {
  FILTERS: 'filters',
};

export const ContextMenuOptions = {
  EDIT: 'edit',
  DELETE: 'delete',
};

export const getContextMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.EDIT,
      text: t('Pages_Clients_ContextMenu_Edit'),
    },
    {
      id: ContextMenuOptions.DELETE,
      text: t('Pages_Clients_ContextMenu_Delete'),
    },
  ];
};

export const BUNDLE_STATUS = {
  PUBLISHED: 'Published',
  DEACTIVATED: 'Deactivated',
};
