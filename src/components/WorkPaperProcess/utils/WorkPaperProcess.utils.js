import {
  WP_PROCESS_INPUT_STATUS,
  WP_PROCESS_INPUT_ERRORS,
  TRIFACTA_WP_PROCESS_INPUT_STATUS,
  WP_INPUT_CENTRALIZED_DATA_STATUS,
} from '../constants/WorkPaperProcess.const';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import { ProgressBarTypes, Intent } from 'cortex-look-book';
import { isAnyDataRequestScheduleDone } from '../components/InputDataRequestStatus/utils/InputDataRequestStatus.utils';

const isInputCompleted = input => {
  return (
    input.status === WP_PROCESS_INPUT_STATUS.DONE ||
    (input.error &&
      (input.error.code === WP_PROCESS_INPUT_ERRORS.DMV_ERROR ||
        input.error.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING)) ||
    isAnyDataRequestScheduleDone(input)
  );
};

/**
 * Check if all required inputs are in DONE status
 * @param {Array} inputs
 */
export function isStep1Completed(inputs) {
  if (!inputs || !inputs.length) {
    return false;
  }

  const requiredInputs = inputs.filter(item => item.required);
  const optionalInputs = inputs.filter(item => !item.required);

  return requiredInputs.length ? requiredInputs.every(isInputCompleted) : optionalInputs.some(isInputCompleted);
}

/**
 * Return status data by key, to avoid additional mapping
 * @param {String} status
 * @param {String} key
 */

export function inputStatusProgressDataByKey(
  status,
  key,
  error,
  trifactaStatus,
  trifactaInputId,
  workpaperType,
  lastFile,
  fileUrl,
  centralizedData
) {
  let data;

  switch (status) {
    case WP_PROCESS_INPUT_STATUS.UPLOADING:
      data = {
        type: 'warning',
        progress: 25,
      };
      break;

    case WP_PROCESS_INPUT_STATUS.MAPPING:
      data = {
        type: 'guidance',
        progress: 50,
      };
      break;

    case WP_PROCESS_INPUT_STATUS.APPENDING:
    case WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP:
      data = {
        type: 'info',
        progress: 75,
      };
      break;

    case WP_PROCESS_INPUT_STATUS.VALIDATING:
      data = {
        type: 'info',
        progress: 90,
      };
      break;

    case WP_PROCESS_INPUT_STATUS.DONE:
      data = {
        type: 'success',
        progress: 100,
      };
      break;

    case WP_PROCESS_INPUT_STATUS.DMV_ZIP:
      data = {
        type: 'warning',
        progress: 50,
      };
      break;

    case null:
    default:
      data = {
        type: 'default',
        progress: 0,
      };
      break;
  }

  if (centralizedData) {
    data = {
      type: 'default',
      progress: 0,
    };
  }

  if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      data.type = 'warning';
    } else {
      data.type = 'error';
    }
  }

  if (
    fileUrl &&
    status !== WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP &&
    workpaperType === WORKPAPER_TYPES.TRIFACTA &&
    lastFile &&
    (!trifactaInputId || trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS)
  ) {
    data.type = 'warning';
    data.progress = 50;
  }

  return data[key];
}

/**
 * Return translation key by status, to avoid additional mapping
 * @param {String} status
 */

