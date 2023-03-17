import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import StagingService from '../../../services/staging.service';
import * as FileHelper from '../../../utils/fileHelper';
import { downloadFile, getEngagementFolders } from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { StagingActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../errors/actionTypes';
import ServerError from '../../../utils/serverError';

window.scrollTo = jest.fn();

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
});

describe('staging actions', () => {
  beforeEach(() => {
    mockStore.clearActions();
  });

  it('handle getEngagementFolders with success flow ', async () => {
    const clientId = '1234-5678-9012-3456';
    const engagementId = '1234-1234-1234-1234';
    const engagementFolders = ['Folder1', 'Folder2'];
    const expectedActions = [
      { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS },
      { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_SUCCESS, payload: engagementFolders },
    ];

    StagingService.getEngagementFolders = jest.fn().mockImplementationOnce(() => {
      return engagementFolders;
    });

    await mockStore.dispatch(getEngagementFolders(clientId, engagementId));

    StagingService.getEngagementFolders.mockReset();

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  // it('handle getEngagementFolders with error flow', async () => {
  //     const clientId = '1234-5678-9012-3456';
  //     const engagementId = '1234-1234-1234-1234';
  //     const error = new ServerError({ status: 500, message: 'Test message error', key: 123 });
  //     const expectedActions = [
  //         { type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS },
  //         {
  //             type: StagingActionTypes.GET_ENGAGEMENT_FOLDERS_ERROR,
  //         },
  //         {
  //             type: ErrorActionTypes.ADD_GLOBAL_ERROR,
  //             payload: error,
  //         },
  //     ];

  //     StagingService.getEngagementFolders = jest.fn().mockImplementationOnce(() => {
  //         throw error;
  //     });

  //     await mockStore.dispatch(getEngagementFolders(clientId, engagementId));
  //     StagingService.getEngagementFolders.mockReset();
  //     expect(mockStore.getActions()).toEqual(expectedActions);
  // });

  it('handle downloadFile with success flow', async () => {
    const filePath = '/path/to/file';
    const fileName = 'test';
    const fileExtension = 'csv';
    const fileType = 'text/csv';
    const expectedActions = [
      { type: StagingActionTypes.DOWNLOAD_FILE },
      { type: StagingActionTypes.DOWNLOAD_FILE_SUCCESS },
    ];

    StagingService.stagingGetFileDL = jest.fn().mockImplementationOnce(() => {
      return null;
    });
    jest.spyOn(FileHelper, 'downloadFileFromStream').mockImplementation(() => {});

    await mockStore.dispatch(downloadFile(filePath, fileName, fileExtension, fileType));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle downloadFile with error flow', async () => {
    const filePath = '/path/to/file';
    const fileName = 'test';
    const fileExtension = 'csv';
    const fileType = 'text/csv';
    const expectedError = new ServerError({ status: 500, message: 'Test message error', key: 123 });
    const expectedActions = [
      { type: StagingActionTypes.DOWNLOAD_FILE },
      { type: ErrorActionTypes.ADD_GLOBAL_ERROR, payload: expectedError },
      { type: StagingActionTypes.DOWNLOAD_FILE_ERROR },
    ];

    StagingService.stagingGetFileDL = jest.fn().mockImplementationOnce(() => {
      throw expectedError;
    });
    jest.spyOn(FileHelper, 'downloadFileFromStream').mockImplementation(() => {});

    await mockStore.dispatch(downloadFile(filePath, fileName, fileExtension, fileType));

    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
