import { hasPagePermissions } from './ClientSetup.utils';
import { PagePermissions } from '../../../utils/permissionsHelper';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(fn => fn()),
}));

describe('Entities.util', () => {
  it('Should return true for the permissions', () => {
    const pagePermissions = {
      clientSetup_Setup: true,
      clientSetup_List: true,
      clientSetup_SetupApplicationMapping: true,
      clientSetup_SetupComponentMapping: true,
      clientSetup_SetupConnections: true,
      clientSetup_SetupDataSources: true,
      clientSetup_SetupDetails: true,
      clientSetup_SetupEngagements: true,
      clientSetup_SetupEntities: true,
      clientSetup_SetupInformatica: true,
    };

    expect(hasPagePermissions(pagePermissions, PagePermissions)).toEqual(true);
  });

  it('Should return false for the permissions', () => {
    const pagePermissions = {
      clientSetup_Setup: false,
      clientSetup_List: false,
      clientSetup_SetupApplicationMapping: false,
      clientSetup_SetupComponentMapping: false,
      clientSetup_SetupConnections: false,
      clientSetup_SetupDataSources: false,
      clientSetup_SetupDetails: false,
      clientSetup_SetupEngagements: false,
      clientSetup_SetupEntities: false,
      clientSetup_SetupInformatica: false,
    };

    expect(hasPagePermissions(pagePermissions, PagePermissions)).toEqual(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
