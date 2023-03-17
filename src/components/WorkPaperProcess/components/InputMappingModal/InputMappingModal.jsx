import React from 'react';
import { Box, Flex, Modal, ModalSizes, Text, TextTypes, Table } from 'cortex-look-book';
import { useSelector } from 'react-redux';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import useTranslation from '../../../../hooks/useTranslation';

const COMPONENT_NAME = 'InputMappingModal';

const InputMappingModal = ({ isModalOpen, handleClose, inputId }) => {
  const { t } = useTranslation();
  const inputRelationship = useSelector(wpStep1Selectors.inputRelationship);
  const { mappings } = inputRelationship.find(relationship => relationship.targetInputId === inputId);

  const headers = [
    {
      title: t('Pages_WorkpaperProcess_Step1_InputRelationship_ViewMapping_Source_Output'),
      key: 'sourceFieldName',
      width: '19%',
      render: sourceFieldName => (
        <Flex position='relative'>
          <Box mb={5}>
            <Text>{sourceFieldName}</Text>
          </Box>
        </Flex>
      ),
    },
    {
      title: t('Pages_WorkpaperProcess_Step1_InputRelationship_ViewMapping_Target_Input'),
      key: 'targetFieldName',
      width: '19%',
      render: targetFieldName => (
        <Flex position='relative'>
          <Box mb={5}>
            <Text>{targetFieldName}</Text>
          </Box>
        </Flex>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      onClickOutside={handleClose}
      onSecondaryButtonClick={handleClose}
      secondaryButtonText={t('Close', 'General_')}
      size={ModalSizes.MEDIUM}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={9}>
        <Text type={TextTypes.H2} fontWeight='l'>
          {t(`Pages_WorkpaperProcess_Step1_InputRelationship_ViewMapping_Header`)}
        </Text>
        <Text type={TextTypes.BODY} mt={7}>
          {t(`Pages_WorkpaperProcess_Step1_InputRelationship_ViewMapping_Message`)}
        </Text>
        <Table rows={mappings} headers={headers} mt={7} />
      </Box>
    </Modal>
  );
};

export default InputMappingModal;
