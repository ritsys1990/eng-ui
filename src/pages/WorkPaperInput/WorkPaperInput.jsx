import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonTypes,
  Container,
  FilePreview,
  FilePreviewTypes,
  Flex,
  GapSizes,
  GridView,
  IconTypes,
  Spinner,
  Tag,
  Text,
  TextTypes,
  Toggle,
  Modal,
  ModalSizes,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useNavContext from '../../hooks/useNavContext';
import { useHistory, useParams } from 'react-router-dom';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import {
  getExistingMappings,
  getInput,
  getInputDetails,
  getInputFilePreview,
  resetInput,
  updateInput,
} from '../../store/workpaperProcess/step1/actions';
import {
  ARROW_WIDTH,
  LINE_LIMIT,
  NULL_FIELD,
  NULL_TYPE,
  SELECT_WIDTH,
  TRANSLATION_KEY,
  COMPONENT_NAME,
} from './constants/WorkPaperInputConstants';
import MappingSelect from './components/MappingSelect';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import ExistingMappingModal from './components/ExistingMappingModal';
import { WP_PROCESS_INPUT_ERRORS, WP_STATE_STATUS } from '../WorkPaperProcess/constants/WorkPaperProcess.const';
import { wpStep1Selectors } from '../../store/workpaperProcess/step1/selectors';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
const WorkPaperInput = props => {
  const { match } = props;
  const { workpaperId, inputId } = useParams();
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [showUnMapped, setShowUnMapped] = useState(true);

  const [existingMappingIsOpen, setExistingMappingIsOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const isCentralizedDSUpdated = useSelector(wpProcessSelectors.isCentralizedDSUpdated);
  const input = useSelector(wpStep1Selectors.selectInput);
  const preview = useSelector(wpStep1Selectors.preview);
  const existingMappings = useSelector(wpStep1Selectors.existingMappings);
  const isLoading = useSelector(wpStep1Selectors.isMappingScreenLoading);
  const inputDetails = useSelector(wpStep1Selectors.inputDetails);
  const isFetchingMappingsreenPreview = useSelector(wpStep1Selectors.isFetchingMappingsreenPreview);

  const isUpdating = useSelector(wpStep1Selectors.isUpdatingInput);

  useEffect(() => {
    dispatch(getWorkpapersDetails(workpaperId)).then(wpResponse => {
      dispatch(getInput(workpaperId, inputId)).then(response => {
        if (response.nodeId) {
          dispatch(
            getInputFilePreview(
              response.nodeId,
              response?.fileDelimiter,
              workpaperId,
              wpResponse?.engagementId,
              wpResponse?.trifactaFlowId
            )
          );
        } else {
          dispatch(getInputDetails(workpaperId, inputId));
        }
      });
    });

    return () => {
      dispatch(resetInput());
    };
  }, [dispatch, workpaperId, inputId]);

  useEffect(() => {
    if (input && input?.id === inputId && input?.error?.code !== WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED) {
      setShowUnMapped(false);
    } else if (input?.id !== inputId) {
      setShowUnMapped(true);
    }
  }, [input, inputId]);

  useEffect(() => {
    if (input?.name) {
      document.title = `${input?.name} ${t('PageTitle_Separator')} ${t('PageTitle_AppName')}`;
    } else {
      document.title = t('PageTitle_AppName');
    }
  }, [input]);

  useEffect(() => {
    if (workpaper?.engagementId) {
      dispatch(getExistingMappings(workpaper.engagementId));
    }
  }, [dispatch, workpaper]);

  useEffect(() => {
    if (readOnlyfromWP && isCentralizedDSUpdated && workpaper?.status === WP_STATE_STATUS.DRAFT && input?.error) {
      setReadOnly(false);
    } else {
      setReadOnly(readOnlyfromWP);
    }
  }, [readOnlyfromWP, isCentralizedDSUpdated, workpaper, input]);

  const handleRefresh = () => {
    const newInput = { ...input };

    newInput.mappings.forEach((mapping, index) => {
      if (mapping.source.length > 0) {
        newInput.mappings[index].automap = true;
      }
    });
    dispatch(updateInput(workpaperId, inputId, newInput.mappings, null, false, workpaper?.trifactaFlowId));
  };

  const navigateToWorkpaper = () => {
    if (workpaper?.isDMT) {
      history.push(`/library/datamodelTransformations/${workpaperId}`);
    } else if (workpaper?.bundleTransformation) {
      history.push(`/library/bundleTransformations/${workpaperId}`);
    } else {
      history.push(workpaper?.engagementId ? `/workpapers/${workpaperId}` : `/library/workpapers/${workpaperId}`);
    }
  };

  const handleBackToWorkpaper = (showPopup = true) => {
    if (input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED && showPopup) {
      setIsCompleteModalOpen(true);
    } else {
      navigateToWorkpaper();
    }
  };

  const handleSelectChange = (target, source) => {
    const newInput = { ...input };
    const index = newInput.mappings.findIndex(map => map.target === target);
    newInput.mappings[index].source = source;
    newInput.mappings[index].automap = false;
    dispatch(updateInput(workpaperId, inputId, newInput.mappings, null, false, workpaper?.trifactaFlowId));
  };

  const handleComplete = () => {
    const newInput = { ...input };

    newInput.mappings.forEach((mapping, index) => {
      if (mapping.source.length === 0) {
        newInput.mappings[index].source = NULL_FIELD;
      }
    });
    dispatch(updateInput(workpaperId, inputId, newInput.mappings, null, true, workpaper?.trifactaFlowId)).then(
      response => {
        if (response) {
          navigateToWorkpaper();
        }
      }
    );
  };

  const handleExistingMapping = existingMapping => {
    const newInput = { ...input };
    const reverseMapping = {};

    const keys = Object.keys(existingMapping.mapping);
    keys.forEach(key => {
      reverseMapping[existingMapping.mapping[key]] = key;
    });

    newInput.mappings.forEach((mapping, index) => {
      if (Object.prototype.hasOwnProperty.call(reverseMapping, mapping.target)) {
        const source = reverseMapping[mapping.target];
        const validSource = newInput.schema.find(element => element.name === source);
        if (validSource) {
          newInput.mappings[index].source = source;
        } else {
          newInput.mappings[index].source = '';
        }
      } else {
        newInput.mappings[index].source = '';
      }
      newInput.mappings[index].automap = false;
    });
    dispatch(
      updateInput(workpaperId, inputId, newInput.mappings, existingMapping, true, workpaper?.trifactaFlowId)
    ).then(response => {
      if (response) {
        handleBackToWorkpaper(false);
      }
    });
  };

  const getValue = element => {
    const mapping = input?.mappings.find(e => e.target === element.name);
    if (!mapping || mapping.source === NULL_TYPE) {
      return [{ value: NULL_FIELD, name: NULL_FIELD }];
    }

    return [{ value: mapping.source, name: mapping.source }];
  };

  const getFieldsCount = useCallback(
    isMandatory => {
      return (input?.schema || []).filter(field => {
        return field.isMandatory === isMandatory && !input.mappings.find(mapping => mapping.source === field.name);
      }).length;
    },
    [input]
  );

  const checkEmptyFields = () => {
    let emptyFields = false;
    if (input?.mappings) {
      for (let i = 0; i < input.mappings.length; ++i) {
        if (input.mappings[i].source.length === 0) {
          emptyFields = true;
          break;
        }
      }
    }

    return emptyFields;
  };

  return (
    <Spinner
      spinning={isLoading}
      overlayOpacity={0}
      minHeight='calc(100vh - 120px)'
      size={32}
      pathSize={4}
      label=''
      optionalRender
    >
      <Container backgroundColor='white'>
        <Breadcrumbs crumbs={crumbs} fontSize='s' fontWeight='m' pt={8} />
        <Text type={TextTypes.H1} mt={11}>
          {input?.name}
        </Text>
      </Container>
      <Box pt={9} backgroundColor='white'>
        <Spinner spinning={isFetchingMappingsreenPreview} label='fetching the preview'>
          <FilePreview
            type={FilePreviewTypes.FULL_SCREEN}
            json={input?.nodeId ? preview?.data : inputDetails?.data}
            limit={LINE_LIMIT}
            dataInstance={`${COMPONENT_NAME}-FilePreview`}
          />
        </Spinner>
      </Box>
      {input?.mappings && (
        <Container mt={10}>
          <Text type={TextTypes.H2}>
            {input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED
              ? t(`${TRANSLATION_KEY}_UnMappedTitle`)
              : t(`${TRANSLATION_KEY}_CompletedTitle`)}
          </Text>

          {checkEmptyFields() && (
            <Box mt={3}>
              <Text type={TextTypes.CAPTION}>{t(`${TRANSLATION_KEY}_DoNotImport`)}</Text>
            </Box>
          )}

          <Spinner spinning={isUpdating} label={t(`${TRANSLATION_KEY}_Spinner`)}>
            {input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED && (
              <Flex mt={5} alignItems='center'>
                <Toggle
                  value={readOnly ? !readOnly : showUnMapped}
                  onChange={() => {
                    setShowUnMapped(readOnly ? !readOnly : !showUnMapped);
                  }}
                  dataInstance={`${COMPONENT_NAME}`}
                />
                <Box ml={4}>
                  <Text type={TextTypes.BODY}>
                    {t(`${TRANSLATION_KEY}_OnlyUnMapped`)}
                    <Button
                      ml={2}
                      display='inline-block'
                      forwardedAs='span'
                      disabled={!input?.error || readOnly}
                      type={ButtonTypes.LINK}
                      onClick={handleRefresh}
                      dataInstance={`${COMPONENT_NAME}-Refresh`}
                    >
                      {t(`${TRANSLATION_KEY}_Refresh`)}
                    </Button>
                  </Text>
                </Box>
              </Flex>
            )}
            {input?.existingMapping && (
              <Box mt={9} maxWidth='500px'>
                <Text type={TextTypes.H3} mb={4} fontWeight='m'>
                  {t(`${TRANSLATION_KEY}_ExistingMappingUsing`)}
                </Text>
                <GridView gap={GapSizes.XXS} itemsPerRow={2} dataInstance={COMPONENT_NAME}>
                  <Text type={TextTypes.BODY}>{t(`${TRANSLATION_KEY}_ExistingMappingWorkpaperName`)}</Text>
                  <Text type={TextTypes.BODY}>{t(`${TRANSLATION_KEY}_ExistingMappingFileName`)}</Text>
                  <Tag>{input.existingMapping.workpaperName}</Tag>
                  <Tag>{input.existingMapping.fileName}</Tag>
                </GridView>
              </Box>
            )}
            {existingMappings?.length > 0 && input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED && (
              <Box mt={9}>
                <Button
                  color='blue4'
                  type={ButtonTypes.FLAT}
                  icon={IconTypes.COPY}
                  iconWidth={32}
                  onClick={() => {
                    setExistingMappingIsOpen(true);
                  }}
                  dataInstance={`${COMPONENT_NAME}-SetExisting`}
                >
                  {t(`${TRANSLATION_KEY}_ExistingMapping`)}
                </Button>
                <ExistingMappingModal
                  isOpen={existingMappingIsOpen}
                  onClose={() => {
                    setExistingMappingIsOpen(false);
                  }}
                  map={handleExistingMapping}
                />
              </Box>
            )}
            <Box mt={9}>
              <Flex mb={2}>
                <Text type={TextTypes.H4} color='gray' width={SELECT_WIDTH}>
                  {t(`${TRANSLATION_KEY}_UserInput`)}
                </Text>
                <Box width={ARROW_WIDTH} />
                <Text type={TextTypes.H4} color='gray' width={SELECT_WIDTH}>
                  {t(`${TRANSLATION_KEY}_WorkpaperTemplate`)}
                </Text>
              </Flex>
              {input.mappings &&
                (input?.fileSchema || [])
                  .filter(element => {
                    if (showUnMapped) {
                      return !input?.mappings?.find(e => e.target === element.name)?.automap;
                    }

                    return true;
                  })
                  .map((element, index) => (
                    <MappingSelect
                      key={index}
                      field={element.name}
                      disabled={input?.error?.code !== WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED || readOnly}
                      value={getValue(element)}
                      selectedOptions={(input?.mappings || []).map(map => map.source)}
                      mandatoryFields={(input?.schema || [])
                        .filter(model => model.isMandatory)
                        .map(model => {
                          return { name: model.name, value: model.name };
                        })}
                      nonMandatoryFields={(input?.schema || [])
                        .filter(model => !model.isMandatory)
                        .map(model => {
                          return { name: model.name, value: model.name };
                        })}
                      onFieldChange={handleSelectChange}
                    />
                  ))}
            </Box>

            <Box mt={6}>
              <Text type={TextTypes.H3} fontWeight='m'>
                {t(`${TRANSLATION_KEY}_UnMapped`)}
              </Text>
              <Text type={TextTypes.BODY} mt={3}>
                {t(`${TRANSLATION_KEY}_Mandatory`)}
                {': '}
                {getFieldsCount(true)}
              </Text>
              <Text type={TextTypes.BODY} mt={2}>
                {t(`${TRANSLATION_KEY}_NonMandatory`)}
                {': '}
                {getFieldsCount(false)}
              </Text>
            </Box>
          </Spinner>
          <Flex justifyContent='flex-end' mt={11} mb={12}>
            <Button
              type={ButtonTypes.SECONDARY}
              onClick={handleBackToWorkpaper}
              dataInstance={`${COMPONENT_NAME}-Continue`}
            >
              {t(`${TRANSLATION_KEY}_BackToWorkpaper`)}
            </Button>
          </Flex>
        </Container>
      )}
      <Modal
        isOpen={isCompleteModalOpen}
        size={ModalSizes.SMALL}
        primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onPrimaryButtonClick={handleComplete}
        secondaryButtonText={t('NO', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
        onSecondaryButtonClick={() => {
          setIsCompleteModalOpen(false);
        }}
        disablePrimaryButton={isUpdating}
        disableSecondaryButton={isUpdating}
        dataInstance={`${COMPONENT_NAME}`}
      >
        <Text pb={6}>{t(`${TRANSLATION_KEY}_Warning`)}</Text>
      </Modal>
    </Spinner>
  );
};

export default WorkPaperInput;
