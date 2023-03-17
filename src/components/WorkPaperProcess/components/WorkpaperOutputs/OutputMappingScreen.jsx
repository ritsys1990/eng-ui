import React, { useState, useEffect } from 'react';
import {
  Intent,
  StatusAlert,
  Modal,
  ModalSizes,
  Box,
  Flex,
  Container,
  Text,
  TextTypes,
  Spinner,
} from 'cortex-look-book';
import { COMPONENT_NAME, SELECT_WIDTH, ARROW_WIDTH } from './output.consts';
import { useSelector, useDispatch } from 'react-redux';
import {
  saveToSql,
  getOutputSchemaFromJob,
  getAndSyncFlowOutputs,
  tableauTailoring,
} from '../../../../store/workpaperProcess/step3/actions';
import { wpStep3Selectors } from '../../../../store/workpaperProcess/step3/selectors';
import OutputMappingSelect from './OutputMappingSelect';
import { getSqlTableName, getMappingTranslations } from './output.utils';
import { findIndex } from 'lodash';
import useTranslation from 'src/hooks/useTranslation';

const OutputMappingScreen = ({
  isModalOpen,
  setIsModalOpen,
  output,
  workpaperId,
  isCentralizedDSUpdated,
  savedToSql,
}) => {
  const dispatch = useDispatch();
  const [fieldMappings, setfieldMappings] = useState([]);
  const [fieldOptions, setfieldOptions] = useState([]);
  const [headerMessage, setHeaderMessage] = useState({});
  const isSavingToSql = useSelector(wpStep3Selectors.selectIsSavingToSql);
  const isLoadingSchema = useSelector(wpStep3Selectors.selectIsLoadingSchema);
  const { t } = useTranslation();
  const {
    mappingError,
    mappingSuccess,
    spinnerLabel,
    title,
    description,
    outputLabel,
    tableLabel,
  } = getMappingTranslations(t, savedToSql);

  const setMappings = opSchema => {
    const { mapping, mappingTableau } = output;
    const mappingType = savedToSql ? mapping : mappingTableau;
    const fieldOpts = (opSchema || [])
      .filter(x => !!x)
      .map(x => ({
        oldFieldName: x.name,
        newFieldName: x.name,
        ...(x.dateFormat && { dateFormat: x.dateFormat }),
      }));

    const fieldMaps = fieldOpts.map(x => {
      // Grab the new field name from previous map if exists.
      const currentMap = mappingType?.find(m => m.oldFieldName === x.oldFieldName);

      return { ...x, newFieldName: currentMap?.newFieldName || x.newFieldName };
    });

    setfieldMappings(fieldMaps);
    setfieldOptions(fieldOpts);
  };

  useEffect(() => {
    if (output?.nodePath) {
      dispatch(getOutputSchemaFromJob(output.nodePath, output.nodeId, workpaperId)).then(result => {
        if (!result) {
          setfieldMappings([]);
        } else {
          // set the fieldMappings
          setMappings(result);
        }
      });
    } else {
      setHeaderMessage({
        type: Intent.ERROR,
        showIcon: true,
        body: (
          <Text type={TextTypes.BODY} fontWeight='m' color='black'>
            {t('Components_OutputMappingScreen_OutputFileNotFound')}
          </Text>
        ),
      });
    }
  }, [output, isModalOpen]);

  const handleSaveToSql = tableName => {
    dispatch(saveToSql(output?.nodePath, output?.nodeId, output?.id, workpaperId, fieldMappings, tableName)).then(
      result => {
        if (!result || result?.status !== Intent.SUCCESS.toUpperCase()) {
          setHeaderMessage({
            type: Intent.ERROR,
            showIcon: true,
            body: (
              <Text type={TextTypes.BODY} fontWeight='m' color='black'>
                {mappingError}
              </Text>
            ),
          });
        } else {
          setHeaderMessage({
            type: Intent.SUCCESS,
            showIcon: true,
            body: (
              <Text type={TextTypes.BODY} fontWeight='m' color='black'>
                {`${mappingSuccess} ${tableName}`}
              </Text>
            ),
          });
        }
      }
    );
  };

  const saveTableauTailoring = tableName => {
    dispatch(tableauTailoring(output?.id, workpaperId, fieldMappings)).then(result => {
      if (!result) {
        setHeaderMessage({
          type: Intent.ERROR,
          showIcon: true,
          body: (
            <Text type={TextTypes.BODY} fontWeight='m' color='black'>
              {mappingError}
            </Text>
          ),
        });
      } else {
        setHeaderMessage({
          type: Intent.SUCCESS,
          showIcon: true,
          body: (
            <Text type={TextTypes.BODY} fontWeight='m' color='black'>
              {`${mappingSuccess} ${tableName}`}
            </Text>
          ),
        });
      }
    });
  };

  const handlePrimaryButtonClick = () => {
    const tableName = getSqlTableName(output);
    if (savedToSql) {
      handleSaveToSql(tableName);
    } else {
      saveTableauTailoring(tableName);
    }
  };

  const getSpinnerLabel = () => {
    if (isLoadingSchema) {
      return t('Components_OutputMappingScreen_LoadingSchema');
    }

    return spinnerLabel;
  };

  const getValue = element => {
    return [{ ...element }];
  };

  const handleSelectChange = (target, source) => {
    const fieldMaps = [...fieldMappings];
    const selectedMapping = fieldMaps.filter(fmap => fmap.oldFieldName.toLowerCase() === target.toLowerCase())[0];
    selectedMapping['newFieldName'] = source;
    setfieldMappings(fieldMaps);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // check for saveToSql is complete
    if (Object.keys(headerMessage).length !== 0) {
      dispatch(getAndSyncFlowOutputs(workpaperId));
    }
  };

  const getModalContent = () => {
    if (Object.keys(headerMessage).length !== 0) {
      return (
        <Box my={8}>
          <Flex>
            <StatusAlert type={headerMessage.type} showIcon={headerMessage.showIcon}>
              {headerMessage.body}
            </StatusAlert>
          </Flex>
        </Box>
      );
    }

    return (
      <Box width='100%'>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' color='black'>
            {title}
          </Text>
        </Flex>
        <Box mt={8}>
          <Flex>
            <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
              {description}
            </Text>
          </Flex>
        </Box>
        <Box my={8}>
          <Container mt={10}>
            <Box mt={9}>
              <Flex mb={4}>
                <Text type={TextTypes.H4} color='gray' width={SELECT_WIDTH}>
                  {outputLabel}
                </Text>
                <Box width={ARROW_WIDTH} />
                <Text type={TextTypes.H4} color='gray' width={SELECT_WIDTH}>
                  {tableLabel}
                </Text>
              </Flex>
              {fieldMappings &&
                fieldMappings.map((element, index) => (
                  <OutputMappingSelect
                    key={index}
                    isCentralizedDSUpdated={isCentralizedDSUpdated}
                    field={element.oldFieldName}
                    options={fieldOptions}
                    inputChangeDebounce={1000}
                    value={getValue(element)}
                    onFieldChange={handleSelectChange}
                    filtering
                  />
                ))}
            </Box>
          </Container>
        </Box>
      </Box>
    );
  };

  const getEmptyFields = () => {
    const index = findIndex(fieldMappings, function getUnmappedIndex(eachField) {
      return !eachField.newFieldName.trim();
    });

    return index > -1;
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      primaryButtonText={t('Components_OutputOptionsModal_Primary')}
      secondaryButtonText={t('Components_OutputOptionsModal_Secondary')}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      onSecondaryButtonClick={handleClose}
      size={ModalSizes.MEDIUM}
      dataInstance={COMPONENT_NAME}
      disablePrimaryButton={isSavingToSql || isLoadingSchema || !!headerMessage?.type || getEmptyFields()}
    >
      <Spinner spinning={isSavingToSql || isLoadingSchema} label={getSpinnerLabel()}>
        {getModalContent()}
      </Spinner>
    </Modal>
  );
};

export default OutputMappingScreen;
