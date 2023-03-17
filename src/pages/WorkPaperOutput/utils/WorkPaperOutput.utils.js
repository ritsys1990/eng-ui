import dayjs from 'dayjs';
import { jeStatus } from '../constants/WorkPaperOutput.constants';
import { IconTypes } from 'cortex-look-book';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';

/**
 * Return output meta info
 * @param {Array} outputs
 * @param {String} outputId
 * @return {Object[]} outputInfo
 */

export function findCurrentOutputInfo(outputs, outputId) {
  if (outputId && outputs?.length) {
    const outputDataTable = outputs.find(output => output.id === outputId);
    if (outputDataTable) {
      return outputDataTable;
    }
  }

  return null;
}

/**
 * Return ID of PREVIOUS Output for navigating
 * @param {Array} outputsIdList
 * @param {String} currentOutputId
 * @return {String} id
 */

export function findIdPreviousOutput(outputsIdList, currentOutputId) {
  let prevIndex = 0;
  if (outputsIdList.length > 1) {
    for (let index = 0; index < outputsIdList.length; index++) {
      if (currentOutputId === outputsIdList[index]) {
        prevIndex = index === 0 ? outputsIdList.length - 1 : index - 1;
        break;
      }
    }

    return outputsIdList[prevIndex];
  }

  return null;
}

/**
 * Return ID of NEXT Output for navigating
 * @param {Array} outputsIdList
 * @param {String} currentOutputId
 * @return {String} id
 */

export function findIdNextOutput(outputsIdList, currentOutputId) {
  let nextIndex = 0;
  if (outputsIdList.length > 1) {
    for (let index = 0; index < outputsIdList.length - 1; index++) {
      if (currentOutputId === outputsIdList[index]) {
        nextIndex = index === outputsIdList.length - 1 ? 0 : index + 1;
        break;
      }
    }

    return outputsIdList[nextIndex];
  }

  return null;
}

/**
 * Return output cell value for render
 * @param {string|number} value
 * @param {Object} col
 * @return {String}
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export function mapOutputRenderer(value, col, wpType = WORKPAPER_TYPES.CORTEX) {
  if (col?.type === 'timestamp') {
    let format = 'MM/DD/YYYY';
    const prepValue = value ? value.replace('T', ' ').replace('.000Z', '') : null;

    if (col.dateFormat) {
      format = col.dateFormat.replace(/dd/g, 'DD').replace(/y/g, 'Y');
      if (format.indexOf('hh') > -1) {
        format += ' A';
      }
    }

    const dateValue = prepValue ? dayjs(prepValue).format(format) : null;

    return dateValue === null ? 'null' : dateValue;
  }

  switch (wpType) {
    case WORKPAPER_TYPES.CORTEX:
      if (value === 0) {
        return '0';
      }
      if (col?.type === 'boolean') {
        return `${value || 'false'}`;
      }
      if (value === '' || !value || String(value).toLowerCase() === 'null') {
        return 'null';
      }
      break;
    case WORKPAPER_TYPES.TRIFACTA:
      if (value === null) {
        return 'null';
      }
      break;
    default:
      break;
  }

  return value;
}

/**
 * Returns the color to be displayed in the JE status icon
 * @param {string} status
 */
export const getJeStatusColor = status => {
  switch (status) {
    case jeStatus.COMPLETED:
      return 'green';
    case jeStatus.FAILED:
      return 'red';
    case jeStatus.REQUEST_ACCEPTED:
      return 'orange';
    default:
      return 'blue';
  }
};

/**
 * Returns the icon type to be displayed in the JE status icon
 * @param {string} status
 */
export const getJeStatusIcon = status => {
  switch (status) {
    case jeStatus.COMPLETED:
      return IconTypes.CIRCLE_CHECKMARK;
    case jeStatus.FAILED:
    case jeStatus.REQUEST_ACCEPTED:
    case jeStatus.REQUEST_SENT:
    default:
      return IconTypes.MINUS_CIRCLE;
  }
};

/**
 * Returns the row count with
 * @param {string} rowCount
 */
export function getLocalizedRowCount(totalCount) {
  let count;
  if (totalCount != null) {
    count = totalCount;
  } else {
    count = 0;
  }
  let rowCount = parseInt(count, 10);
  rowCount = !Number.isNaN(Number(rowCount)) ? rowCount : null;
  if (rowCount != null) {
    return rowCount.toLocaleString('en-US');
  }

  return rowCount;
}
