import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import childWorkpaperService from '../../../services/child-workpaper.service';
import workpaperService from '../../../services/workpaper.service';
import {
  getChildWorkPapers,
  saveWorkPaperFilterData,
  deleteChildWorkPaper,
  generateChildWorkpapers,
  getChildWpColumns,
} from '../actions';
import { Map as ImmutableMap } from 'immutable';
import { ChildWorkpaperActionTypes } from '../actionTypes';
import { ErrorActionTypes } from '../../errors/actionTypes';
import ServerError from '../../../utils/serverError';

const mockStore = configureMockStore([thunk])({
  settings: ImmutableMap({
    language: {},
  }),
  childWorkPapersList: ImmutableMap({
    id: '123',
    name: 'Test name',
    description: 'Test description',
    status: 'InPRogress',
    childWorkPaperStatus: 'Not Generated',
  }),
});

const mockWorkpaperId = '1234-5678-9012-3456';
const mockErrorMessage = 'Test message error';

describe('workpaper actions', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('get child workpapers success flow ', async () => {
    const parentId = mockWorkpaperId;
    const childList = [
      {
        id: '123',
        name: 'Test name',
        description: 'Test description',
        status: 'InPRogress',
        childWorkPaperStatus: 'Not Generated',
      },
    ];
    const expectedActions = [
      { type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_REQUEST },
      { type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_SUCCESS, payload: childList },
      { type: ChildWorkpaperActionTypes.GET_MAX_CHILD_WORKPAPERS_LIMIT, payload: childList.length },
      { type: ChildWorkpaperActionTypes.GET_MAX_GENERATEOUTPUT_CHILD_WORKPAPERS_LIMIT, payload: childList.length },
    ];

    childWorkpaperService.getChildWorkPapers = jest.fn().mockImplementationOnce(() => {
      return childList;
    });
    workpaperService.getWorkPaperConfigByKey = jest.fn().mockImplementation(() => {
      return childList.length;
    });

    await mockStore.dispatch(getChildWorkPapers(parentId));

    childWorkpaperService.getChildWorkPapers.mockReset();
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle save child workpaper filter with success flow ', async () => {
    const filterData = {
      engagementId: '1122',
      parentWorkpaperId: '11234',
      childWorkpaperName: 'test',
      description: 'description',
      filters: [
        {
          id: 1234,
          tableId: '101',
          tableName: 'table1',
          columnName: 'columnName1',
          filterValue: 'test1',
        },
      ],
    };

    const expectedActions = [
      { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_REQUEST },
      { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_SUCCESS },
    ];

    childWorkpaperService.saveChildWpFilterData = jest.fn().mockImplementationOnce(() => {
      return true;
    });

    await mockStore.dispatch(saveWorkPaperFilterData(filterData));

    childWorkpaperService.saveChildWpFilterData.mockReset();

    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('get child workpapers error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: ChildWorkpaperActionTypes.GET_CHILD_WORKPAPERS_ERROR,
        payload: { err: error },
      },
    ];

    childWorkpaperService.getChildWorkPapers = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(getChildWorkPapers());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('save child workpaper filter with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const expectedActions = [
      { type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_REQUEST },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      {
        type: ChildWorkpaperActionTypes.SAVE_CHILD_WORKPAPER_FILTER_FAILURE,
        payload: { err: error },
      },
    ];

    childWorkpaperService.saveChildWpFilterData = jest.fn().mockImplementationOnce(() => {
      throw error;
    });

    await mockStore.dispatch(saveWorkPaperFilterData());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
  it('handle deleteChildwork paper with success flow ', async () => {
    const expectedActions = [
      { type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER },
      {
        type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER_SUCCESS,
      },
    ];

    childWorkpaperService.deleteChildWorkpaper = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(deleteChildWorkPaper('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('handle delete Child work  paper with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      { type: ChildWorkpaperActionTypes.DELETE_CHILD_WORKPAPER },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
    ];

    childWorkpaperService.deleteChildWorkpaper = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(deleteChildWorkPaper('123'));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Generate Outputs for Childwork paper with success flow ', async () => {
    const childWPIds = ['12345'];

    const expectedActions = [
      { type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST },
      {
        type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_SUCCESS,
      },
    ];

    childWorkpaperService.generateChildWorkpapers = jest.fn().mockImplementation(() => {
      return true;
    });

    await mockStore.dispatch(generateChildWorkpapers(childWPIds));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Generate Outputs for Child workpaper with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });

    const expectedActions = [
      {
        type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      { type: ChildWorkpaperActionTypes.GENERATE_OUTPUTS_REQUEST_ERROR },
    ];

    childWorkpaperService.generateChildWorkpapers = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(generateChildWorkpapers(['123456']));
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Child workpaper columns with success flow ', async () => {
    const childWpColumns = ['Entity'];

    const expectedActions = [
      { type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST },
      {
        type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_SUCCESS,
        payload: childWpColumns,
      },
    ];

    workpaperService.getWorkPaperConfigByKey = jest.fn().mockImplementation(() => {
      return childWpColumns;
    });

    await mockStore.dispatch(getChildWpColumns());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });

  it('Child workpaper columns with error flow', async () => {
    const error = new ServerError({ status: 500, message: mockErrorMessage, key: 123 });
    const columns = [];
    const expectedActions = [
      {
        type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST,
      },
      {
        type: ErrorActionTypes.ADD_GLOBAL_ERROR,
        payload: error,
      },
      { type: ChildWorkpaperActionTypes.GET_CHILDWP_COLUMNS_REQUEST_ERROR, payload: columns },
    ];

    workpaperService.getWorkPaperConfigByKey = jest.fn().mockImplementation(() => {
      throw error;
    });

    mockStore.dispatch(getChildWpColumns());
    expect(mockStore.getActions()).toEqual(expectedActions);
  });
});
