import securityService from '../services/security.service';
import { engUiLogout } from './authHelper';

export const logoutWrapper = () => {
  return securityService.addTokenToBlacklist().finally(() => {
    engUiLogout();
  });
};
