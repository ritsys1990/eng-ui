import { initialState } from '../reducer';
import { StagingActionTypes } from '../actionTypes';
import { getEngagementFolders } from '../../../services/mocks/tests/staging.mock';

export const stagingMock = {
  initialState,
  GetEngagementFolders: {
    expectedState: initialState.merge({
      engagementFolders: [],
    }),
    action: { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS },
  },
  GetEngagementFoldersSuccess: {
    expectedState: initialState.merge({
      engagementFolders: getEngagementFolders(),
    }),
    action: { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_SUCCESS, payload: getEngagementFolders() },
  },
  GetEngagementFoldersError: {
    expectedState: initialState.merge({
      engagementFolders: [],
    }),
    action: { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_ERROR },
  },
};