// eslint-disable-next-line sonarjs/cognitive-complexity
export function showStatusTextByStatus(
  status,
  error,
  trifactaStatus,
  trifactaInputId,
  workpaperType,
  lastFile,
  fileUrl,
  centralizedData
) {
  if (
    fileUrl &&
    status !== WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP &&
    workpaperType === WORKPAPER_TYPES.TRIFACTA &&
    lastFile &&
    (!trifactaInputId || trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS)
  ) {
    return 'Pages_WorkpaperProcess_Step1_Table_InputStatusInputTrifactaConnectionFailedError';
  }

  if (status === WP_PROCESS_INPUT_ERRORS.ZIP_FAILED) {
    return 'Pages_WorkpaperProcess_Step1_Table_Zip_Upload_Failed_Error';
  }

  if (error) {
    switch (error.code) {
      case WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED:
        return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextMappingError';
      case WP_PROCESS_INPUT_ERRORS.DMV_ERROR:
        return 'Pages_WorkpaperProcess_Step1_Table_InputStatusDMVError';
      case WP_PROCESS_INPUT_ERRORS.DMV_WARNING:
        return 'Pages_WorkpaperProcess_Step1_Table_InputStatusDMVWarning';
      case WP_PROCESS_INPUT_ERRORS.DMV_MAPPING_ERROR:
        return 'Pages_WorkpaperProcess_Step1_Table_InputStatusDMVMappingError';
      default:
        return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextGenericError';
    }
  }

  if (centralizedData) {
    if (centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.SUCCESS) {
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextCentralizedData';
    } else if (centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.INPROGRESS) {
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextCentralizedData_Loading';
    } else if (centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.ERROR) {
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextCentralizedData_Error';
    }

    if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
      if (!status) {
        return 'pages_notebook_step1_table_inputTextCentralizedData';
      }

      return 'pages_notebook_step1_table_inputStatusTextCentralizedData';
    }
  }

  switch (status) {
    case WP_PROCESS_INPUT_STATUS.UPLOADING:
    case WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextUploading';

    case WP_PROCESS_INPUT_STATUS.MAPPING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextMapping';

    case WP_PROCESS_INPUT_STATUS.APPENDING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextAppending';

    case WP_PROCESS_INPUT_STATUS.VALIDATING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextValidating';

    case WP_PROCESS_INPUT_STATUS.DONE:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextDone';

    case WP_PROCESS_INPUT_STATUS.DATA_CLEARED:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusClearData';

    case WP_PROCESS_INPUT_STATUS.DMV_ZIP:
      return 'Pages_WorkpaperProcess_Step1_Table_Zip_Upload_DMV_Error';

    default:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextGenericError';
  }
}

/**
 * Return color for text, to avoid additional mapping
 * @param {String} status
 * @param {Object} theme
 * @param {Object} optional params
 */

export function inputStatusColorByStatus(
  status,
  theme,
  {
    error,
    trifactaStatus,
    trifactaInputId,
    workpaperType,
    lastFile,
    fileUrl,
    centralizedData,
    isDataRequest = false,
    dataRequestStatusType = null,
  }
) {
  if (
    fileUrl &&
    status !== WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP &&
    workpaperType === WORKPAPER_TYPES.TRIFACTA &&
    lastFile &&
    (!trifactaInputId || trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS)
  ) {
    return theme?.colors?.warningText;
  }

  if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      return theme?.colors?.warningText;
    }

    return theme?.colors?.errorText;
  }

  if (centralizedData) {
    if (centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.ERROR) {
      return theme?.colors?.errorText;
    }

    return theme?.colors?.gray;
  }

  if (isDataRequest) {
    if (dataRequestStatusType === Intent.SUCCESS) {
      return theme?.colors?.successText;
    } else if (dataRequestStatusType === Intent.INFO) {
      return theme?.colors?.infoText;
    }

    return theme?.colors?.errorText;
  }

  switch (status) {
    case WP_PROCESS_INPUT_STATUS.UPLOADING:
    case WP_PROCESS_INPUT_STATUS.DMV_ZIP:
      return theme?.colors?.warningText;

    case WP_PROCESS_INPUT_STATUS.MAPPING:
    case WP_PROCESS_INPUT_STATUS.APPENDING:
    case WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP:
    case WP_PROCESS_INPUT_STATUS.VALIDATING:
      return theme?.colors?.infoText;

    case WP_PROCESS_INPUT_STATUS.DONE:
      return theme?.colors?.successText;

    default:
      return undefined;
  }
}

/**
 * Return color for icon
 * @param {String} status
 * @param {Object} optional params
 * @param {String} color
 */
