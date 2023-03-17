import { engUiLogout } from '../authHelper';
import securityService from '../../services/security.service';
import { logoutWrapper } from '../logoutHelper';

jest.mock('../authHelper');

describe('Logout', () => {
  beforeAll(() => {
    jest.spyOn(securityService, 'addTokenToBlacklist').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Ensure engui logout is called', async () => {
    await logoutWrapper();
    expect(engUiLogout).toHaveBeenCalledTimes(1);
  });
});
