export const WorkpaperSource = {
  TRIFACTA: 'Trifacta',
  CORTEX: 'Cortex',
};

export const newWorkpaperFormFields = {
  NAME: 'name',
  DESCRIPTION: 'description',
  TAG_IDS: 'tagIds',
  URL: 'url',
  WORKPAPER_SOURCE: 'workpaperSource',
};

export const NEW_WORKPAPER_INITIAL_STATE = {
  [newWorkpaperFormFields.NAME]: '',
  [newWorkpaperFormFields.DESCRIPTION]: '',
  [newWorkpaperFormFields.TAG_IDS]: [],
  [newWorkpaperFormFields.URL]: [],
  [newWorkpaperFormFields.WORKPAPER_SOURCE]: WorkpaperSource.CORTEX,
};

export const NEW_WORKPAPER_FORM_STATE = {
  invalid: true,
  submitted: false,
  value: {
    ...NEW_WORKPAPER_INITIAL_STATE,
    [newWorkpaperFormFields.URL]: '',
  },
};
