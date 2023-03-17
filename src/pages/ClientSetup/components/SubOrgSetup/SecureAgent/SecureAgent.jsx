import React, { useEffect, useState } from 'react';
import { Box, Flex, Table, Text, TextTypes, Spinner } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME } from '../constants/constants';
import { useSelector } from 'react-redux';
import { getAgentHeaders } from '../utils/utils';
import { clientSelectors } from '../../../../../store/client/selectors';

const SecureAgent = isOrgEnabled => {
  const { t } = useTranslation();

  const [secureAgentRows, setSecureAgentRows] = useState([]);
  const [secureAgentHeaders, setsecureAgentHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecureAgent, setIsSecureAgent] = useState(false);
  const agentsDetails = useSelector(clientSelectors.selectAgents);
  const orgDetails = useSelector(clientSelectors.selectOrg);
  const isFetchingClient = useSelector(clientSelectors.selectFetchingClient);
  const isGettingAgents = useSelector(clientSelectors.selectIsGettingAgents);

  useEffect(() => {
    setIsLoading(isFetchingClient || isGettingAgents);
  }, [isFetchingClient, isGettingAgents]);

  useEffect(() => {
    setIsSecureAgent(orgDetails?.subOrgs?.some(subOrg => subOrg.id === agentsDetails?.agents?.[0]?.subOrg?.id));
  }, [agentsDetails, orgDetails]);

  useEffect(() => {
    if (isOrgEnabled) {
      setSecureAgentRows(agentsDetails?.agents);
      setsecureAgentHeaders(getAgentHeaders(t));
    }
  }, [t, agentsDetails, isOrgEnabled]);

  return (
    <Spinner spinning={isLoading} overlayOpacity={0.7} dataInstance={`${COMPONENT_NAME}-Secure-Agent`}>
      <Text type={TextTypes.h4} fontWeight='m' mb={4}>
        {t('Pages_Client_Setup_Step4_Secure_Agent_Title')}
      </Text>
      <Box>
        {isOrgEnabled && isSecureAgent ? (
          <Table headers={secureAgentHeaders} rows={secureAgentRows} dataInstance={`${COMPONENT_NAME}_secure_Agent`} />
        ) : (
          <Flex justifyContent='flex-start' py={8} dataInstance={`${COMPONENT_NAME}-No-SecureAgent`}>
            <Text type={TextTypes.BODY} fontWeight='s'>
              {t('Pages_Client_Setup_Step4_Config_No_Secure_Agent_Desc')}
            </Text>
          </Flex>
        )}
      </Box>
    </Spinner>
  );
};

export default SecureAgent;
