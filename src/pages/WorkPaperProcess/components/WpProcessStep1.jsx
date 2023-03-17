import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  Flex,
  IconTypes,
  Modal,
  ModalSizes,
  Table,
  Tag,
  Text,
  TextTypes,
  useInterval,
  Tooltip,
  TooltipPosition,
  Icon,
  Link,
  Spinner,
  AlertHub,
  Alert,
  AlertTypes,
  RadioGroup as RadioGroupObj,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import InputUploaderModal from '../../../components/InputUploaderModal/InputUploaderModal';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { InputUploadStatusProgress } from './InputUploadStatus/InputUploadStatusProgress';
import { InputUploadStatusText } from './InputUploadStatus/InputUploadStatusText';
import { InputUploadStatusIcon } from './InputUploadStatus/InputUploadStatusIcon';
import {
  WP_PROCESS_INPUT_PROCESSING_STATUSES,
  WP_PROCESS_INPUT_STATUS,
  WP_STATUS,
  WP_PROCESS_INPUT_ERRORS,
  COMPONENT_NAME,
} from '../constants/WorkPaperProcess.const';
import { WrapupStatus } from '../../ClientSetup/components/Engagement/constants/engagment.constants';
import { useHistory, useParams } from 'react-router-dom';
import {
  getWPStep1Details,
  deleteTrifactaDataset,
  downloadInputFileExample,
} from '../../../store/workpaperProcess/step1/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { engagementSelectors } from '../../../store/engagement/selectors';
import { securitySelectors } from '../../../store/security/selectors';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { resetInputFileErrors } from '../../../store/errors/actions';
import { errorsSelectors } from '../../../store/errors/selectors';
import env from 'env';
import { ThemeContext } from 'styled-components';
import LargeFileWarningModal from '../../../components/InputUploaderModal/components/LargeFileWarning/LargeFileWarningModal';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { getDataModelListData } from '../../../store/bundles/actions';
import { bundlesSelectors } from '../../../store/bundles/selectors';
import useConfig from 'src/components/WorkPaperProcess/hooks/useConfig';
import useIsSpecificRoute from 'src/hooks/useIsSpecificRoute';
import { shouldSendMessageRoutes } from 'src/constants/pipelineMessages';

const REFRESH_INTERVAL = 3000; // 3 seconds

