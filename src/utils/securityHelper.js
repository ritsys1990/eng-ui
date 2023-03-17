import { flatMap } from 'lodash';
import rolesEnum from './rolesEnum';

const DELOITTE_USER_TYPE = 'Deloitte';
const EXTERNAL_USER_TYPE = 'External';
const USA_MEMBER_FIRM_CODE = 'US';

export const isDeloitte = me => {
  if (!me) {
    return false;
  }

  return me.type === DELOITTE_USER_TYPE;
};

export const isExternal = me => {
  if (!me) {
    return false;
  }

  return me.type === EXTERNAL_USER_TYPE;
};

export const isAutoProvision = (roles, me) => {
  if (!isDeloitte(me)) {
    return false;
  }

  if (me.memberFirmCode !== USA_MEMBER_FIRM_CODE) {
    return false;
  }

  // Check if roles have loaded
  if (!roles || !roles?.app.length || !roles?.engagements.length) {
    return false;
  }

  // Check if user has any existing role
  if (roles.app.length > 0 || roles.engagements.length > 0 || roles.clients.length > 0) {
    return false;
  }

  return true;
};

export const userCanAccessCortex = (roles, me) => {
  if (roles.app.length > 0 || roles.engagements.length > 0 || roles.clients.length > 0) {
    return true;
  }

  return isAutoProvision(roles, me);
};

export const isAppLevelUser = roles => {
  return roles.app.length > 0;
};

export const hasAppLevelRole = (roles, role) => {
  // Check if roles have loaded
  if (!roles || !roles.app) {
    return false;
  }

  for (let i = 0; i < roles.app.length; ++i) {
    if (roles.app[i].id === role) {
      return true;
    }
  }

  return false;
};

export const isCSA = roles => {
  // Check if roles have loaded
  if (!roles || !roles.app || !roles.engagements) {
    return false;
  }

  const clientRoles = flatMap(roles.clients, client => client.roles);
  for (let i = 0; i < clientRoles.length; ++i) {
    if (clientRoles[i].id === rolesEnum.CLIENT_SETUP_ADMIN) {
      return true;
    }
  }

  return false;
};
