import { initialState } from '../reducer';
import { AttachFilesActions } from '../actionTypes';
import { publishedDMs } from './mockData';

export const attachFilesMockReducer = {
  initialState,
  fetchPublishedDatamodels: {
    expectedState: initialState.merge({
      isLoading: true,
    }),
    action: { type: AttachFilesActions.GET_ALL_DATAMODELS_REQUEST },
  },
  fetchPublishedDatamodelsError: {
    expectedState: initialState.merge({
      isLoading: false,
    }),
    action: { type: AttachFilesActions.GET_ALL_DATAMODELS_ERROR },
  },
  fetchPublishedDatamodelsSuccess: {
    expectedState: initialState.merge({
      isLoading: false,
      datamodelTreeData: publishedDMs.items,
    }),
    action: { type: AttachFilesActions.GET_ALL_DATAMODELS_SUCCESS, payload: publishedDMs.items },
  },
};
