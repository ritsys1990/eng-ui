export const COMPONENT_NAME = 'CHILD_WORKPAPER';

export const childWorkpaperFormFields = {
  NAME: 'name',
  DESCRIPTION: 'description',
};

export const CHILD_WORKPAPER_INITIAL_STATE = {
  [childWorkpaperFormFields.NAME]: '',
  [childWorkpaperFormFields.DESCRIPTION]: '',
};

export const CHILD_WORKPAPER_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...CHILD_WORKPAPER_INITIAL_STATE,
  },
};

export const getFilterSelectionOptions = t => {
  return [
    {
      value: true,
      text: t('Components_CHILDWPFILTER_FirstRowHeader_Option'),
    },
    {
      value: false,
      text: t('Components_CHILDWPFILTER_SecondRowHeader_Option'),
    },
  ];
};

export const ChildWPLimits = {
  maxSaveChildWpLimit: 50,
  maxGenerateOutputChildWPLimit: 20,
};

export const CHILD_WORKPAPER_STATUS = {
  SUBMITTED: 'submitted',
  INPROGRESS: 'inprogress',
  COMPLETED: 'completed',
  DRAFT: 'Draft',
};

export const INPUT_CONTROL_PROPTYPES = {
  INTENT: 'INTENT',
  HINT: 'HINT',
};
