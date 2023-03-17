import notificationService from '../../services/notification.service';
import { NotificationsActionTypes } from './actionTypes';
import { addGlobalError } from '../errors/actions';

export function getAllHeader(limit, offset) {
  return async dispatch => {
    try {
      dispatch({ type: NotificationsActionTypes.GET_ALL_HEADER_REQUEST });
      const all = await notificationService.getNotifications(limit, offset);
      dispatch({
        type: NotificationsActionTypes.GET_ALL_HEADER_SUCCESS,
        payload: { all },
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: NotificationsActionTypes.GET_ALL_HEADER_ERROR,
        payload: { err },
      });
    }
  };
}

export function getUnreadCount() {
  return async dispatch => {
    try {
      dispatch({ type: NotificationsActionTypes.GET_UNREAD_COUNT_REQUEST });
      const unread = await notificationService.getUnread(1);
      dispatch({
        type: NotificationsActionTypes.GET_UNREAD_COUNT_SUCCESS,
        payload: unread.totalCount,
      });
    } catch (err) {
      dispatch({
        type: NotificationsActionTypes.GET_UNREAD_COUNT_ERROR,
        payload: { err },
      });
    }
  };
}

export function markAsRead(ids) {
  return async dispatch => {
    try {
      dispatch({ type: NotificationsActionTypes.MARK_AS_READ_REQUEST });
      await notificationService.markAsRead(ids);
      dispatch({
        type: NotificationsActionTypes.MARK_AS_READ_SUCCESS,
        payload: { ids },
      });
    } catch (err) {
      dispatch(addGlobalError(err));
      dispatch({
        type: NotificationsActionTypes.MARK_AS_READ_ERROR,
        payload: { err },
      });
    }
  };
}
