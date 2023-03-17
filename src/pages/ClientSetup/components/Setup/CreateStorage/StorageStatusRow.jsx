import { Button, ButtonTypes, Icon, IconTypes, Text, TextTypes } from 'cortex-look-book';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Flex } from 'reflexbox';
import useTranslation from '../../../../../hooks/useTranslation';
import { createClientStorage } from '../../../../../store/client/actions';

export const COMPONENT_NAME = 'Client_Setup_Step_1_Create_Storage_Status_Row';

const StorageStatusRow = props => {
  const { isCreatedStorage, clientId } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isCreated, setIsCreated] = useState(isCreatedStorage);

  const handleOnCreateStorage = () => {
    if (!isCreatedStorage) {
      dispatch(createClientStorage(clientId, true)).then(result => {
        setIsCreated(result);
      });
    }
  };

  if (isCreated) {
    return (
      <Flex data-instance={COMPONENT_NAME} alignContent='center'>
        <Icon type={IconTypes.SUCCESS} size={20} color='green' mr={5} />
        <Text type={TextTypes.BODY}>{t('Pages_Client_Setup_Step1_Successful_Storage')}</Text>
      </Flex>
    );
  }

  return (
    <Flex data-instance={COMPONENT_NAME}>
      <Flex alignContent='center'>
        <Icon type={IconTypes.MINUS_CIRCLE} size={20} color='red' mr={5} />
        <Text type={TextTypes.BODY}>{t('Pages_Client_Setup_Step1_Failed_Storage')}</Text>
      </Flex>
      <Button
        dataInstance={`${COMPONENT_NAME}_Create_Storage`}
        type={ButtonTypes.LINK}
        display='flex'
        ml='auto'
        onClick={handleOnCreateStorage}
      >
        <Flex>
          <Icon type={IconTypes.PLUS} size={20} />
          <Text type={TextTypes.BODY}>{t('Pages_Client_Setup_Step1_Create_Storage_Space')}</Text>
        </Flex>
      </Button>
    </Flex>
  );
};

export default StorageStatusRow;
