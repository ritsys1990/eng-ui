import { Map as ImmutableMap } from 'immutable';
import { Intent } from 'cortex-look-book';
import { isEqual } from 'lodash';
import { GenWBStatus, GenWBStep } from 'src/utils/workbooks.const';
import { NotebookWPStep3ActionTypes } from './actionTypes';
import { groupOutputsByType } from '../../../pages/WorkPaperProcess/utils/WorkPaperProcess.utils';

export const initialOutputs = {
  dataTable: [],
  dqc: [],
  tableau: [],
  tableau_cloned: false,
};

export const initialState = ImmutableMap({
  loading: false,
  outputs: ImmutableMap({}),
  syncingOutputs: false,
  ungroupedOutputs: ImmutableMap({}),
  workbooks: null,
  publishStatus: null,
  generateWorkbooksState: null,
  isFetchingOutput: false,
  output: null,
});

export default function reduce(state = initialState, action = {}) {
  let workpaperNotebookOutputs;
  let workpaperNotebookUngroupedOutputs;
  // eslint-disable-next-line sonarjs/max-switch-cases
  switch (action.type) {
    case NotebookWPStep3ActionTypes.GET_OUTPUTS:
      workpaperNotebookOutputs = {};
      workpaperNotebookOutputs[action.payload.workpaperId] = { ...initialOutputs };

      return state.merge({
        loading: true,
        syncingOutputs: action.payload.workpaperId,
        outputs: state.get('outputs').merge(workpaperNotebookOutputs),
      });

    case NotebookWPStep3ActionTypes.GET_OUTPUTS_SUCCESS:
      workpaperNotebookOutputs = {};
      workpaperNotebookUngroupedOutputs = {};
      Object.keys(action.payload).forEach(key => {
        workpaperNotebookOutputs[key] = {
          tableau: [],
          tableau_cloned: false,
          ...groupOutputsByType(action.payload[key]),
        };
      });
      workpaperNotebookUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperNotebookOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperNotebookUngroupedOutputs),
      });

    case NotebookWPStep3ActionTypes.GET_OUTPUTS_ERROR:
      workpaperNotebookOutputs = {};
      workpaperNotebookOutputs[action.payload.workpaperId] = {
        dataTable: [],
        dqc: [],
        tableau: [],
        tableau_cloned: false,
      };

      workpaperNotebookUngroupedOutputs = {};
      workpaperNotebookUngroupedOutputs[action.payload.workpaperId] = action.payload.outputs;

      return state.merge({
        loading: false,
        syncingOutputs: false,
        outputs: state.get('outputs').merge(workpaperNotebookOutputs),
        ungroupedOutputs: state.get('ungroupedOutputs').merge(workpaperNotebookUngroupedOutputs),
      });

    case NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW:
      return state.merge({
        isFetchingOutput: true,
      });

    case NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW_SUCCESS:
      return state.merge({
        isFetchingOutput: false,
        output: action.payload,
      });

    case NotebookWPStep3ActionTypes.GET_OUTPUT_PREVIEW_ERROR:
      return state.merge({
        isFetchingOutput: false,
      });

    case NotebookWPStep3ActionTypes.GET_WORKBOOKS:
      return state.merge({
        fetchingWorkbooks: true,
      });
    case NotebookWPStep3ActionTypes.GET_WORKBOOKS_SUCCESS:
      return state.merge({
        fetchingWorkbooks: false,
        workbooks: action.payload,
        publishStatus: null,
      });
    case NotebookWPStep3ActionTypes.GET_WORKBOOKS_ERROR:
      return state.merge({
        fetchingWorkbooks: false,
        workbooks: null,
      });

    case NotebookWPStep3ActionTypes.CLONE_WORKBOOKS:
      return state.merge({
        cloningState: null,
        cloning: true,
      });
    case NotebookWPStep3ActionTypes.CLONE_WORKBOOKS_SUCCESS:
      const currentClonedOutputs = state.get('outputs').get(action.payload.workpaperId) || {};
      currentClonedOutputs['tableau_cloned'] = true;

      const tempClonedOutputs = {
        [action.payload.workpaperId]: currentClonedOutputs,
      };

      return state
        .merge({
          cloning: false,
          cloningState: Intent.SUCCESS,
          outputs: state.get('outputs').merge(tempClonedOutputs),
        })
        .merge({
          workbooks: action.payload.workbooks,
        });
    case NotebookWPStep3ActionTypes.CLONE_WORKBOOKS_ERROR:
      return state.merge({
        cloningState: Intent.ERROR,
        cloning: false,
      });

    case NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS:
    case NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_PROGRESS:
    case NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_SUCCESS:
    case NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_TABLEMISMATCH_ERROR:
    case NotebookWPStep3ActionTypes.PUBLISH_WORKBOOKS_ERROR:
      return state.merge({
        publishStatus: action.payload,
      });

    case NotebookWPStep3ActionTypes.GENERATE_WORKBOOKS:
      return state.merge({
        generateWorkbooksState: { status: GenWBStatus.Progress, step: GenWBStep.Queueing },
      });
    case NotebookWPStep3ActionTypes.GENERATE_WORKBOOKS_STATE:
      if (isEqual(action.payload, state.get('generateWorkbooksState'))) {
        return state;
      }

      return state.merge({
        generateWorkbooksState: action.payload,
      });
    case NotebookWPStep3ActionTypes.GENERATE_WORKBOOKS_ERROR:
      return state.merge({
        generateWorkbooksState: {
          ...state.get('generateWorkbooksState'),
          status: GenWBStatus.Error,
          details: action.payload,
        },
      });
    case NotebookWPStep3ActionTypes.GENERATE_WORKBOOKS_FETCH_ERROR:
      return state.merge({
        generateWorkbooksState: {
          ...state.get('generateWorkbooksState'),
          fetchError: (state.get('generateWorkbooksState')?.fetchError || 0) + 1,
          details: action.payload,
        },
      });

    case NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS:
      return state.merge({
        loading: true,
      });
    case NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS_SUCCESS:
      return state.merge({
        loading: false,
        workbooks: [],
      });
    case NotebookWPStep3ActionTypes.REMOVE_WORKBOOKS_ERROR:
      return state.merge({
        loading: false,
      });
    default:
      return state;
  }
}
