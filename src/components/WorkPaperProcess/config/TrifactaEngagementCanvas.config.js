export const getConfig = t => {
  return {
    headers: [t('Pages_Trifacta_Step1_Title'), t('Pages_Trifacta_Step2_Title'), t('Pages_Trifacta_Step3_Title')],
    stepNum: ['', '', ''],
    showWorkpaperHistory: true,
    step1: {
      addDataTableExists: true,
      exportDataTable: false,
      openDataWrangler: true,
      smartUploadExists: true,
      isCentralisededOptionExists: false,
      addDataTable: t('Pages_WorkpaperProcess_Step1_Add_DT'),
      removeAttachSourceIfCentralized: true,
      showAnalyticTemplate: false,
      inputUploadModal: {
        options: [
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
          {
            value: 'add datamodel',
            text: t('Components_InputUploaderModal_Trifacta_Upload_DM'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_DM_Desc'),
          },
          {
            value: 'zip',
            text: t('Components_InputUploaderModal_Trifacta_Upload_ZIP'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_ZIP_DESC'),
          },
        ],
        appendOptions: [
          {
            value: 'upload',
            text: t('Components_InputUploaderModal_Trifacta_Append_New'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_New_Desc'),
          },
          {
            value: 'select',
            text: t('Components_InputUploaderModal_Trifacta_Append_Existing'),
            desc: t('Components_InputUploaderModal_Trifacta_Upload_Existing_Desc'),
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
      zipUploadModal: {
        options: [
          {
            value: 'overwrite',
            text: t('Components_InputUploaderModal_Trifacta_ZIP_Upload_Overwrite'),
            desc: t('Components_InputUploaderModal_Trifacta_ZIP_Upload_Overwrite_Desc'),
          },
          {
            value: 'append',
            text: t('Components_InputUploaderModal_Trifacta_ZIP_Upload_Append'),
            desc: t('Components_InputUploaderModal_Trifacta_ZIP_Upload_Append_Desc'),
          },
        ],
      },
      inputOptions: {
        tooltip_message: t('Components_WOPROCESSSTEP1_INPUTOPTION_TOOLTIP'),
        title: t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_TITLE'),
        name: t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_OPTIONS'),
        rename_header: t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_DATATABLE_NAME'),
        todo: t('Components_WOPROCESSSTEP1_INPUTOPTION_TODO'),
        options: [
          {
            value: 'clear_data',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_CLEAR_DATA'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_CLEAR_DATA_DESC'),
          },
          {
            value: 'delete_input',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER_DESC'),
          },
        ],
        deleteOption: [
          {
            value: 'delete_input',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER_DESC'),
          },
        ],
        allOptions: {
          clear_data: 'clear_data',
          delete_input: 'delete_input',
          mark_as_required: 'mark_as_required',
          mark_as_optional: 'mark_as_optional',
          rename_input: 'rename_input:',
        },
        allOptions_Spinner_label: t('Components_WOPROCESSSTEP1_INPUTOPTION_SPINNER_LABEL'),
        CLoptions: {
          mark_as_required: {
            value: 'mark_as_required',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_MARK_AS_REQUIRED_INPUT_TABLE'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_MARK_AS_REQUIRED_INPUT_TABLE_DESC'),
          },
          mark_as_optional: {
            value: 'mark_as_optional',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_MARK_AS_OPTIONAL_INPUT_TABLE'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_MARK_AS_OPTIONAL_INPUT_TABLE_DESC'),
          },
        },
      },
    },
    step2: {
      importAndExportFlows: true,
    },
    step3: {
      cloneTableau: false,
      emptyText: t('Pages_TrifactaWorkpaperProcess_Step3_EmptyText'),
      outputDescription: t('Pages_TrifactaWorkpaperProcess_Step3_Description'),
      outputsDQC: true,
      outputsDataTable: true,
      outputsTableau: false,
      analyticTemplate: false,
      contextMenu: {
        rename: false,
        delete: false,
        saveDL: true,
        saveSQL: true,
        tableauTailoring: true,
        sendToOmnia: true,
        saveJE: true,
        downloadCSV: true,
      },
    },
    outputPage: {
      download: true,
      addLabel: false,
      delete: false,
      rename: true,
      transferToApp: false,
      tableauTailoring: false,
      sendToOmnia: true,
      saveTo: false,
      saveJE: true,
      seeMore: false,
      outputRow: false,
      outputsDQC: false,
      outputsDataTable: true,
      outputsTableau: false,
      editAdvanced: false,
      jobProfileIframe: true,
    },
  };
};
