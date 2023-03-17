import React, { useEffect, useState } from 'react';
import { Box } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants/constants';
import Org from './Org/Org';
import SubOrg from './SubOrg/SubOrg';
import SecureAgent from './SecureAgent/SecureAgent';
import { useSelector } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';

export const SubOrgSetup = () => {
  const client = useSelector(clientSelectors.selectClient);
  const orgId = client?.orgId;
  const [orgDetails, setOrgDetails] = useState([]);
  const org = useSelector(clientSelectors.selectOrg);
  const [isOrgEnabled, setIsOrgEnabled] = useState(false);

  useEffect(() => {
    if ((org, orgId)) {
      setOrgDetails(org);
    }
  }, [org, orgId]);

  const setOrgEnabled = enabled => {
    setIsOrgEnabled(enabled);
  };

  return (
    <Box ml={14} dataInstance={`${COMPONENT_NAME}`}>
      <Box mb={25}>
        <Org
          orgDetails={orgDetails}
          client={client}
          setOrgEnabled={setOrgEnabled}
          dataInstance={`${COMPONENT_NAME}-Org`}
        />
      </Box>

      <Box mb={25} dataInstance={`${COMPONENT_NAME}-Sub-Org`}>
        <SubOrg client={client} orgId={orgId} isOrgEnabled={isOrgEnabled} />
      </Box>

      <Box dataInstance={`${COMPONENT_NAME}-Secure-Agent`}>
        <SecureAgent isOrgEnabled={isOrgEnabled} />
      </Box>
    </Box>
  );
};