// eslint-disable-next-line sonarjs/cognitive-complexity
const WpProcessStep1 = ({ template, canvasType, workpaper }) => {
  const { t } = useTranslation();
  const [selectedInput, setSelectedInput] = useState(null);
  const [isUploaderShown, setIsUploaderShown] = useState(false);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [isInputOptionModalShown, setIsInputOptionModalShown] = useState(false);
  const [isLargeFileWarningShown, setIsLargeFileWarningShown] = useState(false);
  const [activeOption, setActiveOption] = useState(false);
  const [allRowStatus, setAllRowStatus] = useState(false);
  const [isAnyInputProcessing, setIsAnyInputProcessing] = useState(false);
  const isDatasetDeleting = useSelector(wpStep1Selectors.isDatasetDeleting);
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const [shouldClean, setShouldClean] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [showOutdatedVersionInfo, setShowOutdatedVersionInfo] = useState(true);
  const history = useHistory();
  const theme = useContext(ThemeContext);
  const { workpaperId } = useParams();
  const { config } = useConfig(canvasType);

  const dispatch = useDispatch();
  const readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const wpStatus = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  const isLoading = useSelector(wpStep1Selectors.selectIsLoading);
  const inputOptionErrors = useSelector(errorsSelectors.selectInputOptionsErrors);
  const outdatedDatamodels = useSelector(wpStep1Selectors.selectOutdatedDatamodels);
  const isDownloadingExampleFile = useSelector(wpStep1Selectors.isDownloadingExampleFile);
  const isFetchingDataModelList = useSelector(bundlesSelectors.selectIsFetchingDataModelList);
  const dataModelList = useSelector(bundlesSelectors.selectDataModelList);
  const selectMeRoles = useSelector(securitySelectors.selectMeRoles);
  const shouldSendMessage = useIsSpecificRoute(shouldSendMessageRoutes);

  const checkIsAnyInputProcessing = useCallback(() => {
    const isProcessing = inputs.some(
      input => !input.error && WP_PROCESS_INPUT_PROCESSING_STATUSES.includes(input.status)
    );
    setIsAnyInputProcessing(isProcessing);
  }, [inputs]);

  useInterval(() => {
    if (isAnyInputProcessing && !isLoading && errorCount < 3) {
      dispatch(getWPStep1Details(workpaperId)).then(response => {
        if (!response) {
          setErrorCount(errorCount + 1);
        }
      });
    }
  }, REFRESH_INTERVAL);

  useEffect(() => {
    dispatch(getWPStep1Details(workpaperId, true));
  }, [dispatch, workpaperId]);

  useEffect(() => {
    checkIsAnyInputProcessing();
    const dataModelsInputs = inputs.filter(i => i.datamodelId !== null).map(i => i.datamodelId);
    if (dataModelsInputs.length > 0 && dataModelList.length === 0) {
      dispatch(getDataModelListData(dataModelsInputs));
    }
  }, [inputs]);

  const isAddDisabled = () => {
    let isButtoNDisabled = false;

    if (readOnlyfromWP || engagement?.wrapupStatus === WrapupStatus.COMPLETE) {
      isButtoNDisabled = true;
    } else if (config?.step1?.disableAddForRoles?.length > 0) {
      isButtoNDisabled = [...selectMeRoles.app].some(eachAppRole => {
        return config.step1.disableAddForRoles.includes(eachAppRole.name);
      });
    }

    return isButtoNDisabled;
  };

  const onAcceptWarning = () => {
    setIsWarningShown(false);
    setIsUploaderShown(true);
  };

  const onCloseWarning = () => {
    setIsWarningShown(false);
  };

  const onCloseLargeFileWarning = () => {
    setIsLargeFileWarningShown(false);
  };

  const onAddFile = id => {
    setSelectedInput(id);
    setShouldClean(false);

    return WP_STATUS.NOT_STARTED !== wpStatus.status ? setIsWarningShown(true) : setIsUploaderShown(true);
  };

  const onReplaceFile = id => {
    setSelectedInput(id);
    setShouldClean(true);

    return WP_STATUS.NOT_STARTED !== wpStatus.status ? setIsWarningShown(true) : setIsUploaderShown(true);
  };

  const getRowStatus = () => {
    const everyInput = inputs.every(input => {
      return input.status === null;
    });
    setAllRowStatus(everyInput);
  };

  const onOpenInputOptions = row => {
    setSelectedInput(row);
    setIsInputOptionModalShown(true);
  };

  const onCloseInputOptions = () => {
    setIsInputOptionModalShown(false);
    setActiveOption(false);
  };

  const isInputProcessing = input =>
    !input.error &&
    (WP_PROCESS_INPUT_STATUS.MAPPING === input.status ||
      WP_PROCESS_INPUT_STATUS.UPLOADING === input.status ||
      WP_PROCESS_INPUT_STATUS.VALIDATING === input.status);

  const handleGoToMappingScreen = (wpId, inputData) => {
    if (
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_ERROR ||
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING ||
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_MAPPING_ERROR
    ) {
      window.location.href = `${env.ANALYTICSUI_URL}/data-models/${inputData?.clonedDataModelId}/${wpId}/engagement-ui/input-workbench`;
    } else if (inputData.status && !isInputProcessing(inputData)) {
      history.push(`/workpapers/${wpId}/inputs/${inputData.id}`);
    }
  };

  const onSubmitInputOptions = () => {
    if (activeOption) {
      dispatch(
        deleteTrifactaDataset(
          selectedInput.id,
          workpaper.id,
          workpaper.engagementId,
          canvasType,
          selectedInput.datamodelId,
          shouldSendMessage
        )
      ).then(response => {
        if (response) {
          onCloseInputOptions();
        }
      });
    }
  };

  const onSelectedOptions = event => setActiveOption(event);

  const getModalContent = () => {
    const radioOptions = [
      {
        value: 'delete_input',
        text: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER'),
        desc: t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_DELETE_INPUT_DATA_TABLE_FROM_WORKPAPER_DESC'),
      },
    ];

    const updatedRadioOptions = radioOptions.map(option => {
      return { ...option };
    });

    return (
      <Box width='100%'>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' color='black'>
            {t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_TITLE')}
          </Text>
          <Text type={TextTypes.H2} fontWeight='s' pl={2} color='gray'>
            {t('Components_WOPROCESSSTEP1_INPUTOPTION_NAME_OPTIONS')}
          </Text>
        </Flex>
        <Box mt={8}>
          <Flex>
            <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
              {t('Components_WOPROCESSSTEP1_INPUTOPTION_TODO')}
            </Text>
          </Flex>
        </Box>
        <Box my={8}>
          <RadioGroupObj
            dataInstance={COMPONENT_NAME}
            selectedValue={activeOption || ''}
            onOptionChange={event => {
              onSelectedOptions(event);
            }}
            fontWeight='s'
            name='input_options'
            options={updatedRadioOptions}
            py={8}
            borderColor='lightGray'
            borderTop={1}
            borderBottom={1}
          />
        </Box>
      </Box>
    );
  };

  const onDownloadInputExampleFile = (nodeId, fileName) => {
    dispatch(downloadInputFileExample(nodeId, fileName));
  };

  const getFileExampleColSpan = row => {
    const addFileCell =
      row.status === WP_PROCESS_INPUT_STATUS.DONE || (row.fileHistory && row.error && !row.attachOptions?.shouldClean);
    const replaceFileCell = row.status === WP_PROCESS_INPUT_STATUS.DONE || row.error;

    let value = 1;

    if (!addFileCell) {
      value++;
    }
    if (!replaceFileCell) {
      value++;
    }

    return value > 1 ? value.toString() : null;
  };

  const headers = [
    {
      title: t('Pages_WorkpaperProcess_Step1_Table_DataColumnLabel'),
      key: 'name',
      width: '19%',
      headerStyles: {
        paddingLeft: theme.space[8] + 12,
      },
      render: (name, row) => (
        <Flex
          cursor='pointer'
          position='relative'
          pl={8}
          justifyContent='flex-start'
          alignItems='center'
          onClick={() => handleGoToMappingScreen(workpaperId, row)}
        >
          {row?.datamodelId && outdatedDatamodels.includes(row.datamodelId) && (
            <Tooltip
              display='inline-block'
              direction={TooltipPosition.RIGHT}
              showOnHover
              tooltipContent={t('Pages_WorkpaperProcess_Step1_Outdated_Datamodel')}
              dataInstance={COMPONENT_NAME}
            >
              <Icon
                sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-50%, -50%)' }}
                type={IconTypes.WARNING_NO_CIRCLE}
                height={28}
                width={28}
              />
            </Tooltip>
          )}
          <Box mr={4}>
            <InputUploadStatusIcon inputStatusData={row} />
          </Box>
          {row?.required && (
            <Text forwardedAs='span' color='red' fontWeight='m'>
              &#42;&nbsp;
            </Text>
          )}
          <Box width='100%'>
            <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={22} fontWeight='m'>
              {name}
            </Text>
          </Box>
        </Flex>
      ),
    },
    {
      title: t('Pages_WorkpaperProcess_Step1_Table_SourceColumnLabel'),
      key: null,
      width: '21%',
      render: (name, row) => {
        return (
          <Box cursor='pointer' onClick={() => handleGoToMappingScreen(workpaperId, row)}>
            {row.fileHistory &&
              row.fileHistory.map((file, index) => (
                <Flex height='52px' alignItems='center' m={3} key={index}>
                  <InputUploadStatusProgress inputName={file} inputStatusData={row} currentInput={false} />
                </Flex>
              ))}
            {row.status !== WP_PROCESS_INPUT_STATUS.DONE && (
              <Flex alignItems='center' m={3}>
                <InputUploadStatusProgress
                  inputName={row.fileName}
                  inputStatusData={row}
                  currentInput
                  isAnyInputProcessing={isAnyInputProcessing}
                  setIsUploaderShown={() => {
                    setIsUploaderShown(true);
                    setSelectedInput(row.id);
                  }}
                />
              </Flex>
            )}
          </Box>
        );
      },
    },
    {
      title: !allRowStatus ? t('Pages_WorkpaperProcess_Step1_Table_StatusLabel') : '',
      key: 'statusData',
      width: '60%',
      render: (name, row) => {
        getRowStatus();

        return (
          <Box cursor='pointer' onClick={() => handleGoToMappingScreen(workpaperId, row)}>
            {row.fileHistory &&
              row.fileHistory.map((file, index) => (
                <Flex height='52px' alignItems='center' m={3} key={index}>
                  <InputUploadStatusText inputStatusData={row} currentInput={false} />
                </Flex>
              ))}
            {row.status !== WP_PROCESS_INPUT_STATUS.DONE && (
              <Flex alignItems='center' m={3}>
                <InputUploadStatusText inputStatusData={row} currentInput />
              </Flex>
            )}
          </Box>
        );
      },
    },
    {
      title: '',
      key: 'fileExample',
      calculateColSpan: getFileExampleColSpan,
      render: (name, row) => {
        const dataModel = dataModelList.find(d => d.id === row.datamodelId);

        return (
          row.datamodelId !== null &&
          dataModelList.length > 0 &&
          dataModel?.sampleDataSetNodeId && (
            <Flex justifyContent='flex-end'>
              <Tooltip
                type='default'
                tooltipContent={t('Pages_WorkpaperProcess_Step1_DownloadExampleInput')}
                showOnHover
                dataInstance={COMPONENT_NAME}
              >
                <Button
                  type={ButtonTypes.LINK}
                  color='green'
                  icon={IconTypes.XLS}
                  iconWidth={22}
                  onClick={() => onDownloadInputExampleFile(dataModel?.sampleDataSetNodeId, row.file.name)}
                  dataInstance={`${COMPONENT_NAME}-DownloadExample`}
                />
              </Tooltip>
            </Flex>
          )
        );
      },
    },
    {
      title: '',
      key: 'statusData',
      ignoreIfNull: true,
      render: (name, row) =>
        row.status === WP_PROCESS_INPUT_STATUS.DONE ||
        (row.fileHistory && row.error && !row.attachOptions?.shouldClean) ? (
          <Tooltip
            type='default'
            tooltipContent={t('Pages_WorkpaperProcess_Step1_AddFileHoverText')}
            showOnHover
            dataInstance={COMPONENT_NAME}
          >
            <Button
              disabled={isAddDisabled()}
              color='black'
              type={ButtonTypes.LINK}
              icon={IconTypes.PLUS}
              iconWidth={22}
              onClick={() => onAddFile(row.id)}
              dataInstance={`${COMPONENT_NAME}-Add`}
            />
          </Tooltip>
        ) : null,
    },
    {
      title: '',
      key: 'statusData',
      ignoreIfNull: true,
      render: (name, row) =>
        row.status === WP_PROCESS_INPUT_STATUS.DONE || row.error ? (
          <Tooltip
            type='default'
            tooltipContent={t('Pages_WorkpaperProcess_Step1_ReplaceFileHoverText')}
            showOnHover
            dataInstance={COMPONENT_NAME}
          >
            <Button
              disabled={readOnlyfromWP || engagement?.wrapupStatus === WrapupStatus.COMPLETE}
              color='black'
              type={ButtonTypes.LINK}
              icon={IconTypes.FLIP}
              iconWidth={18}
              onClick={() => onReplaceFile(row.id)}
              dataInstance={`${COMPONENT_NAME}-Replace`}
            />
          </Tooltip>
        ) : null,
    },
    {
      title: '',
      key: 'inputOptions',
      render: (name, row) =>
        row?.status === WP_PROCESS_INPUT_STATUS.DONE || !row?.status || row?.error ? (
          <Tooltip
            type='default'
            tooltipContent={t('Components_WOPROCESSSTEP1_INPUTOPTION_TOOLTIP')}
            showOnHover
            dataInstance={`${COMPONENT_NAME}`}
          >
            <Button
              disabled={readOnlyfromWP || engagement?.wrapupStatus === WrapupStatus.COMPLETE}
              iconColor={
                readOnlyfromWP || engagement?.wrapupStatus === WrapupStatus.COMPLETE
                  ? theme.colors.gray
                  : theme.colors.black
              }
              type={ButtonTypes.LINK}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              onClick={() => onOpenInputOptions(row)}
              dataInstance={`${COMPONENT_NAME}-Options`}
            />
          </Tooltip>
        ) : null,
    },
  ];

  return (
    <Spinner
      spinning={isDownloadingExampleFile || isFetchingDataModelList}
      label={t('Pages_WorkpaperProcess_Step1_Loading')}
    >
      <Box pl={90}>
        {template?.isOutdatedAnalytic === true
          ? showOutdatedVersionInfo && (
              <Flex alignItems='center'>
                <Alert
                  type={AlertTypes.INFO}
                  message={t('Pages_WorkpaperProcess_Step1_OutdatedVersionInfo').replace(
                    '{template}',
                    `${template?.name}`
                  )}
                  dataInstance={`${COMPONENT_NAME}-TrifactaShowOutdatedVersionInfo`}
                  mb={5}
                  onClose={() => setShowOutdatedVersionInfo(false)}
                  charLimit={null}
                />
              </Flex>
            )
          : null}
        <Box mb={20}>
          <Text type={TextTypes.BODY} mb={3} color='gray'>
            {t('Pages_WorkpaperProcess_Step1_SelectedTemplateType')}
          </Text>
          <Flex alignItems='center'>
            <Tag>{template?.name}</Tag>
            {template?.link ? (
              <Link ml={4} to={template?.link?.url} external target='_blank'>
                {template.link?.name}
              </Link>
            ) : (
              ''
            )}
          </Flex>
        </Box>
        <Box>
          <Text type={TextTypes.BODY} color='gray' mb={5}>
            {t('Pages_WorkpaperProcess_Step1_TableDescription')}
          </Text>

          <Table rows={inputs} headers={headers} dataInstance={COMPONENT_NAME} />
        </Box>

        {isUploaderShown && (
          <InputUploaderModal
            isDMT={workpaper?.isDMT}
            isOpen={isUploaderShown}
            inputId={selectedInput}
            shouldClean={shouldClean}
            handleClose={() => {
              setIsUploaderShown(false);
              dispatch(resetInputFileErrors());
            }}
            handleLargeFileWarning={() => {
              setIsLargeFileWarningShown(true);
              setIsUploaderShown(false);
            }}
            canvasType={canvasType}
          />
        )}

        <Modal
          isOpen={isWarningShown}
          onClose={onCloseWarning}
          onPrimaryButtonClick={onAcceptWarning}
          onSecondaryButtonClick={onCloseWarning}
          primaryButtonText={t('Continue', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
          secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
          size={ModalSizes.SMALL}
          dataInstance={`${COMPONENT_NAME}-Warning`}
        >
          <Text>
            {shouldClean
              ? t('Pages_WorkpaperProcess_Step1_WarningDescription_Replace')
              : t('Pages_WorkpaperProcess_Step1_WarningDescription_Add')}
          </Text>
        </Modal>

        <Modal
          isOpen={isInputOptionModalShown}
          onClose={onCloseInputOptions}
          primaryButtonText={t('Pages_WorkpaperProcess_Input_ExistingMappingPrimaryButton')}
          secondaryButtonText={t('Components_AddWorkpaperModal_Step1_Secondary')}
          onPrimaryButtonClick={onSubmitInputOptions}
          onSecondaryButtonClick={onCloseInputOptions}
          dataInstance={`${COMPONENT_NAME}-Options`}
        >
          <Spinner
            overlayOpacity={0.85}
            spinning={isDatasetDeleting}
            label={t('Components_WOPROCESSSTEP1_DELETEINPUT_SPINNER_LABEL')}
          >
            <AlertHub alerts={inputOptionErrors} />
            {getModalContent()}
          </Spinner>
        </Modal>

        <LargeFileWarningModal isOpen={isLargeFileWarningShown} onClose={onCloseLargeFileWarning} />
      </Box>
    </Spinner>
  );
};

WpProcessStep1.propTypes = {
  template: PropTypes.object,
};

WpProcessStep1.defaultProps = {
  template: {},
};

export default WpProcessStep1;
