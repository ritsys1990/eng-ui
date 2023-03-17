import { Map as ImmutableMap } from 'immutable';
import { isStep1Completed } from '../../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';
import { NotebookWPStep1ActionTypes } from './actionTypes';

export const initialState = ImmutableMap({
  input: null,
  fetchingInput: false,
  inputs: [],
  isAttachingFile: false,
  preview: {
    data: {},
    schema: {},
  },
  isFetchingPreview: false,
  isFileAttached: false,
});

export default function reduce(state = initialState, action = {}) {
  switch (action.type) {
    case NotebookWPStep1ActionTypes.GET_INPUT:
      return state.merge({
        fetchingInput: true,
      });

    case NotebookWPStep1ActionTypes.GET_INPUT_SUCCESS:
      return state.merge({
        fetchingInput: false,
        input: action.payload,
      });

    case NotebookWPStep1ActionTypes.GET_INPUT_ERROR:
      return state.merge({
        input: null,
        fetchingInput: false,
      });

    case NotebookWPStep1ActionTypes.RESET_INPUT:
      return state.merge({
        input: null,
      });

    case NotebookWPStep1ActionTypes.ATTACH:
    case NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE:
      return state.merge({
        isAttachingFile: true,
        isFileAttached: false,
      });

    case NotebookWPStep1ActionTypes.ATTACH_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isAttachingFile: false,
      });

    case NotebookWPStep1ActionTypes.ATTACH_ERROR:
    case NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE_ERROR:
      return state.merge({
        isAttachingFile: false,
        isFileAttached: false,
      });

    case NotebookWPStep1ActionTypes.SAVE_FILE_FOR_DATA_TABLE_SUCCESS:
      return state.merge({
        inputs: action.payload,
        isAttachingFile: false,
        completed: isStep1Completed(action.payload),
        isFileAttached: true,
      });

    case NotebookWPStep1ActionTypes.GET_PREVIEW:
      return state.merge({
        isFetchingPreview: true,
        preview: {
          data: {},
          schema: {},
        },
      });

    case NotebookWPStep1ActionTypes.GET_PREVIEW_SUCCESS:
      const { data, schema } = action.payload;

      const header = schema.map(item => item.name);

      const transformedData = data.map(item =>
        Object.fromEntries(Object.entries(item).map(([key, value]) => [key.toLowerCase(), value]))
      );

      const columns = transformedData.map(item => header.map(h => item[h.toLowerCase()]));

      return state.merge({
        isFetchingPreview: false,
        preview: {
          data: [header, ...columns],
        },
      });

    case NotebookWPStep1ActionTypes.GET_PREVIEW_ERROR:
      return state.merge({
        isFetchingPreview: false,
        preview: {
          data: {},
          schema: {},
        },
      });

    default:
      return state;
  }
}
