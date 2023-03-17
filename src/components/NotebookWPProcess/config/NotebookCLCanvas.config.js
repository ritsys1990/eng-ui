export const getConfig = t => {
  const uploadNewDesc = t('components-input-uploader-modal-notebook-upload-new-desc');
  const uploadExistinngDesc = t('components-input-uploader-modal-notebook-upload-existing-desc');

  return {
    headers: [t('pages-notebook-step1-title'), t('pages-notebook-step2-title'), t('pages-notebook-step3-title')],
    stepNum: ['', '', ''],
    step1: {
      showAnalyticTemplate: true,
      inputUploadModal: {
        options: [
          {
            value: 'upload',
            text: t('components-input-uploader-modal-notebook-upload-new'),
            desc: uploadNewDesc,
          },
          {
            value: 'select',
            text: t('components-input-uploader-modal-notebook-upload-existing'),
            desc: uploadExistinngDesc,
          },
        ],
        appendOptions: [
          {
            value: 'upload',
            text: t('components-input-uploader-modal-notebook-append-new'),
            desc: uploadNewDesc,
          },
          {
            value: 'select',
            text: t('components-input-uploader-modal-notebook-append-existing'),
            desc: uploadExistinngDesc,
          },
        ],
        attachOptions: [
          {
            value: 'upload',
            text: t('components-input-uploader-modal-notebook-upload-new'),
            desc: uploadNewDesc,
          },
          {
            value: 'select',
            text: t('components-input-uploader-modal-notebook-upload-existing'),
            desc: uploadExistinngDesc,
          },
        ],
      },
      inputOptions: {
        allOptions_Spinner_label: t('components-notebook-wp-process-step1-input-option-spinner-label'),
      },
    },
    step2: {},
    step3: {
      emptyText: t('pages-notebook-wp-process-step3-empty-text'),
      outputdescription: t('pages-notebook-wp-process-step3-description'),
      outputsDataTable: true,
      outputsTableau: true,
      outputsTableauPath: '/library/workpapers/:workpaperId/analysis/:workbookId/:view/source=:workpaperType',
      manageTableau: true,
      contextMenu: {
        downloadCSV: true,
      },
    },
    outputPage: {
      download: true,
      seeMore: false,
    },
  };
};
