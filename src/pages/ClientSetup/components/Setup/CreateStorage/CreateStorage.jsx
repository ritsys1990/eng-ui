import React from 'react';
import { Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import { Box } from 'reflexbox';
import useTranslation from '../../../../../hooks/useTranslation';
import { clientSelectors } from '../../../../../store/client/selectors';
import StorageStatusRow from './StorageStatusRow';
import { useSelector } from 'react-redux';

export const COMPONENT_NAME = 'Client_Setup_Step_1_Create_Storage';

const CreateStorage = props => {
  const { client } = props;

  const { t } = useTranslation();

  const createStorageInProgress = useSelector(clientSelectors.selectCreateStorageInProgress);

  const headers = [
    {
      key: 'isCreatedStorage',
      title: t('Pages_Client_Setup_Step1_Storage_Status'),
      render: isCreatedStorage => <StorageStatusRow isCreatedStorage={isCreatedStorage} clientId={client.id} />,
    },
  ];

  return (
    client.storageSpaceId === null && (
      <Spinner dataInstance={COMPONENT_NAME} spinning={createStorageInProgress}>
        <Box width='100%' pl={80}>
          <Box>
            <Text type={TextTypes.h4} fontWeight='m' mb={4}>
              {t('Pages_Client_Setup_Step1_Create_Storage_Title')}
            </Text>
            <Text type={TextTypes.BODY} color='gray'>
              {t('Pages_Client_Setup_Step1_Create_Storage_Description')}
            </Text>
          </Box>
          <Box mt={10}>
            <Table
              headers={headers}
              rows={[
                {
                  isCreatedStorage: client.storageSpaceId !== null,
                },
              ]}
            />
          </Box>
        </Box>
      </Spinner>
    )
  );
};

export default CreateStorage;
