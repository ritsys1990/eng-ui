import reducer, { initialState } from '../reducer';
import { SecurityActionTypes } from '../actionTypes';

describe('security reducer', () => {
  it('should check initial state', () => {
    const state = reducer(undefined, {});
    expect(state).toEqual(initialState);
  });

  it('getting client permissions', () => {
    const expectedState = initialState.merge({
      gettingClientPermissions: true,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_PERMISSIONS });
    expect(state).toEqual(expectedState);
  });

  it('getting client permissions success', () => {
    const payload = { permissions: {}, clientId: '' };
    const expectedState = initialState.merge({
      gettingClientPermissions: false,
      clientPermission: payload.permissions,
      currentClientId: payload.clientId,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_SUCCESS, payload });
    expect(state).toEqual(expectedState);
  });

  it('getting client permissions error', () => {
    const expectedState = initialState.merge({
      gettingClientPermissions: false,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_PERMISSIONS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('getting client recertification', () => {
    const expectedState = initialState.merge({
      isFetchingClientRecertification: true,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS });
    expect(state).toEqual(expectedState);
  });

  it('getting client recertification success', () => {
    const payload = {
      status: 'Status',
    };
    const expectedState = initialState.merge({
      isFetchingClientRecertification: false,
      clientRecertification: payload,
    });

    const state = reducer(initialState, {
      type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_SUCCESS,
      payload,
    });
    expect(state).toEqual(expectedState);
  });

  it('getting client recertification error', () => {
    const expectedState = initialState.merge({
      isFetchingClientRecertification: false,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_RECERTIFICATION_STATUS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('getting client external recertification', () => {
    const expectedState = initialState.merge({
      isFetchingExternalClientRecertification: true,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS });
    expect(state).toEqual(expectedState);
  });

  it('getting client external recertification success', () => {
    const payload = {
      status: 'Status',
    };
    const expectedState = initialState.merge({
      isFetchingExternalClientRecertification: false,
      externalClientRecertification: payload,
    });

    const state = reducer(initialState, {
      type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_SUCCESS,
      payload,
    });
    expect(state).toEqual(expectedState);
  });

  it('getting client external recertification error', () => {
    const expectedState = initialState.merge({
      isFetchingExternalClientRecertification: false,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_CLIENT_EXTERNAL_RECERTIFICATION_STATUS_ERROR });
    expect(state).toEqual(expectedState);
  });

  it('getting engagement list permissions', () => {
    const expectedState = initialState.merge({
      fetchingEngagementListPermissions: true,
      engagementListPermissions: null,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_REQUEST });
    expect(state).toEqual(expectedState);
  });

  it('getting engagement list permissions success', () => {
    const expectedState = initialState.merge({
      fetchingEngagementListPermissions: false,
      engagementListPermissions: undefined,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_SUCCESS });
    expect(state).toEqual(expectedState);
  });

  it('getting engagement list permissions error', () => {
    const expectedState = initialState.merge({
      fetchingEngagementListPermissions: false,
    });

    const state = reducer(initialState, { type: SecurityActionTypes.GET_ENGAGEMENT_LIST_PERMISSIONS_ERROR });
    expect(state).toEqual(expectedState);
  });
});
