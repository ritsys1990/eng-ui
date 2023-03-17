export const COMPONENT_NAME = 'AddNewFilter';

export const radioGroupName = 'filterTypeName';

export const FormErrorModel = Object.freeze({
  filterName: null,
  filterDesc: null,
  tableValue: null,
  fieldValue: null,
  rows: null,
  defaultValueError: null,
  selectedOperation: [null, null, null, null, null, null],
  selectedFilterValue: [null, null, null, null, null, null],
  operatorErrorLength: 0,
  filterErrorLength: 0,
});

export const FILTER_TYPE = {
  SUGGESTED: 'Suggested',
  MANDATORY: 'Mandatory',
};

export const FILTER_TABLE_KEY = {
  CRITERIA: 'criteria',
  FITER_VALUE: 'filtervalue',
  TEXT_EXAMPLE: 'textExample',
};

export const OPERATIONS = [
  { id: 1, name: '=' },
  { id: 2, name: '<>' },
  { id: 3, name: '<' },
  { id: 4, name: '>' },
  { id: 5, name: '<=' },
  { id: 6, name: '>=' },
];

export const ContextMenuOptions = {
  EDIT: 'edit',
  DELETE: 'delete',
};

export const getContextMenuOptions = t => {
  return [
    {
      id: ContextMenuOptions.DELETE,
      text: t('Pages_Clients_ContextMenu_Delete'),
    },
  ];
};

export const getFilterTypeOptions = t => {
  return [
    {
      value: FILTER_TYPE.SUGGESTED,
      text: t('Pages_ContentLibrary_Filter_Type_Suggested'),
    },
    {
      value: FILTER_TYPE.MANDATORY,
      text: t('Pages_ContentLibrary_Filter_Type_Mandatory'),
    },
  ];
};
