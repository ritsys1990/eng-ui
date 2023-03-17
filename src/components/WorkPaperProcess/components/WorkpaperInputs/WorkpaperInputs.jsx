import React, { useEffect, useState, useContext, useCallback } from 'react';
import { wpStep1Selectors } from '../../../../store/workpaperProcess/step1/selectors';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  useInterval,
  Button,
  ButtonTypes,
  IconTypes,
  Tooltip,
  Flex,
  Text,
  Icon,
  TooltipPosition,
  Spinner,
} from 'cortex-look-book';
import {
  downloadInputFileExample,
  getWPStep1Details,
  getInputRelationship,
} from '../../../../store/workpaperProcess/step1/actions';
import { WORKPAPER_TYPES } from '../../../../utils/WorkpaperTypes.const';
import { WrapupStatus } from '../../../../pages/ClientSetup/components/Engagement/constants/engagment.constants';
import {
  WP_PROCESS_INPUT_STATUS,
  COMPONENT_NAME,
  WP_PROCESS_INPUT_PROCESSING_STATUSES,
  WP_STATUS,
  TRIFACTA_WP_PROCESS_INPUT_STATUS,
  WP_INPUT_CENTRALIZED_DATA_STATUS,
  WP_REVIEW_STATUS,
} from '../../constants/WorkPaperProcess.const';
import { InputUploadStatusText } from '../InputUploadStatus/InputUploadStatusText';
import { Box } from 'reflexbox';
import { InputUploadStatusProgress } from '../InputUploadStatus/InputUploadStatusProgress';
import { InputUploadStatusIcon } from '../InputUploadStatus/InputUploadStatusIcon';
import { ThemeContext } from 'styled-components';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { wpProcessSelectors } from '../../../../store/workpaperProcess/selectors';
import { isNil } from 'lodash';
import useTranslation from '../../../../hooks/useTranslation';
import { getDataModelListData } from '../../../../store/bundles/actions';
import { bundlesSelectors } from '../../../../store/bundles/selectors';
import { formatDate } from '../../../../utils/dateHelper';
import { settingsSelectors } from '../../../../store/settings/selectors';
import { InputDataRequestStatusProgress } from '../InputDataRequestStatus/InputDataRequestStatusProgress';
import { InputDataRequestStatusText } from '../InputDataRequestStatus/InputDataRequestStatusText';
import {
  isInputConnectedToDataRequest,
  getDataRequestStatus,
  getDataRequestId,
  isDataRequestProcessing,
  isAnyDataRequestScheduleDone,
  getConsolidatedSchedulesCount,
} from '../InputDataRequestStatus/utils/InputDataRequestStatus.utils';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { cloneBundleFromInputDataRequest } from '../../../../store/workpaperProcess/actions';
import InputMappingModal from '../InputMappingModal/InputMappingModal';

const REFRESH_INTERVAL = 3000; // 3 seconds

