import React, { useEffect, useState } from 'react';
import useTranslation, { nameSpaces } from '../../../../../../hooks/useTranslation';
import {
  Box,
  Flex,
  TextTypes,
  Text,
  Modal,
  Input,
  ModalSizes,
  Icon,
  IconTypes,
  Tooltip,
  TooltipPosition,
  RadioGroup,
} from 'cortex-look-book';
import { getDMTSourceOptions } from '../../../utils/DataModelsHelper';

const AddNewDMTModal = props => {
  const { isOpen, handleClose, dmtName, handleSubmit, dmtSource } = props;
  const { t } = useTranslation();
  const [dmtInputName, setDMTInputName] = useState('');
  const [dmtType, setDmtType] = useState(getDMTSourceOptions(t)[0].value);

  const PAGE_NAME = 'CL_DMTS_ADD_NEW_DMT';

  useEffect(() => {
    setDMTInputName(dmtName);
  }, [dmtName]);

  useEffect(() => {
    if (dmtSource) {
      setDmtType(dmtSource);
    }
  }, [dmtSource]);

  const closeModal = () => {
    setDMTInputName('');
    setDmtType(getDMTSourceOptions(t)[0].value);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      onPrimaryButtonClick={() => handleSubmit({ dmtInputName, dmtType })}
      onSecondaryButtonClick={closeModal}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
      dataInstance={`${PAGE_NAME}-Modal`}
      disablePrimaryButton={!dmtInputName || !dmtInputName.trim() || dmtInputName === dmtName}
    >
      <Box width='100%'>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${PAGE_NAME}-Header`}>
            {dmtName ? t(`Pages_Content_Library_DMTS_EDIT_DMT`) : t(`Pages_Content_Library_DMTS_ADD_NEW_DMT`)}
          </Text>
        </Flex>
        <Box my={8}>
          <Input
            required
            label={t('Pages_Content_Library_DMTS_NEW_DMT_NAME')}
            value={dmtInputName}
            onChange={e => setDMTInputName(e.currentTarget.value)}
            placeholder={t('Components_AddNewWorkpaperModal_Name_Placeholder')}
            dataInstance={`${PAGE_NAME}-NameInput`}
          />
        </Box>
        <Box>
          <Flex alignItems='center' mb={5}>
            <Text type={TextTypes.H4} fontWeight='m' mr={1} dataInstance={`${PAGE_NAME}-HeaderText-DMTtype`}>
              {t('Pages_Content_Library_AddNewDMTModal_DMTType')}
            </Text>
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.BOTTOM}
              tooltipContent={t('Pages_Content_Library_AddNewDMTModal_DMTType_Tooltip')}
              showOnHover
              width={220}
              dataInstance={`${PAGE_NAME}-Tooltip-DMTtype`}
            >
              <Icon
                type={IconTypes.INFO}
                height={20}
                width={20}
                color='blue'
                dataInstance={`${PAGE_NAME}-Tooltip-Icon-DMTtype`}
              />
            </Tooltip>
          </Flex>

          <RadioGroup
            dataInstance={`${PAGE_NAME}-RadioButton-DMTtype`}
            fontSize='xs'
            fontWeight='s'
            name='dmtSource'
            mb={4}
            options={getDMTSourceOptions(t)}
            selectedValue={dmtType}
            disabledButtons={!!dmtName}
            onOptionChange={value => {
              setDmtType(value);
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default AddNewDMTModal;
