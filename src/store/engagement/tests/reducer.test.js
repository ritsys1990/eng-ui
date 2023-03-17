import reducer, { initialState } from '../reducer';
import { EngagementActionTypes } from '../actionTypes';

describe('engagement reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('get engagement by Id', () => {
    const expectedState = initialState.merge({
      fetchingEngagement: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get engagement by Id error', () => {
    const expectedState = initialState.merge({
      fetchingEngagement: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements by Id', () => {
    const expectedState = initialState.merge({
      fetchingMyList: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_LIST_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements by Id success', () => {
    const myList = [{ name: 'Test Name', id: '1234' }];
    const expectedState = initialState.merge({
      fetchingMyList: false,
      myList,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.GET_ENGAGEMENT_LIST_SUCCESS,
      payload: myList,
    });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements by Id error', () => {
    const expectedState = initialState.merge({
      fetchingMyList: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_LIST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements user role', () => {
    const expectedState = initialState.merge({
      fetchingUserList: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements user role success', () => {
    const userList = [];
    const expectedState = initialState.merge({
      fetchingUserList: false,
      userList,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_REQUEST_SUCCESS,
      payload: userList,
    });
    expect(state).toEqual(expectedState);
  });

  it('get my engagements user role error', () => {
    const expectedState = initialState.merge({
      fetchingUserList: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_ENGAGEMENT_USER_LIST_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get DMT details inputs', () => {
    const expectedState = initialState.merge({
      isLoading: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_DMT_DATA });
    expect(state).toEqual(expectedState);
  });

  it('get DMT details inputs success', () => {
    const inputs = [];
    const expectedState = initialState.merge({
      isLoading: false,
      inputs,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.GET_DMT_DATA_SUCCESS,
      payload: inputs,
    });
    expect(state).toEqual(expectedState);
  });

  it('get DMT details inputs error', () => {
    const expectedState = initialState.merge({
      isLoading: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_DMT_DATA_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('set engagements', () => {
    const engagement = [];
    const expectedState = initialState.merge({
      isLoading: false,
      engagement,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.SET_ENGAGEMENT,
      payload: engagement,
    });
    expect(state).toEqual(expectedState);
  });

  it('get client engagements', () => {
    const expectedState = initialState.merge({
      isFetchingClientEngagementList: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('get client engagements success', () => {
    const areEngagementsReconciled = true;
    const areEngagementsSynchedToOmnia = true;
    const clientEngagementsList = [{ name: 'Test Name', id: '1234' }];
    const expectedState = initialState.merge({
      isFetchingClientEngagementList: false,
      clientEngagementsList,
      areEngagementsReconciled: true,
      areEngagementsSynchedToOmnia: true,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_SUCCESS,
      payload: { engagements: clientEngagementsList, areEngagementsReconciled, areEngagementsSynchedToOmnia },
    });
    expect(state).toEqual(expectedState);
  });

  it('get client engagements error', () => {
    const expectedState = initialState.merge({
      isFetchingClientEngagementList: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_CLIENT_ENGAGEMENTS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('get mat engagements', () => {
    const expectedState = initialState.merge({
      isFetchingMatClientEngagements: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS });
    expect(state).toEqual(expectedState);
  });

  it('get mat engagements success', () => {
    const matClientEngagements = [{ name: 'Test Name', id: '1234' }];
    const expectedState = initialState.merge({
      isFetchingMatClientEngagements: false,
      matClientEngagements,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_SUCCESS,
      payload: matClientEngagements,
    });
    expect(state).toEqual(expectedState);
  });

  it('get mat engagements error', () => {
    const expectedState = initialState.merge({
      isFetchingMatClientEngagements: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.GET_MAT_CLIENT_ENGAGEMENTS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('reset mat engagements', () => {
    const expectedState = initialState.merge({
      matClientEngagements: [],
    });

    const state = reducer(initialState, { type: EngagementActionTypes.RESET_MAT_CLIENT_ENGAGEMENTS });
    expect(state).toEqual(expectedState);
  });

  it('reconcile engagements', () => {
    const expectedState = initialState.merge({
      isReconcilingEngagements: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.RECONCILE_ENGAGEMENTS });
    expect(state).toEqual(expectedState);
  });

  it('reconcile engagements success', () => {
    const expectedState = initialState.merge({
      isReconcilingEngagements: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('reconcile engagements error', () => {
    const expectedState = initialState.merge({
      isReconcilingEngagements: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.RECONCILE_ENGAGEMENTS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('should update reconcile modal open status', () => {
    const expectedState = initialState.merge({
      isReconcileEngagementsModalOpen: true,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.UPDATE_IS_RECONCILE_MODAL_OPEN,
      payload: true,
    });
    expect(state).toEqual(expectedState);
  });

  it('provide engagements', () => {
    const expectedState = initialState.merge({
      isProvisioningEngagements: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.PROVISION_ENGAGEMENTS });
    expect(state).toEqual(expectedState);
  });

  it('provide engagements success', () => {
    const expectedState = initialState.merge({
      isProvisioningEngagements: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.PROVISION_ENGAGEMENTS_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('provide engagements error', () => {
    const expectedState = initialState.merge({
      isProvisioningEngagements: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.PROVISION_ENGAGEMENTS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('rollforward engagements', () => {
    const expectedState = initialState.merge({
      isRollforwardInProgress: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT });
    expect(state).toEqual(expectedState);
  });

  it('rollforward engagements success', () => {
    const expectedState = initialState.merge({
      isRollforwardInProgress: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('rollforward engagements error', () => {
    const expectedState = initialState.merge({
      isRollforwardInProgress: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.ROLLFORWARD_ENGAGEMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('delete engagement', () => {
    const expectedState = initialState.merge({
      isDeletingEngagement: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_ENGAGEMENT });
    expect(state).toEqual(expectedState);
  });

  it('delete engagement success', () => {
    const expectedState = initialState.merge({
      isDeletingEngagement: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.DELETE_ENGAGEMENT_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('delete engagement error', () => {
    const expectedState = initialState.merge({
      isDeletingEngagement: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_ENGAGEMENT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('approve data subscription', () => {
    const expectedState = initialState.merge({
      isApprovingDataSourceSubscription: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION });
    expect(state).toEqual(expectedState);
  });

  it('approve data subscription success', () => {
    const expectedState = initialState.merge({
      isApprovingDataSourceSubscription: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('approve data subscription error', () => {
    const expectedState = initialState.merge({
      isApprovingDataSourceSubscription: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.APPROVE_DATA_SOURCE_SUBSCRIPTION_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('reject data subscription', () => {
    const expectedState = initialState.merge({
      isRejectingDataSourceSubscription: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION });
    expect(state).toEqual(expectedState);
  });

  it('reject data subscription success', () => {
    const expectedState = initialState.merge({
      isRejectingDataSourceSubscription: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('reject data subscription error', () => {
    const expectedState = initialState.merge({
      isRejectingDataSourceSubscription: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.REJECT_DATA_SOURCE_SUBSCRIPTION_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('configure extraction script', () => {
    const expectedState = initialState.merge({
      isConfiguringDataSourceExtractionScript: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT });
    expect(state).toEqual(expectedState);
  });

  it('configure extraction script success', () => {
    const expectedState = initialState.merge({
      isConfiguringDataSourceExtractionScript: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('configure extraction script error', () => {
    const expectedState = initialState.merge({
      isConfiguringDataSourceExtractionScript: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.CONFIGURE_DATA_SOURCE_EXTRACTION_SCRIPT_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('delete data source config', () => {
    const expectedState = initialState.merge({
      isDeletingDataSourceConfig: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG });
    expect(state).toEqual(expectedState);
  });

  it('delete data source config success', () => {
    const expectedState = initialState.merge({
      isDeletingDataSourceConfig: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('delete data source config error', () => {
    const expectedState = initialState.merge({
      isDeletingDataSourceConfig: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_DATA_SOURCE_CONFIG_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('delete connection config', () => {
    const expectedState = initialState.merge({
      isDeletingConnection: true,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_CONNECTION });
    expect(state).toEqual(expectedState);
  });

  it('delete connection success', () => {
    const expectedState = initialState.merge({
      isDeletingConnection: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.DELETE_CONNECTION_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('delete connection error', () => {
    const expectedState = initialState.merge({
      isDeletingConnection: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.DELETE_CONNECTION_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('create engagement user request', () => {
    const expectedState = initialState.merge({
      createEngagementUserInProgress: true,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_REQUEST,
    });
    expect(state).toEqual(expectedState);
  });

  it('create engagement user success', () => {
    const expectedState = initialState.merge({
      createEngagementUserInProgress: false,
    });

    const state = reducer(initialState, {
      type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_SUCCESS,
    });
    expect(state).toEqual(expectedState);
  });

  it('create engagement user error', () => {
    const expectedState = initialState.merge({
      createEngagementUserInProgress: false,
    });

    const state = reducer(initialState, { type: EngagementActionTypes.CREATE_ENGAGEMENT_USER_ERROR });
    expect(state).toEqual(expectedState);
  });
});
