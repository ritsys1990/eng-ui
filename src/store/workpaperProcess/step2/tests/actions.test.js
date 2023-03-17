import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import analyticsService from '../../../../services/analytics-ui.service';
import dataWranglerService from '../../../../services/data-wrangler.service';
import { importFlow } from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { WPProcessStep2ActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../../errors/actionTypes';
import { v4 as uuidv4 } from 'uuid';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

window.scrollTo = jest.fn();

const userError = new Error('User Defined ERROR');
userError.key = 'userDefinedError Key';

const workpaperId = '11111111-8d2c-45f3-b224-6d68ed475386';
const flowId = '13456';

const parseError = error => {
  const parsedError = error;
  parsedError.key = parsedError.key || uuidv4();

  return parsedError;
};

describe('Workpaperprocess step2 actions', () => {
  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle import Data Flow success action ', async () => {
    const expectedActions = [
      { type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW },
      { type: WPProcessStep2ActionTypes.GET_DATA },
      {
        type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_SUCCESS,
        payload: true,
      },
    ];
    analyticsService.updateWorkpaperSetupStatus = jest.fn().mockImplementationOnce(() => {
      return true;
    });
    dataWranglerService.importFlow = jest.fn().mockImplementationOnce(() => {
      return true;
    });
    await mockStore.dispatch(importFlow(workpaperId, flowId, {}, null));
    expect(mockStore.getActions().length).toEqual(expectedActions.length);
  });

  it('handle import Data Flow error action ', async () => {
    const expectedActions = [
      { type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW },
      {
        type: ErrorActionTypes.ADD_IMPORT_FLOW_ERROR,
        payload: parseError(userError),
      },
      { type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_ERROR, payload: userError },
      { type: WPProcessStep2ActionTypes.PROCESS_IMPORT_FLOW_INITIATE_POLLING_RESET },
    ];

    analyticsService.updateWorkpaperSetupStatus = jest.fn().mockImplementationOnce(() => {
      throw userError;
    });
    dataWranglerService.importFlow = jest.fn().mockImplementationOnce(() => {
      return true;
    });
    await mockStore.dispatch(importFlow(workpaperId, flowId, {}, null));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
