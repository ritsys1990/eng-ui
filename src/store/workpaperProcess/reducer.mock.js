import { initialState } from './reducer';
import { WPProcessActionTypes } from './actionTypes';
import { Map as ImmutableMap } from 'immutable';
import {
  getWpDetailsMock,
  getWpStatusMock,
  getWpTemplateMock,
  actionEngagementCloseoutMock,
  publishedEngagementCloseoutMock,
} from '../../services/mocks/tests/wp.mock';

export const workpaperProcessMock = {
  initialState,
  GetData: {
    expectedState: initialState.merge({
      isLoading: true,
    }),
    action: { type: WPProcessActionTypes.GET_DATA },
  },
  GetDataSuccess: {
    expectedState: initialState.merge({
      isLoading: false,
      workpaper: [getWpDetailsMock()],
      template: [getWpTemplateMock()],
      wpStatus: [getWpStatusMock()],
      readOnlyfromWP:
        getWpDetailsMock().status === 'Published' ||
        getWpDetailsMock().reviewStatus === 'Completed' ||
        publishedEngagementCloseoutMock().includes(actionEngagementCloseoutMock()),
    }),
    action: {
      type: WPProcessActionTypes.GET_DATA_SUCCESS,
      payload: {
        latestTemplate: null,
        details: [getWpDetailsMock()],
        template: [getWpTemplateMock()],
        wpStatus: [getWpStatusMock()],
        checkEngagementCloseout: actionEngagementCloseoutMock(),
      },
    },
  },
  GetDataError: {
    expectedState: initialState.merge({
      isLoading: false,
      data: null,
    }),
    action: { type: WPProcessActionTypes.GET_DATA_ERROR },
  },
  GET_WORKPAPER: {
    expectedState: initialState.merge({
      isFetchingWorkpaper: true,
    }),
    action: { type: WPProcessActionTypes.GET_WORKPAPER },
  },
  GET_WORKPAPER_SUCCESS: {
    expectedState: initialState.merge({
      isFetchingWorkpaper: false,
      workpaper: [getWpDetailsMock()],
      readOnlyfromWP: getWpDetailsMock().status === 'Published' || getWpDetailsMock().reviewStatus === 'Completed',
    }),
    action: {
      type: WPProcessActionTypes.GET_WORKPAPER_SUCCESS,
      payload: { details: [getWpDetailsMock()] },
    },
  },
  GET_WORKPAPER_ERROR: {
    expectedState: initialState.merge({
      isFetchingWorkpaper: false,
      data: null,
    }),
    action: { type: WPProcessActionTypes.GET_WORKPAPER_ERROR },
  },
  Reset: {
    expectedState: initialState.merge({
      data: null,
      isLoading: true,
    }),
    action: { type: WPProcessActionTypes.RESET },
  },
  EXPORT_TRIFACTA_WORKPAPER: {
    expectedState: initialState.merge({
      buttonLoading: true,
    }),
    action: { type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER },
  },
  EXPORT_TRIFACTA_WORKPAPER_SUCCESS: {
    expectedState: initialState.merge({
      buttonLoading: false,
    }),
    action: { type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_SUCCESS },
  },
  EXPORT_TRIFACTA_WORKPAPER_ERROR: {
    expectedState: initialState.merge({
      buttonLoading: false,
    }),
    action: { type: WPProcessActionTypes.EXPORT_TRIFACTA_WORKPAPER_ERROR },
  },
  GET_CHILD_WORKPAPERS_STATUS_REQUEST: {
    expectedState: initialState.merge({
      isChildWorkpapersStatusCompleted: false,
    }),
    action: { type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST },
  },
  GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS: {
    expectedState: initialState.merge({
      isChildWorkpapersStatusCompleted: true,
    }),
    action: { type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_SUCCESS, payload: true },
  },
  GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR: {
    expectedState: initialState.merge({
      isChildWorkpapersStatusCompleted: false,
    }),
    action: { type: WPProcessActionTypes.GET_CHILD_WORKPAPERS_STATUS_REQUEST_ERROR },
  },
  cloneBundleFromInputDataRequest: {
    expectedState: initialState.merge({
      isCloningBundle: ImmutableMap({ 12333: true }),
    }),
    action: {
      type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_REQUEST,
      payload: { inputId: '12333', cloning: true },
    },
  },
  cloneBundleFromInputDataRequestSuccess: {
    expectedState: initialState.merge({
      isCloningBundle: ImmutableMap({ 12333: false }),
    }),
    action: {
      type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_SUCCESS,
      payload: { inputId: '12333', cloning: false },
    },
  },

  cloneBundleFromInputDataRequestError: {
    expectedState: initialState.merge({
      isCloningBundle: ImmutableMap({ 12333: false }),
    }),
    action: {
      type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_ERROR,
      payload: { inputId: '12333', cloning: false },
    },
  },
};
