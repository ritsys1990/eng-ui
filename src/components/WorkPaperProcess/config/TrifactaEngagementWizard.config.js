import { Actions, Permissions } from '../../../utils/permissionsHelper';

export const getConfig = t => {
  return {
    headers: [
      t('Pages_WorkpaperProcess_Step1_Title'),
      t('Pages_WorkpaperProcess_Step2_Title'),
      t('Pages_WorkpaperProcess_Step3_Title'),
      t('Pages_WorkpaperProcess_DataModelStep_Title'),
    ],
    stepNum: [
      t('Pages_WorkpaperProcess_Step1_Name'),
      t('Pages_WorkpaperProcess_Step2_Name'),
      t('Pages_WorkpaperProcess_Step3_Name'),
      t('Pages_WorkpaperProcess_DataModelStep_Name'),
    ],
    showWorkpaperHistory: true,
    step1: {
      addDataTableExists: true,
      exportDataTable: false,
      openDataWrangler: true,
      smartUploadExists: true,
      addDataTable: t('Pages_WorkpaperProcess_Step1_Add_DT'),
      isCentralisededOptionExists: false,
      removeAttachSourceIfCentralized: true,
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
          {
            value: 'connect data request',
            text: t('Components_InputUploaderModal_Trifecta_Data_Request_Text'),
            desc: t('Components_InputUploaderModal_Trifacta_Data_Request_Desc'),
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
          {
            value: 'view_mapping',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_VIEW_DATA_MAPPING'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_VIEW_DATA_MAPPING_DESC'),
          },
        ],
        datarequestOptions: [
          {
            value: 'delete_input',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER_DESC'),
          },
          {
            value: 'view_request',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_VIEW_DATA_REQUEST'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_VIEW_DATA_REQUEST_DESC'),
            required_permissions: [{ permission: Permissions.DATA_REQUESTS, action: Actions.VIEW }],
          },
          {
            value: 'edit_request',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_EDIT_DATA_REQUEST'),
            desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_EDIT_DATA_REQUEST_DESC'),
            required_permissions: [{ permission: Permissions.DATA_REQUESTS, action: Actions.UPDATE }],
          },
          {
            value: 'decouple_request',
            text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DECOUPLE_INPUT_DATA_TABLE_FROM_DATA_REQUEST'),
            desc: t(
              'Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DECOUPLE_INPUT_DATA_TABLE_FROM_DATA_REQUEST_DESC'
            ),
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
          view_mapping: 'view_mapping',
          view_request: 'view_request',
          edit_request: 'edit_request',
          decouple_request: 'decouple_request',
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
      cloneTableau: true,
      emptyText: null,
      outputDescription: null,
      outputsDQC: true,
      outputsDataTable: true,
      outputsTableau: true,
      outputsTableauPath: '/workpapers/:workpaperId/analysis/:workbookId/:view/source=:workpaperType',
      analyticTemplate: true,
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
      rename: false,
      transferToApp: false,
      tableauTailoring: false,
      sendToOmnia: true,
      saveTo: false,
      saveJE: true,
      seeMore: false,
      outputRow: false,
      outputsDQC: true,
      outputsDataTable: true,
      outputsTableau: false,
      editAdvanced: false,
      jobProfileIframe: true,
    },
  };
};
