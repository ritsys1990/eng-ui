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
import { getWPStep1Details, getInputRelationship } from '../../../../store/workpaperProcess/step1/actions';
import { WrapupStatus } from '../../../../pages/ClientSetup/components/Engagement/constants/engagment.constants';
import {
  COMPONENT_NAME,
  NOTEBOOK_WP_INPUT_PROCESSING_STATUSES,
  NOTEBOOK_WP_STATUS,
  NOTEBOOK_WP_REVIEW_STATUS,
} from '../../constants/NotebookWPProcess.const';
import { InputUploadStatusText } from '../../../WorkPaperProcess/components/InputUploadStatus/InputUploadStatusText';
import { Box } from 'reflexbox';
import { InputUploadStatusProgress } from '../../../WorkPaperProcess/components/InputUploadStatus/InputUploadStatusProgress';
import { InputUploadStatusIcon } from '../../../WorkPaperProcess/components/InputUploadStatus/InputUploadStatusIcon';
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
import {
  isInputConnectedToDataRequest,
  isDataRequestProcessing,
  isAnyDataRequestScheduleDone,
  getConsolidatedSchedulesCount,
} from '../../../WorkPaperProcess/components/InputDataRequestStatus/utils/InputDataRequestStatus.utils';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { cloneBundleFromInputDataRequest } from '../../../../store/workpaperProcess/actions';
import InputMappingModal from '../../../WorkPaperProcess/components/InputMappingModal/InputMappingModal';

const REFRESH_INTERVAL = 3000; // 3 seconds

const NotebookWPInputs = ({
  workpaperId,
  engagementId,
  workpaperType,
  config,
  setSelectedInput,
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
        !input.error && (NOTEBOOK_WP_INPUT_PROCESSING_STATUSES.includes(input.status) || isDataRequestProcessing(input))
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

  const onReplaceFile = row => {
    setSelectedInput(row?.id);
    setSelectedInputData(row);
    setShouldClean(true);
    setIsNewUpload(false);

    return NOTEBOOK_WP_STATUS.NOT_STARTED !== wpStatus?.status ? setIsWarningShown(true) : setIsUploaderShown(true);
  };

  const setIsUploaderShownCallback = row => {
    setIsNewUpload(isNil(row.file));
    setIsUploaderShown(true);
    setSelectedInput(row.id);
    setSelectedInputData(row);
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

        return (
          <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
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

        return (
          <Box cursor='pointer' onClick={() => handleGoToInputDataScreen(row)}>
            <Flex height='52px' alignItems='center' cursor='pointer'>
              {row.centralizedData && !row.error && (
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
                centralizedData={row.centralizedData}
                workpaperType={workpaperType}
                lastFile
              />
            </Flex>
          </Box>
        );
      },
    },
    {
      title: '',
      key: 'replaceFile',
      ignoreIfNull: true,
      render: (name, row) => {
        if (isCentralizedDSUpdated) {
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
                disabled={row.disable || reviewStatus === NOTEBOOK_WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW}
              />
            </Tooltip>
          );
        }

        return row.status ? (
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
                reviewStatus === NOTEBOOK_WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW ||
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
        ) : (
          <></>
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

NotebookWPInputs.propTypes = {};

NotebookWPInputs.defaultProps = {};

export default NotebookWPInputs;
