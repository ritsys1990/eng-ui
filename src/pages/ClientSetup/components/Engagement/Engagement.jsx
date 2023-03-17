import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Flex, Spinner, Text, TextTypes } from 'cortex-look-book';
import EngagementTable from './components/EngagementTable';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import AddNewEngagementModal from './components/AddNewEngagement/AddNewEngagementModal';
import useTranslation from '../../../../hooks/useTranslation';
import SeeMatDetails from './components/SeeMatDetails';
import ReconcileModalWrapper from './components/ReconcileModalWrapper';
import ReconcileEngagementsAlert from './components/ReconcileEngagementsAlert';
import SyncEngagementsOmniaAlert from './components/SyncEngagementsOmniaAlert';
import ConnectToGlobalscape from './components/ConnectToGlobalscape/ConnectToGlobalscape';
import { isLegacyMode } from '../../../../utils/legacyUtils';

const Engagement = () => {
  const { t } = useTranslation();
  const engagements = useSelector(engagementSelectors.selectIsFetchingClientEngagementList);

  return (
    <Spinner spinning={engagements} label=''>
      <Box ml={90}>
        <ReconcileModalWrapper />
        <SyncEngagementsOmniaAlert />
        <ReconcileEngagementsAlert />
        <ConnectToGlobalscape />
        <Text type={TextTypes.BODY} color='gray' mb={5}>
          {t('Pages_Client_Setup_Step3_Description')}
        </Text>
        <EngagementTable />
        <Flex mt={8} justifyContent='space-between'>
          {!isLegacyMode && <AddNewEngagementModal />}
          <SeeMatDetails />
        </Flex>
      </Box>
    </Spinner>
  );
};

export default Engagement;
