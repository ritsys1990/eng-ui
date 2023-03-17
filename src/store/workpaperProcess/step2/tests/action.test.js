import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import analyticsUIService from '../../../../services/analytics-ui.service';

import { v4 as uuidv4 } from 'uuid';
import { initialState as step2InitialState } from '../reducer';

import { autoRunWorkpaper } from '../actions';

import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep2ActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../../errors/actionTypes';

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
          file: { url: mockFileUrl },
          required: false,
          TrifactaInputId: 645,
          centralizedData: { lastUpdated: '2020-11-02T18:57:32.790Z', status: 'inprogress' },
        },
      ],
    }),
    step2: step2InitialState,
  },
});

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';

window.scrollTo = jest.fn();

const parseError = error => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('workpaperProcess step1 actions', () => {
  beforeEach(() => {
    mockStore.clearActions();
  });

  it('should automatically run workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_REQUEST },
      { type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_SUCCESS, payload: 'mock id' },
    ];

    analyticsUIService.autoRunWorkpaper = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(autoRunWorkpaper('mock id'));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('FAILURE CASE -- should automatically run workpaper', async () => {
    const expectedActions = [
      { type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_REQUEST },
      {
        type: WPProcessStep2ActionTypes.AUTO_RUN_WORKPAPER_ERROR,
        payload: { workpaperId: 'mock id' },
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: parseError(userError),
      },
    ];

    analyticsUIService.autoRunWorkpaper = jest.fn().mockImplementation(() => {
      throw userError;
    });

    await mockStore.dispatch(autoRunWorkpaper('mock id'));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
