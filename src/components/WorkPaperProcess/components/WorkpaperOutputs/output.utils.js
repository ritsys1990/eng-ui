import { ModalOptions, TRANSLATION_KEY_CANVAS, OUTPUT_TYPES, OUTPUT_JE_TYPES } from './output.consts';

const sqlNameRegexp = /[^a-zA-Z\d]/g;
const getOutputModalOptions = (t, readOnlyfromWP, isCentralizedDSUpdated) => {
  let result = [
    {
      value: ModalOptions.DOWNLOAD_AS_CSV,
      text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_DownloadAsCSV`),
      desc: t('Components_OutputOptionsModal_DownloadCSV'),
    },
  ];
  if (!readOnlyfromWP) {
    result = [
      {
        value: ModalOptions.DELETE,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_Delete`),
        desc: t('Components_OutputOptionsModal_DeleteDesc'),
      },
      {
        value: ModalOptions.SAVE_TO_DL,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SaveToDataLake`),
        desc: t('Components_OutputOptionsModal_SaveToDLDesc'),
      },
      {
        value: ModalOptions.SAVE_TO_SQL,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SaveToSQL`),
        desc: t('Components_OutputOptionsModal_SaveToSQLDesc'),
      },
      {
        value: ModalOptions.TABLEAU_TAILORING,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_TableauTailoring`),
        desc: t('Components_OutputOptionsModal_TableauTailoringDesc'),
      },
      {
        value: ModalOptions.DOWNLOAD_AS_CSV,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_DownloadAsCSV`),
        desc: t('Components_OutputOptionsModal_DownloadCSV'),
      },
      {
        value: ModalOptions.SAVE_TO_JE,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SaveToJe`),
        desc: t('Components_OutputOptionsModal_SaveToJeDesc'),
      },
      {
        value: ModalOptions.CONNECT_TO_DM,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_ConnectToDM`),
        desc: t('Components_OutputOptionsModal_ConnectToDMDesc'),
      },
      {
        value: ModalOptions.SEND_TO_OMNIA,
        text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SendToOmnia`),
        desc: t('Components_OutputOptionsModal_SendToOmniaDesc'),
      },
    ];
  } else if (isCentralizedDSUpdated) {
    result.push({
      value: ModalOptions.SAVE_TO_SQL,
      text: t(`${TRANSLATION_KEY_CANVAS}_ModalOptions_SaveToSQL`),
      desc: t(`Components_OutputOptionsModal_SaveToSQLDesc`),
    });
  }

  return result;
};

export const getOutputSaveToJeMenuOptions = t => {
  return [
    { value: OUTPUT_JE_TYPES.JE, text: t('Pages_WorkpaperProcess_Output_SaveToJE_asJE') },
    { value: OUTPUT_JE_TYPES.TB, text: t('Pages_WorkpaperProcess_Output_SaveToJE_asTB') },
  ];
};

export const getModalOptions = (t, outputType, readOnlyfromWP, isCentralizedDSUpdated) => {
  switch (outputType) {
    case OUTPUT_TYPES.TABLEAU:
      return [];
    case OUTPUT_TYPES.DATA_TABLE:
    case OUTPUT_TYPES.DQC:
    default:
      return getOutputModalOptions(t, readOnlyfromWP, isCentralizedDSUpdated);
  }
};

export const removeSpecialChar = label => {
  return label.replace(/[^a-z0-9]/gi, '');
};

export const getSqlTableName = output => {
  if (output['sqlTableName']) {
    return output['sqlTableName'];
  }
  const strEnd = (output['name'] + output['workpaperId'] || '').replace(sqlNameRegexp, '');

  return `output_${strEnd}`;
};

export const getMappingTranslations = (t, savedToSql) => {
  let mappingError;
  let mappingSuccess;
  let spinnerLabel;
  let title;
  let description;
  let outputLabel;
  let tableLabel;

  if (savedToSql) {
    mappingError = 'Components_OutputMappingScreen_OutputFileSqlSaveError';
    mappingSuccess = 'Components_OutputMappingScreen_OutputFileSqlSaveSuccess';
    spinnerLabel = 'Components_OutputMappingScreen_SavingToSql';
    title = 'Components_OutputMappingScreen_Title';
    description = 'Components_OutputMappingScreen_Description';
    outputLabel = 'Components_OutputMappingScreen_OutputTable_LabelName';
    tableLabel = 'Components_OutputMappingScreen_SQLTable_LabelName';
  } else {
    mappingError = 'Components_OutputMappingScreen_OutputFileMappingTableauError';
    mappingSuccess = 'Components_OutputMappingScreen_OutputFileMappingTableauSuccess';
    spinnerLabel = 'Components_OutputMappingScreen_RenamingMappingTableau';
    title = 'Components_OutputTableauTailoring_Title';
    description = 'Components_OutputTableauTailoring_Description';
    outputLabel = 'Components_OutputTableauTailoring_StandardOutput_LabelName';
    tableLabel = 'Components_OutputTableauTailoring_TailoredFieldNaming_LabelName';
  }

  return {
    mappingError: t(mappingError),
    mappingSuccess: t(mappingSuccess),
    spinnerLabel: t(spinnerLabel),
    title: t(title),
    description: t(description),
    outputLabel: t(outputLabel),
    tableLabel: t(tableLabel),
  };
};
