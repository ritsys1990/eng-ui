import { AlertDialog, Intent, Text } from 'cortex-look-book';
import React from 'react';
import { useSelector } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import { engagementSelectors } from '../../../../../store/engagement/selectors';

const COMPONENT_NAME = 'SyncEngagementsOmniaAlert';

const SyncEngagementsOmniaAlert = () => {
  const areEngagementsSyncedToOmnia = useSelector(engagementSelectors.selectAreEngagementsSynchedToOmnia);

  const { t } = useTranslation();

  return !areEngagementsSyncedToOmnia ? (
    <AlertDialog
      type={Intent.INFO}
      title={t('Pages_Client_Setup_Step3_LinkOmniaTitle')}
      mb={8}
      dataInstance={COMPONENT_NAME}
    >
      <Text>{t('Pages_Client_Setup_Step3_LinkOmniaText')}</Text>
    </AlertDialog>
  ) : null;
};

export default SyncEngagementsOmniaAlert;
