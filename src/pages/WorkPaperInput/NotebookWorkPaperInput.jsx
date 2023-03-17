import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Breadcrumbs,
  Button,
  ButtonTypes,
  Container,
  Flex,
  Spinner,
  Text,
  TextTypes,
  Toggle,
  Modal,
  ModalSizes,
  FilePreview,
  FilePreviewTypes,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useNavContext from '../../hooks/useNavContext';
import { useParams, useHistory } from 'react-router-dom';
import { getWorkpapersDetails } from '../../store/workpaperProcess/actions';
import {
  getInput,
  resetInput,
  updateInput,
  getInputFilePreview,
} from '../../store/notebookWorkpaperProcess/step1/actions';
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
import { WP_PROCESS_INPUT_ERRORS } from '../WorkPaperProcess/constants/WorkPaperProcess.const';
import { notebookWPStep1Selector } from '../../store/notebookWorkpaperProcess/step1/selectors';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
const NotebookWorkPaperInput = props => {
  const { match } = props;
  const { workpaperId, inputId, workpaperType } = useParams();
  const { crumbs } = useNavContext(match);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [showUnMapped, setShowUnMapped] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [manualMappings, setManualMappings] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const input = useSelector(notebookWPStep1Selector.selectInput);
  const isLoading = useSelector(notebookWPStep1Selector.isMappingScreenLoading);
  const preview = useSelector(notebookWPStep1Selector.preview);
  const isFetchingMappingsreenPreview = useSelector(notebookWPStep1Selector.isFetchingMappingsreenPreview);

  const navigateToWorkpaper = () => {
    history.push(`/library/workpapers/${workpaperId}`);
  };

  const handleBackToWorkpaper = (showPopup = true) => {
    if (input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED && showPopup) {
      setIsCompleteModalOpen(true);
    } else {
      navigateToWorkpaper();
    }
  };

  const handleSelectChange = (target, source) => {
    const newMappings = [...manualMappings];
    const index = newMappings?.findIndex(map => map.target === target);
    newMappings[index].source = source;
    newMappings[index].automap = false;

    setManualMappings(newMappings);
  };

  const handleComplete = () => {
    const newMappings = [...manualMappings];

    newMappings?.forEach((mapping, index) => {
      if (mapping.source.length === 0) {
        newMappings[index].source = NULL_FIELD;
      }
    });
    dispatch(updateInput(inputId, newMappings)).then(response => {
      if (response) {
        navigateToWorkpaper();
      }
    });
  };

  const getValue = element => {
    const mapping = manualMappings?.find(e => e.target === element.name);

    if (!mapping || mapping.source === NULL_TYPE) {
      return [{ value: NULL_FIELD, name: NULL_FIELD }];
    }

    return [{ value: mapping.source, name: mapping.source }];
  };

  const getFieldsCount = useCallback(
    isMandatory => {
      return (input?.schema || []).filter(field => {
        return field.isMandatory === isMandatory && !manualMappings?.find(mapping => mapping.source === field.name);
      }).length;
    },
    [input]
  );

  const checkEmptyFields = () => {
    let emptyFields = false;
    if (manualMappings) {
      for (let i = 0; i < manualMappings.length; ++i) {
        if (manualMappings[i].source.length === 0) {
          emptyFields = true;
          break;
        }
      }
    }

    return emptyFields;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    const newMappings = [...manualMappings];

    newMappings.forEach((mapping, index) => {
      if (mapping.source.length > 0) {
        newMappings[index].automap = true;
      }
    });
    setManualMappings(newMappings);
  };

  useEffect(() => {
    dispatch(getWorkpapersDetails(workpaperId, workpaperType)).then(() => {
      dispatch(getInput(workpaperId, inputId, workpaperType)).then(() => {
        dispatch(getInputFilePreview(inputId));
      });
    });

    return () => {
      dispatch(resetInput());
    };
  }, [dispatch, workpaperId, inputId, workpaperType]);

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
    if (input) {
      const fileSchema = input?.fileSchema;
      const mappings = input?.mappings;

      const mappingResult = fileSchema?.map(schema => {
        let manualMapping;
        const result = mappings?.filter(mapping => mapping.target === schema.name)[0];
        if (result) {
          manualMapping = result;
        } else {
          manualMapping = {
            source: '',
            target: schema.name,
            automap: false,
          };
        }

        return manualMapping;
      });

      if (mappingResult) {
        setManualMappings(mappingResult);
      }
    }
  }, [input]);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

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
            json={preview?.data}
            limit={LINE_LIMIT}
            dataInstance={`${COMPONENT_NAME}-FilePreview`}
          />
        </Spinner>
      </Box>
      {manualMappings && (
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

          <Spinner spinning={isRefreshing} label={t(`${TRANSLATION_KEY}_Spinner`)}>
            {input?.error?.code === WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED && (
              <Flex mt={5} alignItems='center'>
                <Toggle
                  value={showUnMapped}
                  onChange={() => {
                    setShowUnMapped(!showUnMapped);
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
                      disabled={!input?.error}
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
              {manualMappings &&
                (input?.fileSchema || [])
                  .filter(element => {
                    if (showUnMapped) {
                      return !manualMappings?.find(e => e.target === element.name)?.automap;
                    }

                    return true;
                  })
                  .map((element, index) => (
                    <MappingSelect
                      key={index}
                      field={element.name}
                      disabled={input?.error?.code !== WP_PROCESS_INPUT_ERRORS.AUTOMAP_FAILED}
                      value={getValue(element)}
                      selectedOptions={(manualMappings || []).map(map => map.source)}
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
        dataInstance={`${COMPONENT_NAME}`}
      >
        <Text pb={6}>{t(`${TRANSLATION_KEY}_Warning`)}</Text>
      </Modal>
    </Spinner>
  );
};

export default NotebookWorkPaperInput;
