import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import analyticsUIService from '../../services/analytics-ui.service';
import WorkpaperService from '../../services/workpaper.service';

import * as TelemetryService from '../../app/appInsights/TelemetryService';

import { cloneBundleFromInputDataRequest } from './actions';

import { Map as ImmutableMap } from 'immutable';
import { WPProcessActionTypes } from './actionTypes';
import { ErrorActionTypes } from '../errors/actionTypes';

const mockInputId = '136483d2-8d2c-45f3-b224-6d68ed475386';
const mockFileUrl = '/cortexfilesystem/engagement/mockPath';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  wpProcess: {
    step1: ImmutableMap({
      inputs: [
        {
          id: mockInputId,
          nodeId: '5ecba93d8b92e80163dd2f93',
          fileSchema: [],
          error: null,
          fileName: 'Table_Upload',
          fileHistory: ['Table_Upload'],
          status: 'done',
          name: 'Table_Upload',
          fileUrl: mockFileUrl,
          required: false,
          TrifactaInputId: 645,
          centralizedData: { lastUpdated: '2020-11-02T18:57:32.790Z', status: 'inprogress' },
        },
      ],
    }),
  },
});

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';

window.scrollTo = jest.fn();

describe('workpaperProcess step1 actions', () => {
  beforeEach(() => {
    jest.spyOn(TelemetryService, 'trackEvent').mockImplementation(() => {});
    mockStore.clearActions();
  });

  it('handles clone bundles from input datarequest', async () => {
    const result = {
      id: '2324234233',
      chainId: null,
      clientIds: null,
      isLatest: null,
      centralizedDSUpdate: false,
      name: 'test',
    };

    analyticsUIService.cloneBundleFromInputDataRequest = jest.fn().mockImplementation(() => {
      return result;
    });
    WorkpaperService.getWorkpaperDMTs = jest.fn().mockImplementation(() => {
      return true;
    });
    const expectedActions = [
      {
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_REQUEST,
        payload: { inputId: '234342' },
      },
      {
        type: WPProcessActionTypes.GET_WORKPAPER_DMTS,
      },
      {
        type: WPProcessActionTypes.GET_WORKPAPER_DMTS_SUCCESS,
        payload: true,
      },
      {
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_SUCCESS,
        payload: { inputId: '234342' },
      },
    ];

    await mockStore.dispatch(cloneBundleFromInputDataRequest('1235343', '234342'));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE --should handle clone bundles from input datarequest error', async () => {
    const expectedActions = [
      {
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_REQUEST,
        payload: { inputId: '234342' },
      },
      {
        type: WPProcessActionTypes.CLONE_BUNDLE_FROM_INPUT_DR_ERROR,
        payload: { inputId: '234342' },
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: userError,
      },
    ];
    analyticsUIService.cloneBundleFromInputDataRequest = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(cloneBundleFromInputDataRequest('1235343', '234342'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
