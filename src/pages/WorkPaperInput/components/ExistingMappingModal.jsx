import React, { useState } from 'react';
import { Box, Modal, ModalSizes, Radio, Spinner, Table, Text, TextTypes } from 'cortex-look-book';
import { useSelector } from 'react-redux';
import { TRANSLATION_KEY } from '../constants/WorkPaperInputConstants';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { COMPONENT_NAME } from './constants';
import useTranslation from 'src/hooks/useTranslation';

const ExistingMappingModal = props => {
  const { isOpen, onClose, map } = props;
  const { t } = useTranslation();

  const [selectedMappingIndex, setSelectedMappingIndex] = useState(0);
  const existingMappings = useSelector(wpStep1Selectors.existingMappings);
  const isUpdating = useSelector(wpStep1Selectors.isUpdatingInput);

  const handleSelectedMapping = index => {
    setSelectedMappingIndex(index);
  };

  const headers = [
    {
      title: t(`${TRANSLATION_KEY}_ExistingMappingWorkpaperName`),
      key: 'workpaperName',
      width: '35%',
      render: (workpaperName, row) => (
        <Box>
          <Radio
            name='existing-mapping'
            label={
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={22} fontWeight='m'>
                {workpaperName}
              </Text>
            }
            value={row.id}
            checked={row.id === selectedMappingIndex}
            onOptionSelected={() => {
              handleSelectedMapping(row.id);
            }}
            fontWeight='m'
            dataInstance={`${COMPONENT_NAME}-Radio-${row.id}`}
          />
        </Box>
      ),
    },
    {
      title: t(`${TRANSLATION_KEY}_ExistingMappingFileName`),
      key: 'fileName',
      width: '65%',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      size={ModalSizes.MEDIUM}
      onClose={onClose}
      onPrimaryButtonClick={() => {
        map(existingMappings[selectedMappingIndex]);
      }}
      onSecondaryButtonClick={onClose}
      primaryButtonText={t(`${TRANSLATION_KEY}_ExistingMappingPrimaryButton`)}
      secondaryButtonText={t(`${TRANSLATION_KEY}_ExistingMappingSecondaryButton`)}
      disablePrimaryButton={isUpdating}
      disableSecondaryButton={isUpdating}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isUpdating} label={t(`${TRANSLATION_KEY}_ExistingMappingSpinner`)}>
        <Text type={TextTypes.H2} fontWeight='l' mb={4}>
          {t(`${TRANSLATION_KEY}_ExistingMappingTitle`)}
        </Text>
        <Text type={TextTypes.BODY} mb={9}>
          {t(`${TRANSLATION_KEY}_ExistingMappingDescription`)}
        </Text>
        <Table
          headers={headers}
          rows={existingMappings.map((mapping, index) => {
            return { id: index, ...mapping };
          })}
          mb={11}
          contentMaxHeight={300}
          minHeight={300}
          dataInstance={COMPONENT_NAME}
        />
      </Spinner>
    </Modal>
  );
};

export default ExistingMappingModal;