export function inputIconColorByStatus(
  status,
  theme,
  {
    error,
    trifactaStatus,
    trifactaInputId,
    workpaperType,
    fileUrl,
    centralizedData,
    isDataRequest = false,
    dataRequestStatusType = null,
  }
) {
  if (centralizedData) {
    if (centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.ERROR) {
      return theme.colors.errorText;
    }

    return theme.colors.gray2;
  }

  if (
    fileUrl &&
    workpaperType === WORKPAPER_TYPES.TRIFACTA &&
    (!trifactaInputId || trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS)
  ) {
    return theme.components.accordion.colors.warningText;
  } else if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      return theme.colors.warningText;
    }

    return theme.colors.errorText;
  } else if (status === WP_PROCESS_INPUT_STATUS.DONE) {
    return theme.components.accordion.colors.success;
  }

  if (isDataRequest) {
    if (dataRequestStatusType === Intent.SUCCESS) {
      return theme.components.accordion.colors.success;
    } else if (dataRequestStatusType === Intent.ERROR) {
      return theme?.colors?.errorText;
    }
  }

  return theme.colors.gray2;
}

/**
 * Return object with dataTable and dqc fields
 * @param {Object[]} outputs
 * @return { {dataTable: Object[], dqc: Object[]} }
 */

export function groupOutputsByType(outputs) {
  return outputs.reduce(
    (acum, item) => {
      if (
        /^(dqc)/gi.test(item.name) ||
        item.name.includes('Data Quality Check') ||
        item.name.includes('Data_Quality_Check')
      ) {
        acum.dqc.push(item);
      } else {
        acum.dataTable.push(item);
      }

      return acum;
    },
    {
      dataTable: [],
      dqc: [],
    }
  );
}

/**
 * Return object with alphabetically sorted outputs by kinds
 * @param {Object[]} outputs
 */

export function sortOutputsByTypeAlphabetically(outputs) {
  function sortByNameAlphabetically(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let name;
    if (nameA < nameB) {
      name = -1;
    } else if (nameA > nameB) {
      name = 1;
    } else {
      name = 0;
    }

    return name;
  }

  if (outputs?.dataTable?.length) {
    outputs.dataTable.sort(sortByNameAlphabetically);
  }

  if (outputs?.dqc?.length) {
    outputs.dqc.sort(sortByNameAlphabetically);
  }

  if (outputs?.tableau?.length) {
    outputs.tableau.sort(sortByNameAlphabetically);
  }

  return outputs;
}

/**
 * Confirms JR Step, which disables the Approve Transformaiton button on the UI.
 * This method is called from Step2 Actions, and will only be called if the API
 * was sucessfull to approve the JR Step.
 * @param {array} jrStepDetails - Array of Transformation Stpes with JR Steps.
 * @param {string} stepI - Step ID to Confirm
 * @param {boolean} all - If All JR Steps need to be confirmed.
 */
export function updateJRConfirmStatus(jrStepDetails, stepId, all = false) {
  return jrStepDetails.map(transformation => {
    return {
      ...transformation,
      judgementSteps: transformation.judgementSteps.map(jrStep => {
        if (jrStep.stepId === stepId) {
          return { ...jrStep, confirmed: true };
        }
        if (all) {
          return { ...jrStep, confirmed: true };
        }

        return jrStep;
      }),
    };
  });
}

export function getLatestRunDate(outputs) {
  return outputs
    ?.filter(o => o.runEndDate)
    .map(o => new Date(o.runEndDate).getTime())
    .filter(o => !Number.isNaN(o))
    .reduce((prev, current) => (current > prev ? current : prev), null);
}

export function checkLatestRunDate(outputs, dmtOutputs) {
  const latestWpRunDate = getLatestRunDate(outputs);
  const latestDMTRunDate = getLatestRunDate(dmtOutputs);

  if (!latestDMTRunDate) {
    return false;
  }

  if ((latestDMTRunDate && !latestWpRunDate) || latestWpRunDate < latestDMTRunDate) {
    return true;
  }

  return false;
}

