import { Permissions, Actions } from '../../../../../utils/permissionsHelper';

export const MenuOptions = [
  {
    id: 'closeout',
    text: 'Pages_EngagementSettings_MenuItem_Closeout',
    permission: Permissions.ENGAGEMENT_CLOSEOUT,
    action: Actions.VIEW,
  },
  {
    id: 'legalhold',
    text: 'Pages_EngagementSettings_MenuItem_LegalHold',
    permission: Permissions.LEGAL_HOLD,
    action: Actions.VIEW,
  },
];

export const engagementType = {
  CLOSE_OUT: 'closeout',
  LEGAL_HOLD: 'legalhold',
};
