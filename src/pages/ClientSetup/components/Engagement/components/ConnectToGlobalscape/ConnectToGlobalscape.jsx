import { AlertDialog, Box, Button, ButtonTypes, Intent, Text } from 'cortex-look-book';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useTranslation from '../../../../../../hooks/useTranslation';
import { engagementSelectors } from '../../../../../../store/engagement/selectors';
import ConnectToGlobalscapeModal from './ConnectToGlobalscapeModal';

const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_ConnectToGlobalscape';
const COMPONENT_NAME = 'ConnectToGlobalscape';

const ConnectToGlobalscape = () => {
  const [areAllConnected, setAreAllConected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const engagements = useSelector(engagementSelectors.selectClientEngagementList);
  const { t } = useTranslation();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const connected = engagements.every(eng => eng.efT_EXT_EngagementLink && eng.efT_INT_EngagementLink);
    setAreAllConected(connected);
  }, [engagements]);

  return (
    <Box dataInstance={`${COMPONENT_NAME}`}>
      <ConnectToGlobalscapeModal
        isModalOpen={isModalOpen}
        handleClose={handleCloseModal}
        dataInstance={`${COMPONENT_NAME}`}
      />
      {!areAllConnected && (
        <AlertDialog type={Intent.INFO} title={t(`${TRANSLATION_KEY}_Title`)} mb={8} dataInstance={COMPONENT_NAME}>
          <Text>
            {t(`${TRANSLATION_KEY}_Text`)}
            <Button
              type={ButtonTypes.LINK}
              display='inline-block'
              ml={3}
              onClick={handleOpenModal}
              dataInstance={`${COMPONENT_NAME}-Connect`}
            >
              {t(`${TRANSLATION_KEY}_ConnectToGlobalscapeButton`)}
            </Button>
          </Text>
        </AlertDialog>
      )}
    </Box>
  );
};

export default ConnectToGlobalscape;
