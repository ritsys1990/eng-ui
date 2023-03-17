export const getConfig = t => {
  return {
    headers: [
      t('Pages_WorkpaperProcess_Step1_Title'),
      t('Pages_WorkpaperProcess_Step2_Title'),
      t('Pages_WorkpaperProcess_Step3_Title'),
    ],
    stepNum: [
      t('Pages_WorkpaperProcess_Step1_Name'),
      t('Pages_WorkpaperProcess_Step2_Name'),
      t('Pages_WorkpaperProcess_Step3_Name'),
    ],
    showWorkpaperHistory: true,
    step1: {
      addDataTableExists: true,
      exportDataTable: false,
      openDataWrangler: false,
      isCentralisededOptionExists: false,
      removeAttachSourceIfCentralized: false,
      showAnalyticTemplate: true,
      inputUploadModal: {
        options: [
          {
            value: 'upload',
            text: t('Components_InputUploaderModal_Upload_Text'),
            desc: t('Components_InputUploaderModal_Upload_Desc'),
          },
          {
            value: 'select',
            text: t('Components_InputUploaderModal_Load_Text'),
            desc: t('Components_InputUploaderModal_Load_Desc'),
          },
        ],
        appendOptions: [
          {
            value: 'upload',
            text: t('Components_InputUploaderModal_Upload_Text'),
            desc: t('Components_InputUploaderModal_Upload_Desc'),
          },
          {
            value: 'select',
            text: t('Components_InputUploaderModal_Load_Text'),
            desc: t('Components_InputUploaderModal_Load_Desc'),
          },
        ],
        attachOptions: [
          {
            value: 'upload',
            text: t('Components_InputUploaderModal_Trifacta_Upload_New'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_New_Desc'),
          },
          {
            value: 'select',
            text: t('Components_InputUploaderModal_Trifacta_Upload_Existing'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_Existing_Desc'),
          },
        ],
      },
      inputOptions: {
        tooltip_message: t('Components_WOPROCESSSTEP1_INPUTOPTION_TOOLTIP'),
        title: t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_TITLE'),
        deleteOption: [
          {
            value: 'delete_input',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER_DESC'),
          },
        ],
      },
    },
    step2: {
      importAndExportFlows: false,
    },
    step3: {
      cloneTableau: true,
      emptyText: null,
      outputDescription: null,
      outputsDQC: true,
      outputsDataTable: true,
      outputsTableau: true,
      analyticTemplate: true,
    },
    outputPage: {
      download: true,
      addLabel: false,
      delete: false,
      rename: false,
      transferToApp: false,
      saveTo: false,
      saveJE: true,
      seeMore: true,
      outputRow: true,
      outputsDQC: true,
      outputsDataTable: true,
      outputsTableau: true,
      editAdvanced: true,
      jobProfileIframe: false,
      sendToOmnia: false,
    },
  };
};
