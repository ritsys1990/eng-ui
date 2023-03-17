import { init, AuthenticationProvider } from './utils/authHelper';
import * as serviceWorker from './serviceWorker';
import App from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';

init();

ReactDOM.render(
  <AuthenticationProvider>
    <App />
  </AuthenticationProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
