import reducer, { initialState } from '../reducer';
import { DataExchangeActionTypes } from '../actionTypes';

describe('dataExchange reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('get link omnia engagements', () => {
    const expectedState = initialState.merge({
      isLinkingEngagementToOmnia: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT });
    expect(state).toEqual(expectedState);
  });

  it('get link omnia engagements success', () => {
    const omniaLinkResponse = {
      clientId: 'c8337373-2494-41b3-beef-74a256d77002',
      engagementId: '99b6ffad-7f52-4297-a212-553c9352be52',
      linkFailReason: null,
      omniaHomeUrl: 'https://d3omniause2.aaps.deloitte.com',
    };
    const expectedState = initialState.merge({
      isLinkingEngagementToOmnia: false,
      omniaLinkResponse,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_SUCCESS,
      payload: omniaLinkResponse,
    });
    expect(state).toEqual(expectedState);
  });

  it('get link omnia engagements error', () => {
    const expectedState = initialState.merge({
      isLinkingEngagementToOmnia: false,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.LINK_OMNIA_ENGAGEMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('submit file sharing request', () => {
    const expectedState = initialState.merge({
      isSendingWPOutputToOmnia: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('submit file sharing request success', () => {
    const sendWPOutputStatus = {
      errorCode: null,
      failedReason: null,
      fileName: 'file_example_XLSX_100 – 10',
      omniaEngagementFileId: 'd4075f95-b054-4daa-824a-33735325c10b',
      outputId: '6bf528b9-a33b-4406-a156-0836c4dfd0f8',
      status: 'InProgress',
    };
    const expectedState = initialState.merge({
      isSendingWPOutputToOmnia: false,
      sendWPOutputStatus,
      isSendToOmniaOutputHistoryNeededRefresh: true,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_SUCCESS,
      payload: sendWPOutputStatus,
    });
    expect(state).toEqual(expectedState);
  });

  it('submit file sharing request error', () => {
    const expectedState = initialState.merge({
      isSendingWPOutputToOmnia: false,
      isSendToOmniaOutputHistoryNeededRefresh: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.SUBMIT_FILE_SHARING_REQUEST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('file sharing request status', () => {
    const expectedState = initialState.merge({
      isFetchingWPOutputStatus: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.FILE_SHARING_REQUEST_SATUS });
    expect(state).toEqual(expectedState);
  });

  it('file sharing request status success', () => {
    const sendWPOutputStatus = {
      errorCode: null,
      failedReason: null,
      fileName: 'file_example_XLSX_100 – 10',
      omniaEngagementFileId: 'd4075f95-b054-4daa-824a-33735325c10b',
      outputId: '6bf528b9-a33b-4406-a156-0836c4dfd0f8',
      status: 'InProgress',
    };
    const expectedState = initialState.merge({
      isFetchingWPOutputStatus: false,
      sendWPOutputStatus,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_SUCCESS,
      payload: sendWPOutputStatus,
    });
    expect(state).toEqual(expectedState);
  });

  it('file sharing request status error', () => {
    const expectedState = initialState.merge({
      isFetchingWPOutputStatus: false,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.FILE_SHARING_REQUEST_STATUS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get send to omnia output history', () => {
    const expectedState = initialState.merge({
      isFetchingSendToOmniaOutputHistory: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get send to omnia output history success', () => {
    const sendToOmniaOutputHistory = {
      createBy: 'depanchal@deloitte.com',
      createdDate: '2021-03-17T23:20:14.568Z',
      fileName: 'SampleCSVFile_1109kb – 2-03-17-2021-23-20-14.csv',
      lastUpdatedDate: '2021-03-17T23:20:52.117Z',
      omniaEngagementFileId: '63414faf-c3a1-42ae-913b-54e8e848d593',
      status: 'Failed',
    };
    const expectedState = initialState.merge({
      isFetchingSendToOmniaOutputHistory: false,
      sendToOmniaOutputHistory,
      isSendToOmniaOutputHistoryNeededRefresh: false,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_SUCCESS,
      payload: sendToOmniaOutputHistory,
    });
    expect(state).toEqual(expectedState);
  });

  it('get send to omnia output history error', () => {
    const expectedState = initialState.merge({
      isFetchingSendToOmniaOutputHistory: false,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.GET_SEND_TO_OMNIA_OUTPUT_HISTORY_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('linked omnia engagement id', () => {
    const expectedState = initialState.merge({
      isFetchingLinkedOmniaEngagements: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_STATUS });
    expect(state).toEqual(expectedState);
  });

  it('linked omnia engagement id success', () => {
    const linkedOmniaEngagements = {
      isReadyForDeletion: true,
      omniaEngagementId: 'eac16e6d-b33c-40fc-9eb9-9962989aa04f',
      omniaEngagementName: 'audit, review, specified audit procedures',
    };
    const expectedState = initialState.merge({
      isFetchingLinkedOmniaEngagements: false,
      linkedOmniaEngagements,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_SUCCESS,
      payload: linkedOmniaEngagements,
    });
    expect(state).toEqual(expectedState);
  });

  it('linked omnia engagement id error', () => {
    const expectedState = initialState.merge({
      isFetchingLinkedOmniaEngagements: false,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.LINKED_OMNIA_ENGAGEMENT_ID_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('unLinked omnia engagement id', () => {
    const expectedState = initialState.merge({
      isUnlinkedOmniaEngagement: true,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_STATUS });
    expect(state).toEqual(expectedState);
  });

  it('unLinked omnia engagement id success', () => {
    const expectedState = initialState.merge({
      isUnlinkedOmniaEngagement: false,
    });

    const state = reducer(initialState, {
      type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('unLinked omnia engagement id error', () => {
    const expectedState = initialState.merge({
      isUnlinkedOmniaEngagement: false,
    });

    const state = reducer(initialState, { type: DataExchangeActionTypes.UNLINKED_OMNIA_ENGAGEMENT_ID_ERROR });
    expect(state).toEqual(expectedState);
  });
});
