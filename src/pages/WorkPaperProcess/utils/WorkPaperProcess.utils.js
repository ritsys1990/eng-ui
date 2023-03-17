import { WP_PROCESS_INPUT_STATUS, WP_PROCESS_INPUT_ERRORS } from '../constants/WorkPaperProcess.const';

import { isAnyDataRequestScheduleDone } from '../../../components/WorkPaperProcess/components/InputDataRequestStatus/utils/InputDataRequestStatus.utils';
/**
 * Return status data by key, to avoid additional mapping
 * @param {String} status
 * @param {String} key
 */

export function inputStatusProgressDataByKey(status, key, error) {
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

    case null:
    default:
      data = {
        type: 'default',
        progress: 0,
      };
      break;
  }

  if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      data.type = 'warning';
    } else {
      data.type = 'error';
    }
  }

  return data[key];
}

/**
 * Return translation key by status, to avoid additional mapping
 * @param {String} status
 */

export function showStatusTextByStatus(status, error) {
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
  switch (status) {
    case WP_PROCESS_INPUT_STATUS.UPLOADING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextUploading';

    case WP_PROCESS_INPUT_STATUS.MAPPING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextMapping';

    case WP_PROCESS_INPUT_STATUS.APPENDING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextAppending';

    case WP_PROCESS_INPUT_STATUS.VALIDATING:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextValidating';

    case WP_PROCESS_INPUT_STATUS.DONE:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextDone';

    default:
      return 'Pages_WorkpaperProcess_Step1_Table_InputStatusTextGenericError';
  }
}

/**
 * Return color for text, to avoid additional mapping
 * @param {String} status
 * @param {Object} error
 */

export function inputStatusColorByStatus(status, error, theme) {
  if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      return theme.colors.warningText;
    }

    return theme.colors.errorText;
  }

  switch (status) {
    case WP_PROCESS_INPUT_STATUS.UPLOADING:
      return theme.colors.warningText;

    case WP_PROCESS_INPUT_STATUS.MAPPING:
    case WP_PROCESS_INPUT_STATUS.APPENDING:
    case WP_PROCESS_INPUT_STATUS.VALIDATING:
      return theme.colors.infoText;

    case WP_PROCESS_INPUT_STATUS.DONE:
      return theme.colors.successText;

    default:
      return undefined;
  }
}

/**
 * Return color for icon, to avoid additional mapping
 * @param {*} status
 * @param {*} error
 */
export function inputIconColorByStatus(status, error, theme) {
  if (error) {
    if (error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING) {
      return theme.colors.warningText;
    }

    return theme.colors.errorText;
  } else if (status === WP_PROCESS_INPUT_STATUS.DONE) {
    return theme.components.accordion.colors.success;
  }

  return theme.colors.gray2;
}

/**
 * Return object with dataTable and dqc fields
 * @param {Object[]} outputs
 * @return { {dataTable: Object[], dqc: Object[]} }
 */

export function groupOutputsByType(outputs) {
  if (outputs) {
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

  return { dataTable: [], dqc: [] };
}

/**
 * Return object with alphabetically sorted outputs by kinds
 * @param {Object[]} outputs
 */

export function sortOutputsByTypeAlphabetically(outputs) {
  function sortByNameAlphabetically(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    }

    return 0;
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
