/* eslint-disable no-unused-vars */
/* eslint-disable prefer-template */
/* eslint-disable no-eval */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from '../../../../../../hooks/useTranslation';
import { Box, Flex, TextTypes, Text, RadioGroup, Input, Intent, Spinner } from 'cortex-look-book';
import { noop } from '../../../../../../utils/errorHelper';
import { DMFieldContainer } from '../../../DataModelDetail/components/AddDMFieldModal/DMFieldModal.styled';
import { getIngestDMRenameOptions } from '../../../utils/DataModelsHelper';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { useSelector } from 'react-redux';

const IngestDataModelRenameOptions = props => {
  const { value, onSelected, dataInstance, setDmRenameValue, dmRenameValue } = props;

  const { t } = useTranslation();
  const isIngestingDataModel = useSelector(contentLibraryDMSelectors.isIngestingDataModel);
  const { dataModelName } = useSelector(contentLibraryDMSelectors.ingestingModalContent);

  const [dmNameError, setDMNameError] = useState('');

  useEffect(() => {
    if (value === 'newName') {
      const currentDMName = dmRenameValue === '' ? dataModelName : dmRenameValue;
      if (!currentDMName?.length) setDMNameError(t('Components_AddNewWorkpaperModal_Validation_Error'));
      else if (currentDMName?.includes('.')) setDMNameError(t('Components_AddDMModal_Validation_Error'));
      else setDMNameError('');
    }
  }, [dmRenameValue, value]);

  const options = getIngestDMRenameOptions(t);
  const infoHeaderPrefix = t('Components_Modal_Ingest_Content_DM_Rename_Info_Header_Prefix');
  const infoHeaderSuffix = t('Components_Modal_Ingest_Content_DM_Rename_Info_Header_Suffix');
  const ingestingLabel = t('Components_Modal_Ingest_Content_DM_Ingesting') || 'Loading...';

  return (
    <Spinner spinning={isIngestingDataModel} label={ingestingLabel}>
      <Box width='100%' dataInstance={`${dataInstance}`}>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' dataInstance={`${dataInstance}-Header`}>
            {t('Components_Modal_Ingest_Content_DM_Rename_Header')}
          </Text>
        </Flex>
        <Flex my={8}>
          <Text type={TextTypes.BODY} fontWeight='s' dataInstance={`${dataInstance}-InfoHeader`}>
            {infoHeaderPrefix}
            <b>{` "${dataModelName}" `}</b>
            {infoHeaderSuffix}
          </Text>
        </Flex>
        <Box my={8}>
          <RadioGroup
            dataInstance={`${dataInstance}-Options`}
            fontWeight='s'
            name='uploader'
            options={options}
            selectedValue={value || ''}
            py={8}
            borderColor='lightGray'
            borderTop={1}
            borderBottom={1}
            onOptionChange={onSelected}
          />
        </Box>
        {value === 'newName' && (
          <DMFieldContainer>
            <Input
              required
              label={t('Components_Modal_Ingest_Content_DM_Rename_New_DM_Name')}
              value={dmRenameValue || dataModelName}
              hint={dmNameError}
              intent={dmNameError ? Intent.ERROR : ''}
              onChange={e => setDmRenameValue(e.currentTarget.value)}
              placeholder={t('Components_Modal_Ingest_Content_DM_Rename_New_DM_Name_Placholder')}
              dataInstance={`${dataInstance}-FieldNameTech`}
            />
          </DMFieldContainer>
        )}
      </Box>
    </Spinner>
  );
};

export default IngestDataModelRenameOptions;

IngestDataModelRenameOptions.propTypes = {
  value: PropTypes.string,
  onSelected: PropTypes.func,
  dataInstance: PropTypes.string,
  setDmRenameValue: PropTypes.func,
  dmRenameValue: PropTypes.string,
};

IngestDataModelRenameOptions.defaultProps = {
  value: '',
  onSelected: noop,
  dataInstance: '',
  setDmRenameValue: noop,
  dmRenameValue: '',
};
