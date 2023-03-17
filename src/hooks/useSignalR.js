/* eslint-disable sonarjs/cognitive-complexity */
import { useDispatch, useSelector } from 'react-redux';
import { signalRSelector } from '../store/signalR/selector';
import HubService from '../services/hub-service';
import { setSignalRMessage, setSignalRConnections } from '../store/signalR/actions';
import {
  MESSAGE_TO_USER,
  MESSAGE_TO_GLOBAL,
  MESSAGE_TO_GROUP,
  ADD_TO_GROUP,
  REMOVE_FROM_GROUP,
  GroupNotificationMethods,
} from '../constants/signalR.const';
import { updateNotebookStatus } from '../store/notebookWorkpaperProcess/actions';
import { generateJEReconciliationReport } from '../store/workpaperProcess/step3/actions';

export const useSignalR = () => {
  const dispatch = useDispatch();
  const signalRMessage = useSelector(signalRSelector.signalRMessage);
  const signalRConnections = useSelector(signalRSelector.signalRConnections);

  const clearSignalRMessage = () => {
    setTimeout(() => {
      dispatch(setSignalRMessage(''));
    }, 500);
  };

  const handleUserNotifications = () => {
    // handle user notifications here
  };

  const handleGroupNotifications = value => {
    // handle group notifications here
    const workpaperId = value.groupName.replace('Notebook-', '').replace('-Status', '');
    // change condition to switch case when we get methodName for note book status

    if (value.groupName === `Notebook-${workpaperId}-Status`) {
      const progressStatus = JSON.parse(value.payload.Status);
      dispatch(updateNotebookStatus(progressStatus));

      return;
    }

    const methodName = value?.payload?.methodName;
    const data = JSON.parse(value?.payload?.messagePayload);

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (methodName) {
      case GroupNotificationMethods.TRIFACTA_RECON_REPORT:
        dispatch(generateJEReconciliationReport(data));
        break;
      default:
    }
  };

  const subscribeToSignalR = (url, callback) => {
    if (url && (!signalRConnections || !signalRConnections.includes(url))) {
      const oldSignalRConnections = [...signalRConnections];
      oldSignalRConnections.push(url);
      dispatch(setSignalRConnections(oldSignalRConnections));
      HubService.subscribe(url, connection => {
        connection.on(MESSAGE_TO_GLOBAL, value => {
          if (value) {
            setSignalRMessage(value.message);
          }
          clearSignalRMessage();
        });
        connection.on(MESSAGE_TO_USER, value => {
          if (value) {
            setSignalRMessage(value.message);
            handleUserNotifications(value);
          }
          clearSignalRMessage();
        });
        connection.on(MESSAGE_TO_GROUP, value => {
          if (value) {
            setSignalRMessage(value.message);
            handleGroupNotifications(value);
          }
          clearSignalRMessage();
        });
        if (callback) {
          callback(connection);
        }
      });
    }
  };

  const handleError = error => {
    return error;
  };

  /**
   *  @description: method to unsubscribe from SignalR HUB
   *  @param url : url to disconnect/unsubscribe from SignalR
   * */
  const unsubscribeToSignalR = async url => {
    try {
      await HubService.unsubscribe(url);
    } catch (error) {
      handleError(error);
    }
  };

  const joinGroup = async (url, groupName) => {
    try {
      const connection = await HubService.getConnection(url);
      if (connection) {
        await connection.invoke(ADD_TO_GROUP, groupName);
      } else {
        subscribeToSignalR(url, HubConnection => {
          HubConnection.invoke(ADD_TO_GROUP, groupName);
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  const removeFromGroup = async (url, groupName) => {
    try {
      const connection = await HubService.getSignalRConnection(url);
      if (connection) {
        await connection.invoke(REMOVE_FROM_GROUP, groupName);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return { subscribeToSignalR, unsubscribeToSignalR, joinGroup, removeFromGroup, signalRMessage };
};
