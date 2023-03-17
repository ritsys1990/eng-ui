import React from 'react';
import { Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from '../constants/constants';

export const validate = name => {
  return /^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})$/.test(
    name
  );
};

export const getErrors = (FormErrorModel, domainName, t, client) => {
  const errors = { ...FormErrorModel };

  if (!validate(domainName) && domainName.indexOf('@') !== -1) {
    errors.domainName = t('Pages_Client_Setup_Step1_Domain_At_Error');
  } else if (!validate(domainName)) {
    errors.domainName = t('Pages_Client_Setup_Step1_Domain_Empty_Error');
  }

  if (client?.domains.includes(domainName)) {
    errors.domainName = t('Pages_Client_Setup_Step1_Domain_Duplicate_Error');
  }

  return errors;
};

export const getTableHeaders = (t, deleteDomain, canUpdateClient) => {
  return [
    {
      key: 'entityName',
      title: 'Supported Domain',
      render: (name, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row.name}</Text>
          </Flex>
        );
      },
    },
    {
      key: 'id',
      render: (id, row) => (
        <Flex justifyContent='flex-end' cursor='pointer'>
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            onClick={() => {
              deleteDomain(row.name);
            }}
            icon={IconTypes.DELETE}
            iconWidth={18}
            dataInstance={`${COMPONENT_NAME}_Delete`}
            disabled={!canUpdateClient}
          />
        </Flex>
      ),
    },
  ];
};
