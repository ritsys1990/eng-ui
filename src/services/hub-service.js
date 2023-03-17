import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Auth } from '../utils/authHelper';

const connectionMap = new Map();

const startConnection = (url, callback) => {
  Auth.getToken().then(data => {
    const token = data || '';
    const connection = new HubConnectionBuilder()
      .withUrl(url, { accessTokenFactory: () => token, withCredentials: false })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    callback(
      connection,
      connection.start().catch(error => console.log(error))
    );
  });
};

class HubService {
  async subscribe(url, cb) {
    let currentConnection = connectionMap.get(url);
    if (currentConnection) {
      currentConnection.count += 1;

      return currentConnection.connection;
    }

    return startConnection(url, async (connection, startPromise) => {
      currentConnection = { count: 1, connection };
      connectionMap.set(url, currentConnection);

      return startPromise.then(() => {
        cb(connection);
      });
    });
  }

  async unsubscribe(url) {
    const connection = connectionMap.get(url);
    if (!connection) return;
    connection.count -= 1;
    if (connection.count === 0) {
      connection.connection.stop();
      connectionMap.delete(url);
    }
  }

  async getConnection(url) {
    const connection = connectionMap.get(url);
    if (!connection) return false;

    return connection.connection;
  }
}

export default new HubService();
