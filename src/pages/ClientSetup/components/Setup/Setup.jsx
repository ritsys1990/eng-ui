import React from 'react';
import { Box } from 'cortex-look-book';
import GeneralDetails from './GeneralDetails/GeneralDetails';
import ClientDomain from './ClientDomain/ClientDomain';
import CreateStorage from './CreateStorage/CreateStorage';
import { useSelector } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';
import { isLegacyMode } from '../../../../utils/legacyUtils';

export const COMPONENT_NAME = 'Client_Setup_Step_1';

const Setup = () => {
  const client = useSelector(clientSelectors.selectClient);

  return (
    <Box dataInstance={COMPONENT_NAME}>
      {client && (
        <Box>
          <Box width='100%'>
            <GeneralDetails client={client} />
          </Box>
          <Box width='100%' my={12}>
            <CreateStorage client={client} />
          </Box>
          {client?.usesSecureAgent && !isLegacyMode && (
            <Box width='100%' my={12}>
              <ClientDomain client={client} dataInstance={`${COMPONENT_NAME}_ClientDomain`} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Setup;
