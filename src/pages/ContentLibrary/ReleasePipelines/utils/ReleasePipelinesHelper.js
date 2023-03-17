export const getTabs = t => {
  return [
    {
      id: 'Published',
      label: t('Pages_Content_Library_Releases_Pipelines_Published'),
    },
    {
      id: 'ReadyForReview',
      label: t('Pages_Content_Library_Releases_Pipelines_ReadyForReview'),
    },
  ];
};
