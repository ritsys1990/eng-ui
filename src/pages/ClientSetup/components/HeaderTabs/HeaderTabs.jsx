import React, { useEffect, useState } from 'react';
import { ClientSetupTabs, RecertificationStatus } from '../../constants/constants';
import env from 'env';
import { useParams } from 'react-router-dom';
import { Box, Icon, IconTypes, Tabs, Text, Tooltip, TooltipPosition } from 'cortex-look-book';
import useTranslation from '../../../../hooks/useTranslation';
import { useSelector } from 'react-redux';
import { securitySelectors } from '../../../../store/security/selectors';

const COMPONENT_NAME = 'HeaderTabs';

const HeaderTabs = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(ClientSetupTabs.CLIENT_SETUP);
  const recertification = useSelector(securitySelectors.selectClientRecertificationStatus);
  const externalRecertification = useSelector(securitySelectors.selectClientExternalRecertificationStatus);
  const { clientId } = useParams();
  const { t } = useTranslation();

  const handleTabClick = tabId => {
    if (tabId === ClientSetupTabs.CLIENT_SETUP) {
      setActiveTab(tabId);
    } else {
      window.location.href = `${env.EXTRACTIONUI_URL}/clients/${clientId}/users`;
    }
  };

  useEffect(() => {
    const recertificationRequired =
      recertification?.status &&
      externalRecertification?.status &&
      (recertification?.status !== RecertificationStatus.RECERTIFIED ||
        externalRecertification?.status !== RecertificationStatus.RECERTIFIED);

    setTabs([
      {
        id: ClientSetupTabs.CLIENT_SETUP,
        label: t('Pages_Client_Setup_title'),
      },
      {
        id: ClientSetupTabs.USERS,
        label: (
          <Text display='flex' alignItems='center'>
            {t('Pages_Client_Setup_Users')}
            {recertificationRequired && (
              <Tooltip
                display='inline-block'
                direction={TooltipPosition.TOP}
                tooltipContent={t('Components_ClientSetup_UserRecertificationWarning')}
                width='200px'
                showOnHover
              >
                <Box position='relative' width='28px' height='20px' ml={2}>
                  <Icon
                    type={IconTypes.WARNING_NO_CIRCLE}
                    position='absolute'
                    height={28}
                    width={28}
                    color='black'
                    sx={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Box>
              </Tooltip>
            )}
          </Text>
        ),
      },
    ]);
  }, [t, recertification, externalRecertification]);

  return <Tabs activeTab={activeTab} tabs={tabs} onTabClicked={handleTabClick} dataInstance={`${COMPONENT_NAME}`} />;
};

export default HeaderTabs;