/**
 * Get rid of all the junk from Trifacta Job Status and morph into a simpler progress
 * eng-ui already understands to minimize code changes
 * @param {object} progress
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function cleanTrifactaJobStatus(flowStatus) {
  const progress =
    flowStatus?.recipes.length > 0
      ? flowStatus.recipes
          .reduce((acc, curr) => {
            if (curr?.status) {
              acc.push(curr.status);
            }

            return acc;
          }, [])
          .reduce((acc, curr) => {
            acc[curr] = 1 + (acc[curr] || 0);

            return acc;
          }, {})
      : {};

  progress.totalJobs = flowStatus?.recipes.length;
  progress.percentage = (progress.finished / progress.totalJobs) * 100 || 0;
  progress.recipes = flowStatus?.recipes;

  if (progress.error > 0 && flowStatus.status === ProgressBarTypes.RUNNING) {
    progress.status = ProgressBarTypes.RUNNING_WITH_ERRORS;
  } else if (progress.error > 0 && flowStatus.status === ProgressBarTypes.FINISHED) {
    progress.status = ProgressBarTypes.ERROR;
  } else {
    progress.status = flowStatus?.status;
  }

  switch (progress.status) {
    case ProgressBarTypes.NOTSTARTED:
      progress.percentage = 0;
      progress.header = 'Pages_TrifactaWorkpaperProcess_Step2_Progress_NotStarted_Label';
      progress.subtitle = 'Pages_TrifactaWorkpaperProcess_Step2_Progress_NotStarted_Subtitle';
      progress.subtitleDisabled = 'Pages_TrifactaWorkpaperProcess_Step2_Progress_NotStarted_Subtitle_Disabled';
      break;
    case ProgressBarTypes.RUNNING:
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Running_Label';
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Running_Text_Trifacta_DataFlowRunning',
        'Pages_WorkpaperProcess_Step2_Progress_Running_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Running_Text_Trifacta_DetailedStatus',
      ];
      progress.percentage = progress.percentage > 10 ? progress.percentage : 10;
      break;
    case ProgressBarTypes.RUNNING_WITH_ERRORS:
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Running_With_Error_Label';
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Running_With_Errors_Text_Trifacta_DataFlowRunning',
        'Pages_WorkpaperProcess_Step2_Progress_Running_With_Errors_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Running_With_Errors_Text_Trifacta_Troubleshoot',
      ];
      progress.percentage = progress.percentage > 10 ? progress.percentage : 10;
      break;
    case ProgressBarTypes.ERROR:
      progress.percentage = progress.percentage > 10 ? progress.percentage : 10;
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Error_Label';
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Error_Text_Trifacta_DataFlowCompleted',
        'Pages_WorkpaperProcess_Step2_Progress_Error_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Error_Text_Trifacta_DataFlowTroubleshoot',
      ];
      break;
    case ProgressBarTypes.FINISHED:
      progress.percentage = 100;
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Finished_Label';
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_DataFlow',
        'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_DetailedStatus',
      ];
      break;
    case ProgressBarTypes.PARTIALLY_COMPLETE:
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Partially_Complete_Label';
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Partially_Complete_Text_Trifacta_DataFlow',
        'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Finished_Text_Trifacta_DetailedStatus',
      ];
      break;
    case ProgressBarTypes.QUEUED:
      progress.header = 'Pages_WorkpaperProcess_Step2_Progress_Queued_Label';
      progress.percentage = 5;
      progress.subtitle = [
        'Pages_WorkpaperProcess_Step2_Progress_Queued_Text_Trifacta_DataFlowRunning',
        'Pages_WorkpaperProcess_Step2_Progress_Queued_Text_Trifacta_ClickHere',
        'Pages_WorkpaperProcess_Step2_Progress_Queued_Text_Trifacta_DetailedStatus',
      ];
      break;
    default:
      break;
  }

  return {
    ...progress,
    jobsList: flowStatus?.recipes,
  };
}

/**
 *
 * @param {*} outputs
 */
export function areOutputsPresent(outputs) {
  if (outputs?.dataTable.length > 0 || outputs?.dqc.length > 0) {
    return true;
  }

  return false;
}

