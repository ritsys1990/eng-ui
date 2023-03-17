/**
 * This module builds the proper configuration for authentication workflows;
 * and also, provides a few utilities for authentication related tasks.
 */

import React from 'react';
import env from 'env';
import jwtDecode from 'jwt-decode';
import { AuthProvider, useIsAuthenticated, useMsal } from 'cortex-shared-authenticator';
import { isLegacyMode } from './legacyUtils';

// MSAL specific configurations.
const msalConfig = {
  auth: {
    clientId: env.CLIENT_ID || 'JEST_MOCK_ID',
    authority: `${env.AUTHORITY}/${env.TENANT_ID}`,
    redirectUri: `${env.REDIRECT_URI}`,
    postLogoutRedirectUri: `${env.EXTRACTIONUI_URL}/eng-ui-logout`,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
  system: {
    allowRedirectInIframe: true,
  },
  scopes: [env.AUTH_SCOPE],
};

// Initializing and exporting modules.
export const Auth = AuthProvider;

// Module for getting token
export const getToken = async () => AuthProvider.getToken();
export const useIsAuth = useIsAuthenticated;
export const getProgressStatus = () => {
  const { inProgress } = useMsal();

  return inProgress;
};
export { InteractionStatus } from 'cortex-shared-authenticator';

/**
 * @param {} children props
 * @returns JSX compoent
 */

// HOC wrapper for MSAL Authentication
export const AuthenticationProvider = ({ children }) => {
  return <AuthProvider.Provider>{children}</AuthProvider.Provider>;
};

export const login = () => {
  if (isLegacyMode) {
    window.location.replace('/legacy-login');
  } else {
    AuthProvider.login();
  }
};

// Handle logout from UI
export const engUiLogout = () => {
  AuthProvider.logout();
};

// intialisation entrypoint
export const init = () => {
  AuthProvider.init(msalConfig);
};

// Handles token header for REST API endpoints
export const apiFetch = async (fetch, url, options) => {
  const token = await getToken();
  const o = options || {};

  if (!o.headers) o.headers = {};
  o.headers.Authorization = 'Bearer '.concat(token);

  return fetch(url, o);
};

// Decodes token and get user name and other info
export const getUserEmail = async () => {
  const token = await getToken();
  const decodedToken = jwtDecode(token);

  if (decodedToken && decodedToken.upn) {
    return decodedToken.upn;
  }

  return 'System';
};
