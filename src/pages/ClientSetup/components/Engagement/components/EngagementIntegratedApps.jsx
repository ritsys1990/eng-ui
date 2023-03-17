import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Flex, Icon, IconTypes, Text, TextTypes, Tooltip } from 'cortex-look-book';
import LinkedOmniaEngModal from '../../../../Omnia/components/LinkedOmniaEngModal';
import useTranslation from '../../../../../hooks/useTranslation';
import { getEngagementsByClient } from 'src/store/engagement/actions';

const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Table';
const COMPONENT_NAME = 'EngagementIntegratedApps';

const EngagementIntegratedApps = ({
  isConnectedToMAT,
  isConnectedToGlobalscape,
  isConnectedToOmnia,
  cortexEngagementId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [linkedOmniaEngModal, setLinkedOmniaEngModal] = useState(false);
  const { clientId } = useParams();

  const handleClose = updateEngagements => {
    setLinkedOmniaEngModal(false);
    if (!updateEngagements) {
      dispatch(getEngagementsByClient(clientId));
    }
  };

  const handleOpen = () => {
    setLinkedOmniaEngModal(true);
  };

  return (
    <Flex dataInstance={COMPONENT_NAME}>
      <Box>
        <Tooltip
          showOnHover
          tooltipContent={t(`${TRANSLATION_KEY}_${isConnectedToMAT ? 'ConnectedToMAT' : 'NotConnectedToMAT'}`)}
          dataInstance={`${COMPONENT_NAME}-Mat`}
        >
          <Icon
            type={IconTypes.TOOLBOX}
            size={35}
            color={isConnectedToMAT ? 'blue' : 'gray2'}
            dataInstance={`${COMPONENT_NAME}-Mat`}
          />
        </Tooltip>
      </Box>
      <Box ml={5}>
        <Tooltip
          showOnHover
          tooltipContent={t(
            `${TRANSLATION_KEY}_${isConnectedToGlobalscape ? 'ConnectedToGlobalscape' : 'NotConnectedToGlobalscape'}`
          )}
          dataInstance={`${COMPONENT_NAME}-Globalscape`}
        >
          <Text
            type={TextTypes.H2}
            display='flex'
            alignItems='center'
            justifyContent='center'
            fontWeight='l'
            width={35}
            height={35}
            color={isConnectedToGlobalscape ? 'blue' : 'gray2'}
            dataInstance={`${COMPONENT_NAME}-Globalscape`}
            cursor='default'
          >
            G
          </Text>
        </Tooltip>
      </Box>
      <Box ml={5} pt={3} pl={2}>
        <Tooltip
          showOnHover
          tooltipContent={t(`${TRANSLATION_KEY}_${isConnectedToOmnia ? 'LinkedToOmnia' : 'NotLinkedToOmnia'}`)}
          dataInstance={`${COMPONENT_NAME}-Omnia`}
        >
          <Icon
            type={IconTypes.OMNIA_LOGO}
            size={23}
            color={isConnectedToOmnia ? 'blue' : 'gray2'}
            style={{ pointerEvents: isConnectedToOmnia ? 'auto' : 'none' }}
            cursor={isConnectedToOmnia ? 'pointer' : null}
            pointerEvents={isConnectedToOmnia ? 'auto' : null}
            dataInstance={`${COMPONENT_NAME}-Omnia-icon`}
            onClick={isConnectedToOmnia ? handleOpen : null}
          />
        </Tooltip>
        <LinkedOmniaEngModal
          cortexEngagementId={cortexEngagementId}
          linkedOmniaEngModal={linkedOmniaEngModal}
          handleClose={handleClose}
          openFrom='client'
          dataInstance={`${COMPONENT_NAME}-Linked-Omnia`}
        />
      </Box>
    </Flex>
  );
};

EngagementIntegratedApps.propTypes = {
  isConnectedToMAT: PropTypes.bool,
  isConnectedToGlobalscape: PropTypes.bool,
};

EngagementIntegratedApps.defaultProps = {
  isConnectedToMAT: false,
  isConnectedToGlobalscape: false,
};

export default EngagementIntegratedApps;