/**
 * Zip upload warnings
 * @param {*} zipupload
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function checkForZipUploadWarnings(inputs, zipSelected, zipFolders, t) {
  const inputsName = [];
  inputs.map(input => {
    return inputsName.push(input.name);
  });
  let inputWarnings = [];

  if (zipFolders?.length > 0 && zipSelected === 'append') {
    const allMatches = inputsName.every(inputName => zipFolders.includes(inputName));
    const someMatches = inputsName.some(inputName => zipFolders.includes(inputName));
    const fileDifference = zipFolders.filter(zipFile => !inputsName.includes(zipFile));
    const tableDifference = inputsName.filter(inputName => !zipFolders.includes(inputName));
    const nonZipInputs = inputs.filter(input => zipFolders.includes(input.name) && input?.uploadMethod !== 'zip');

    const warnings = [
      {
        type: 'warning',
        message: `${t('Component_Zip_Upload_Warning_All_Matches_Extra_Folder1')} ${fileDifference.join(', ')}. ${t(
          'Component_Zip_Upload_Warning_All_Matches_Extra_Folder2'
        )}`,
      },
      {
        type: 'warning',
        message: `${t('Component_Zip_Upload_Warning_Some_Matches1')} ${tableDifference.join(', ')}. ${t(
          'Component_Zip_Upload_Warning_Some_Matches2'
        )}`,
      },
      {
        type: 'error',
        message: t('Component_Zip_Upload_Warning_None_Matches'),
      },
      {
        type: 'error',
        message: `${t('Component_Zip_Upload_Warning_No_Input_Zip_Meta1')} ${nonZipInputs
          .map(input => input.name)
          .join(', ')} ${t('Component_Zip_Upload_Warning_No_Input_Zip_Meta2')}`,
      },
    ];
    if (allMatches) {
      if (zipFolders.length > inputsName.length) {
        inputWarnings = [warnings[0]];
      }
    } else if (someMatches) {
      if (zipFolders.length + 1 > inputsName.length) {
        inputWarnings = [warnings[0], warnings[1]];
      } else {
        inputWarnings = [warnings[1]];
      }
    } else {
      inputWarnings = [warnings[2]];
    }

    if (nonZipInputs.length) {
      inputWarnings.unshift(warnings[3]);
    }
  } else {
    inputWarnings = null;
  }

  return inputWarnings;
}

/**
 *
 * @param {*} jrSteps
 */
export function checkIfAllJRStepsApproved(trifactaJRSteps = []) {
  if (trifactaJRSteps.length > 0) {
    return trifactaJRSteps.every(recipe => recipe.JudgementSteps.every(jrStep => jrStep.confirmed === true));
  }

  return true;
}

export function generateUnconfirmJRStepsPayload(trifactaJRSteps = []) {
  if (trifactaJRSteps.length > 0) {
    return trifactaJRSteps.reduce((acc, curr) => {
      const unconfirmedSteps = curr.JudgementSteps.map(jrStep => {
        return {
          id: jrStep.stepId,
          dependencyId: jrStep.dependencyId,
          approve: false,
        };
      });

      acc.push(...unconfirmedSteps);

      return acc;
    }, []);
  }

  return [];
}

/**
 *
 * @param {*} zipFileStructure
 */
export function checkForXLSXFilesOnZip(zipFileStructure = [], t) {
  let XlsxWarningMessage = null;
  let hasSheets = false;

  if (zipFileStructure && zipFileStructure.length > 0) {
    zipFileStructure.forEach(folder => {
      hasSheets = folder.files.some(files => files.sheetName !== '');
    });
  }

  if (hasSheets) {
    XlsxWarningMessage = {
      type: Intent.WARNING,
      message: t('Component_Zip_Upload_Warning_Xlsx_File_On_Zip'),
    };
  }

  return XlsxWarningMessage;
}

export function checkForDuplicateFiles(zipFileStructure = [], t) {
  let duplicateMessage = null;
  let files = [];
  let duplicateFiles = [];

  if (zipFileStructure && zipFileStructure.length > 0) {
    zipFileStructure.forEach(folder => {
      const fileNames = [];
      const fullFileNames = [];
      folder.files.forEach(file => {
        fullFileNames.push(file.fileName);
        fileNames.push(file.fileName.replace(/\..+$/, ''));
      });

      files = fileNames.filter((item, index) => fileNames.indexOf(item) !== index);
      duplicateFiles = fullFileNames.filter(element => files.includes(element.replace(/\..+$/, '')));
    });
  }

  if (duplicateFiles.length) {
    duplicateMessage = {
      type: Intent.ERROR,
      message: `${t('Component_Zip_Upload_Duplicate_Files1')} ${duplicateFiles.join(', ')}. ${t(
        'Component_Zip_Upload_Duplicate_Files2'
      )}
      `,
    };
  }

  return duplicateMessage;
}