const WorkpaperInputs = ({
  workpaperId,
  engagementId,
  workpaperType,
  config,
  setSelectedInput,
  setIsInputOptionModalShown,
  setShouldClean,
  setIsNewUpload,
  setIsWarningShown,
  setIsUploaderShown,
  handleGoToInputDataScreen,
  setSelectedInputData,
  trifactaFlowId,
  isAnyInputProcessing,
  setIsAnyInputProcessing,
  isCentralizedDSUpdated,
  reviewStatus,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const dispatch = useDispatch();
  const theme = useContext(ThemeContext);
  const initialInputs = useSelector(wpStep1Selectors.selectInputs);
  const [inputs, setInputs] = useState([]);
  const inputRelationship = useSelector(wpStep1Selectors.inputRelationship);
  const wpStatus = useSelector(WPProcessingSelectors.workpaperProgress(workpaperId));
  let readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const [showRowStatus, setShowRowStatus] = useState(false);
  const [targetInputId, setTargetInputId] = useState(null);
  const [isViewMappingModalOpen, setIsViewMappingModalOpen] = useState(false);
  const [allScheduledCount, setAllScheduledCount] = useState(0);
  const isLoading = useSelector(wpStep1Selectors.selectIsLoading);
  const outdatedDatamodels = useSelector(wpStep1Selectors.selectOutdatedDatamodels);
  const isDownloadingExampleFile = useSelector(wpStep1Selectors.isDownloadingExampleFile);
  const isFetchingDataModelList = useSelector(bundlesSelectors.selectIsFetchingDataModelList);
  const dataModelList = useSelector(bundlesSelectors.selectDataModelList);
  const selectLocaleFormats = useSelector(settingsSelectors.selectLocaleFormats);
  const selectDefaultLocaleFormats = useSelector(settingsSelectors.selectDefaultLocaleFormats);
  const isCreatingDataRequest = useSelector(workpaperSelectors.selectIsCreatingDataRequest);
  const overallCloningBundle = useSelector(wpProcessSelectors.overallCloningBundle);
  const dmts = useSelector(wpProcessSelectors.selectDMTs);
  const engagement = useSelector(engagementSelectors.selectEngagement);

  useEffect(() => {
    setInputs(
      initialInputs?.map(input => {
        const inputClone = { ...input };
        inputClone.disable = false;
        const isInputRelation = inputRelationship.find(relationship => relationship.targetInputId === input.id);
        if (isInputRelation) {
          inputClone.disable = true;
        }

        return inputClone;
      })
    );
  }, [initialInputs, inputRelationship]);

  readOnlyfromWP = !readOnlyfromWP ? useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted) : readOnlyfromWP;

  const formats = {
    timeStamp: false,
    formatedDate: selectLocaleFormats.date ? selectLocaleFormats.date : selectDefaultLocaleFormats.date,
    formatedTime: selectLocaleFormats.time ? selectLocaleFormats.time : selectDefaultLocaleFormats.time,
  };
  const { t } = useTranslation();

  const getWPStep1DetailsHandler = useCallback(() => {
    if (isAnyInputProcessing && !isLoading) {
      dispatch(getWPStep1Details(workpaperId, null, workpaperType, trifactaFlowId));
    }
  }, [isAnyInputProcessing, isLoading]);

  useInterval(getWPStep1DetailsHandler, REFRESH_INTERVAL);

  useEffect(() => {
    dispatch(getInputRelationship(engagementId, workpaperId));
  }, [dispatch, engagementId, workpaperId]);

  useEffect(() => {
    dispatch(getWPStep1Details(workpaperId, true, workpaperType));
  }, [dispatch, workpaperId]);

  useEffect(() => {
    if (isCreatingDataRequest) {
      setIsAnyInputProcessing(true);
    }
  }, [isCreatingDataRequest]);

  useEffect(() => {
    inputs?.forEach(input => {
      // if any data requests schedule is done, clone the workpaper
      // (Cloning and job submit will happen based on the status in the backend)
      const isCloningInputBundle = overallCloningBundle?.get(input.id) || false;
      if (
        isAnyDataRequestScheduleDone(input) &&
        getConsolidatedSchedulesCount(input) > input.processedEventNum &&
        !isCloningInputBundle
      ) {
        dispatch(cloneBundleFromInputDataRequest(workpaperId, input.id));
      }
    });
  }, [allScheduledCount]);

  useEffect(() => {
    setAllScheduledCount(
      inputs?.map(input => getConsolidatedSchedulesCount(input)).reduce((acc, curr) => acc + curr, 0)
    );
  }, [inputs]);

  const onViewMapping = inputId => {
    setTargetInputId(inputId);
    setIsViewMappingModalOpen(true);
  };

  const onViewMappingModalClose = () => {
    setIsViewMappingModalOpen(false);
  };

  const checkIsAnyInputProcessing = useCallback(() => {
    const isProcessing = inputs?.some(
      input =>
        !input.error &&
        (WP_PROCESS_INPUT_PROCESSING_STATUSES.includes(input.status) ||
          input?.centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.INPROGRESS ||
          isDataRequestProcessing(input))
    );
    setIsAnyInputProcessing(isProcessing);
    const dataModelsInputs = inputs?.filter(i => i.datamodelId !== null).map(i => i.datamodelId);
    if (dataModelsInputs.length > 0 && dataModelList.length === 0) {
      dispatch(getDataModelListData(dataModelsInputs));
    }
  }, [inputs]);

  useEffect(() => {
    if (inputs) {
      checkIsAnyInputProcessing();
    }
  }, [inputs]);

  const getShowRowStatus = () => {
    const anyInputHasStatus = inputs?.some(input => {
      return input.status !== null || input.centralizedData !== null || isInputConnectedToDataRequest(input);
    });

    setShowRowStatus(anyInputHasStatus);
  };

  const onOpenInputOptions = row => {
    setSelectedInput(row);
    setIsInputOptionModalShown(true);
  };

  const onAddFile = row => {
    setSelectedInput(row?.id);
    setSelectedInputData(row);
    setShouldClean(false);
    setIsNewUpload(false);

    return WP_STATUS.NOT_STARTED !== wpStatus?.status ? setIsWarningShown(true) : setIsUploaderShown(true);
  };

  const onReplaceFile = row => {
    setSelectedInput(row?.id);
    setSelectedInputData(row);
    setShouldClean(true);
    setIsNewUpload(false);

    return WP_STATUS.NOT_STARTED !== wpStatus?.status ? setIsWarningShown(true) : setIsUploaderShown(true);
  };

  const onDownloadInputExampleFile = (nodeId, fileName) => {
    dispatch(downloadInputFileExample(nodeId, fileName));
  };

  const getFileExampleColSpan = row => {
    const addFileCell =
      (workpaperType === WORKPAPER_TYPES.TRIFACTA
        ? row.trifactaStatus !== TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS && !!row.trifactaInputId
        : true) &&
      !row.centralizedData &&
      (row.status === WP_PROCESS_INPUT_STATUS.DONE ||
        row.status === WP_PROCESS_INPUT_STATUS.DATA_CLEARED ||
        (row.fileHistory && row.error && !row.attachOptions?.shouldClean));
    const replaceFileCell =
      row.centralizedData && isCentralizedDSUpdated
        ? row.centralizedData.status !== WP_INPUT_CENTRALIZED_DATA_STATUS.INPROGRESS
        : ((workpaperType === WORKPAPER_TYPES.TRIFACTA
            ? row.trifactaStatus !== TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS && !!row.trifactaInputId
            : true) &&
            !row.centralizedData &&
            row.status === WP_PROCESS_INPUT_STATUS.DONE) ||
          row.error ||
          (row.status === WP_PROCESS_INPUT_STATUS.DATA_CLEARED && !row.centralizedData);

    let value = 1;

    if (!addFileCell) {
      value++;
    }
    if (!replaceFileCell) {
      value++;
    }

    return value > 1 ? value.toString() : null;
  };

  const setIsUploaderShownCallback = row => {
    setIsNewUpload(isNil(row.file));
    setIsUploaderShown(true);
    setSelectedInput(row.id);
    setSelectedInputData(row);
  };

  const disableMoreOptions = row => {
    return overallCloningBundle?.get(row.id) && !dmts?.some(dmt => dmt.connectedInputId === row.id);
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
          onClick={() => handleGoToInputDataScreen(row)}
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
            <InputUploadStatusIcon inputStatusData={row} workpaperType={workpaperType} />
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
        if (row.disable) {
          return (
            <Box>
              <Flex alignItems='center' m={3} cursor='pointer'>
                <Icon type={IconTypes.INFO} height={30} width={30} color='blue' />
                <Text>
                  {t('Pages_WorkpaperProcess_Step1_InputRelationship_ToolTip')}
                  <Button
                    type={ButtonTypes.LINK}
                    display='inline-block'
                    ml={3}
                    onClick={() => onViewMapping(row.id)}
                    dataInstance={`${COMPONENT_NAME}-ViewMapping`}
                  >
                    {t('Pages_WorkpaperProcess_Step1_InputRelationship_ViewMapping')}
                  </Button>
                </Text>
              </Flex>
            </Box>
          );
        }
        if (row.status !== WP_PROCESS_INPUT_STATUS.DONE && row.centralizedData && isCentralizedDSUpdated) {
          return (
            <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
              <Flex alignItems='center' m={3} cursor='pointer'>
                <InputUploadStatusProgress
                  workpaperType={workpaperType}
                  inputName={row.centralizedData.type}
                  inputStatusData={row}
                  currentInput
                  isAnyInputProcessing={isAnyInputProcessing}
                  setIsUploaderShown={() => {
                    setIsUploaderShownCallback(row);
                  }}
                  lastFile
                />
              </Flex>
            </Box>
          );
        }

        if (isInputConnectedToDataRequest(row)) {
          return (
            <Flex alignItems='center' m={3}>
              <InputDataRequestStatusProgress dataRequestStatus={getDataRequestStatus(row)} />
            </Flex>
          );
        }

        return (
          <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
            {config?.step1?.removeAttachSourceIfCentralized && row.centralizedData
              ? [
                  <Flex alignItems='center' m={3}>
                    <InputUploadStatusProgress
                      inputName={row.centralizedData.type}
                      inputStatusData={row}
                      currentInput={row.status}
                      workpaperType={workpaperType}
                    />
                  </Flex>,
                ]
              : [
                  row.fileHistory &&
                    row.fileHistory.map((file, index) => (
                      <Flex height='52px' alignItems='center' m={3} key={index} cursor='pointer'>
                        <InputUploadStatusProgress
                          inputName={file}
                          inputStatusData={row}
                          currentInput={false}
                          workpaperType={workpaperType}
                          lastFile={index === row.fileHistory.length - 1}
                        />
                      </Flex>
                    )),
                ]}
            {row.status !== WP_PROCESS_INPUT_STATUS.DONE &&
              !row.centralizedData &&
              row.status !== WP_PROCESS_INPUT_STATUS.DATA_CLEARED && (
                <Flex alignItems='center' m={3} cursor='pointer'>
                  <InputUploadStatusProgress
                    workpaperType={workpaperType}
                    inputName={row.fileName}
                    inputStatusData={row}
                    currentInput
                    isAnyInputProcessing={isAnyInputProcessing}
                    setIsUploaderShown={() => {
                      setIsUploaderShownCallback(row);
                    }}
                    lastFile
                  />
                </Flex>
              )}
          </Box>
        );
      },
    },
    {
      title: showRowStatus ? t('Pages_WorkpaperProcess_Step1_Table_StatusLabel') : '',
      key: 'statusData',
      width: '60%',
      render: (name, row) => {
        getShowRowStatus();

        if (row.status !== WP_PROCESS_INPUT_STATUS.DONE && row.centralizedData && isCentralizedDSUpdated) {
          return (
            <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
              <Flex alignItems='center' m={3} cursor='pointer'>
                <InputUploadStatusText
                  inputStatusData={row}
                  currentInput
                  centralizedData
                  workpaperType={workpaperType}
                  lastFile
                  isCentralizedDSUpdated={isCentralizedDSUpdated}
                />
              </Flex>
            </Box>
          );
        }

        if (isInputConnectedToDataRequest(row)) {
          return (
            <Flex height='52px' alignItems='center' m={3} cursor='pointer'>
              <InputDataRequestStatusText
                dataRequestStatus={getDataRequestStatus(row)}
                dataRequestId={getDataRequestId(row)}
              />
            </Flex>
          );
        }

        return (
          <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
            {row?.centralizedData ? (
              <Flex height='52px' alignItems='center' cursor='pointer'>
                {row.centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.SUCCESS && (
                  <Tooltip
                    display='inline-block'
                    direction={TooltipPosition.TOP}
                    showOnHover
                    tooltipContent={t('Pages_WorkpaperProcess_Step1_Centralized_Dataset_Date').replace(
                      'lastUpdated',
                      `${row.centralizedData.lastUpdated ? formatDate(row.centralizedData.lastUpdated, formats) : ''}`
                    )}
                    dataInstance={COMPONENT_NAME}
                  >
                    <Icon type={IconTypes.INFO} height={32} width={32} color='blue' />
                  </Tooltip>
                )}
                <InputUploadStatusText
                  inputStatusData={row}
                  currentInput
                  centralizedData
                  workpaperType={workpaperType}
                  lastFile
                />
              </Flex>
            ) : (
              row.fileHistory &&
              row.fileHistory.map((file, index) => (
                <Flex height='52px' alignItems='center' m={3} key={index} cursor='pointer'>
                  <InputUploadStatusText
                    inputStatusData={row}
                    currentInput={false}
                    centralizedData={false}
                    workpaperType={workpaperType}
                    lastFile={index === row.fileHistory.length - 1}
                  />
                </Flex>
              ))
            )}
            {row.status !== WP_PROCESS_INPUT_STATUS.DONE && !row.centralizedData && (
              <Flex alignItems='center' m={3} cursor='pointer'>
                <InputUploadStatusText workpaperType={workpaperType} inputStatusData={row} currentInput lastFile />
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
            <Flex justifyContent='flex-end' cursor='pointer'>
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
                  disabled={row.disable}
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
      key: 'addFile',
      ignoreIfNull: true,
      render: (name, row) =>
        (workpaperType === WORKPAPER_TYPES.TRIFACTA
          ? row.trifactaStatus !== TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS && !!row.trifactaInputId
          : true) &&
        !row.centralizedData &&
        (row.status === WP_PROCESS_INPUT_STATUS.DONE ||
          row.status === WP_PROCESS_INPUT_STATUS.DATA_CLEARED ||
          (row.fileHistory && row.error && !row.attachOptions?.shouldClean)) &&
        !row?.disable ? (
          <Tooltip
            type='default'
            tooltipContent={t('Pages_WorkpaperProcess_Step1_AddFileHoverText')}
            showOnHover
            dataInstance={COMPONENT_NAME}
          >
            <Button
              disabled={
                readOnlyfromWP ||
                reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW ||
                row.disable ||
                engagement?.wrapupStatus === WrapupStatus.COMPLETE
              }
              color='black'
              type={ButtonTypes.LINK}
              icon={IconTypes.PLUS}
              iconWidth={22}
              onClick={() => onAddFile(row)}
              dataInstance={`${COMPONENT_NAME}-Add`}
            />
          </Tooltip>
        ) : null,
    },
    {
      title: '',
      key: 'replaceFile',
      ignoreIfNull: true,
      render: (name, row) => {
        if (
          row.centralizedData &&
          isCentralizedDSUpdated &&
          row.centralizedData.status !== WP_INPUT_CENTRALIZED_DATA_STATUS.INPROGRESS
        ) {
          return (
            <Tooltip
              type='default'
              tooltipContent={t(`Pages_WorkpaperProcess_Step1_ReplaceFileHoverText`)}
              showOnHover
              dataInstance={`${COMPONENT_NAME}`}
            >
              <Button
                color='black'
                type={ButtonTypes.LINK}
                icon={IconTypes.FLIP}
                iconWidth={18}
                onClick={() => onReplaceFile(row)}
                dataInstance={`${COMPONENT_NAME}-Replace`}
                disabled={row.disable || reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW}
              />
            </Tooltip>
          );
        }

        return ((workpaperType === WORKPAPER_TYPES.TRIFACTA
          ? row.trifactaStatus !== TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS && !!row.trifactaInputId
          : true) &&
          !row?.disable &&
          !row.centralizedData &&
          row.status === WP_PROCESS_INPUT_STATUS.DONE) ||
          row.error ||
          (row.status === WP_PROCESS_INPUT_STATUS.DATA_CLEARED && !row.centralizedData) ? (
          <Tooltip
            type='default'
            tooltipContent={t('Pages_WorkpaperProcess_Step1_ReplaceFileHoverText')}
            showOnHover
            dataInstance={`${COMPONENT_NAME}`}
          >
            <Button
              disabled={
                row.disable ||
                readOnlyfromWP ||
                reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW ||
                engagement?.wrapupStatus === WrapupStatus.COMPLETE
              }
              color='black'
              type={ButtonTypes.LINK}
              icon={IconTypes.FLIP}
              iconWidth={18}
              onClick={() => onReplaceFile(row)}
              dataInstance={`${COMPONENT_NAME}-Replace`}
            />
          </Tooltip>
        ) : null;
      },
    },
    {
      title: '',
      key: 'inputOptions',
      render: (name, row) => {
        if (
          row?.centralizedData &&
          isCentralizedDSUpdated &&
          row?.mappings &&
          !row?.error &&
          workpaperType === WORKPAPER_TYPES.TRIFACTA &&
          row?.trifactaStatus !== TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS &&
          row.centralizedData.status !== WP_INPUT_CENTRALIZED_DATA_STATUS.INPROGRESS
        ) {
          return (
            <Tooltip
              type='default'
              tooltipContent={config.step1.inputOptions.tooltip_message}
              showOnHover
              dataInstance={`${COMPONENT_NAME}`}
            >
              <Button
                iconColor={theme.colors.black}
                type={ButtonTypes.LINK}
                icon={IconTypes.ELLIPSIS_Y}
                iconWidth={18}
                onClick={() => onOpenInputOptions(row)}
                dataInstance={`${COMPONENT_NAME}-Options`}
                disabled={
                  row.disable || reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW || disableMoreOptions(row)
                }
              />
            </Tooltip>
          );
        }

        return (!row?.error &&
          (row?.status === WP_PROCESS_INPUT_STATUS.APPENDING ||
            row?.status === WP_PROCESS_INPUT_STATUS.MAPPING ||
            row?.status === WP_PROCESS_INPUT_STATUS.UPLOADING ||
            row?.status === WP_PROCESS_INPUT_STATUS.VALIDATING ||
            row?.status === WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP)) ||
          row?.disable ||
          (config?.step1?.removeAttachSourceIfCentralized && row.centralizedData) ? null : (
          <Tooltip
            type='default'
            tooltipContent={config.step1.inputOptions.tooltip_message}
            showOnHover
            dataInstance={`${COMPONENT_NAME}`}
          >
            <Button
              disabled={
                row.disable ||
                (readOnlyfromWP && !row.datamodelId) ||
                reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW ||
                disableMoreOptions(row) ||
                engagement?.wrapupStatus === WrapupStatus.COMPLETE
              }
              iconColor={
                (readOnlyfromWP && !row.datamodelId) ||
                reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW ||
                engagement?.wrapupStatus === WrapupStatus.COMPLETE
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
        );
      },
    },
  ];

  return (
    <Spinner
      overlayOpacity={0.9}
      pathSize={theme.space[1]}
      size={theme.space[8]}
      spinning={!inputs || isDownloadingExampleFile || isFetchingDataModelList}
      label={
        !inputs && !isDownloadingExampleFile && !isFetchingDataModelList
          ? config.step1.inputOptions.allOptions_Spinner_label
          : t('Pages_WorkpaperProcess_Step1_Loading')
      }
      optionalRender={false}
    >
      {inputs && <Table rows={inputs} headers={headers} />}
      {targetInputId && (
        <InputMappingModal
          isModalOpen={isViewMappingModalOpen}
          handleClose={onViewMappingModalClose}
          dataInstance={COMPONENT_NAME}
          inputId={targetInputId}
        />
      )}
    </Spinner>
  );
};

WorkpaperInputs.propTypes = {};

WorkpaperInputs.defaultProps = {};

export default WorkpaperInputs;
