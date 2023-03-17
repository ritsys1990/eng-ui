import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonTypes,
  Flex,
  IconTypes,
  Modal,
  ModalSizes,
  Tag,
  Text,
  TextTypes,
  Toggle,
  Link,
  Input,
  RadioGroup as RadioGroupObj,
  Spinner,
  AlertHub,
  Alert,
  AlertTypes,
  Icon,
  Select,
  SelectTypes,
  FilePreview,
  FilePreviewTypes,
  Tree,
  Search,
  Checkbox,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import InputUploaderModal from '../../InputUploaderModal/InputUploaderModal';
import ConnectToBundle from './connectToBundle/connectToBundle';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import {
  WP_PROCESS_INPUT_STATUS,
  WP_PROCESS_INPUT_ERRORS,
  INPUT_OPTIONS,
  COMPONENT_NAME,
  TRIFACTA_WP_PROCESS_INPUT_STATUS,
  WP_CENTRALISEDDATASET_EVENTS,
  WP_INPUT_CENTRALIZED_DATA_STATUS,
  WP_REVIEW_STATUS,
  ProgressBarTypes,
  WP_STATE_STATUS,
} from '../constants/WorkPaperProcess.const';
import { useHistory, useParams } from 'react-router-dom';
import {
  updateRequiredStatus,
  deleteTrifactaDataset,
  renameTrifactaDataset,
  updateInputCentralizedData,
  clearInputData,
  connectDataSetToFlow,
  retryInputFileCopy,
  getWorkpaperDatasetTypes,
  refreshCentralizedData,
  triggerDMVForZipUploads,
  decoupleDataRequest,
  setAutoDmtFlag,
  getAutoDmtFlag,
  replaceInputDataModel,
} from '../../../store/workpaperProcess/step1/actions';
import { getWorkpaperDMTs } from '../../../store/workpaperProcess/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { securitySelectors } from '../../../store/security/selectors';
import useCheckAuth from '../../../hooks/useCheckAuth';
import { resetInputFileErrors, addGlobalError, resetconnectToBundleError } from '../../../store/errors/actions';
import { errorsSelectors } from '../../../store/errors/selectors';
// eslint-disable-next-line import/no-duplicates
import { ThemeContext } from 'styled-components';
// eslint-disable-next-line import/no-duplicates
import styled from 'styled-components';

import useConfig from '../hooks/useConfig';
import { WORKPAPER_TYPES, WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import LargeFileWarningModal from '../../InputUploaderModal/components/LargeFileWarning/LargeFileWarningModal';
import { datawranglerSelectors } from '../../../store/dataWrangler/selectors';
import WorkpaperInputs from './WorkpaperInputs/WorkpaperInputs';
import { addCentralizedDataEventsToAuditLog } from '../../../store/workpaper/actions';
import env from '../../../app/env';
import useTranslation, { nameSpaces } from '../../../hooks/useTranslation';
import useWarningModal from '../../../hooks/useWarningModal';
import { checkPermissions } from '../../../utils/permissionsHelper';
import { engagementSelectors } from '../../../store/engagement/selectors';
import useIsSpecificRoute from 'src/hooks/useIsSpecificRoute';
import { shouldSendMessageRoutes } from 'src/constants/pipelineMessages';
import ScheduleAlert from './ScheduleAlert';
import { isInputConnectedToDataRequest } from './InputDataRequestStatus/utils/InputDataRequestStatus.utils';
import { PreviewSettings } from '../../InputUploaderModal/components/UploadedFilePreview/PreviewSettings';
import { PREVIEW_INDICATOR_TYPE } from './WorkpaperOutputs/output.consts';
import { attachDialogSelectors } from '../../../store/dialogs/attachFiles/selectors';
import { DELIMITER } from '../../InputUploaderModal/components/Delimeter/constants';
import { getDatamodelList, getDatamodelFields } from '../../../store/dialogs/attachFiles/actions';

const TreeMenu = styled(Flex)`
  min-height: 300px;
  height: 65vh;
  overflow: auto;
  margin-top: 1vh !important;
`;

const Preview = styled(Flex)`
  width: 100%;
  height: 100%;
  flex-direction: column;
  margin-top: 1vh !important;
`;
// eslint-disable-next-line sonarjs/cognitive-complexity
const WpProcessStep1 = ({
  template,
  workpaperType,
  workpaper,
  canvasType,
  isCentralizedDSUpdated,
  latestTemplate,
  output,
  isProcessing,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { config } = useConfig(canvasType);
  const [datasetType, setDatasetType] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedInput, setSelectedInput] = useState(null);
  const [isPriorPeriod, setIsPriorPeriod] = useState(false);
  const [priorPeriodYear, setPriorPeriodYear] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [selectedInputData, setSelectedInputData] = useState(null);
  const [showDuplicateTableNameError, setShowDuplicateTableNameError] = useState(false);
  const [isUploaderShown, setIsUploaderShown] = useState(false);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const [isWarningShown, setIsWarningShown] = useState(false);
  const [isLargeFileWarningShown, setIsLargeFileWarningShown] = useState(false);
  const [activeOption, setActiveOption] = useState(false);
  const [inputOptionValue, setinputOptionValue] = useState(false);
  const [isInputOptionModalShown, setIsInputOptionModalShown] = useState(false);
  const [shouldClean, setShouldClean] = useState(false);
  const [inputsStatus, setInputsStatus] = useState(true);
  const [isAnyInputProcessing, setIsAnyInputProcessing] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [spinnerLabel, setSpinnerLabel] = useState(config.step1.inputOptions.allOptions_Spinner_label);
  const [showOutdatedVersionInfo, setShowOutdatedVersionInfo] = useState(true);
  const [showCentralizedOutdatedVersionInfo, setShowCentralizedOutdatedVersionInfo] = useState(true);
  const [hasRequestedDatasets, setHasRequestedDatasets] = useState(false);
  const [openConnectToBundle, setOpenConnectToBundle] = useState(false);
  const [disablebuttonFromBundle, setDisablebuttonFromBundle] = useState(true);
  const [callConnectBundle, setCallConnectBundle] = useState(false);
  const [shouldAutoDmt, setShouldAutoDmt] = useState(null);
  const [isMidDmtFlow, setIsMidDmtFlow] = useState(false);
  const [hasDataConnection, setHasDataConnection] = useState(false);
  const { renderWarningModal, showWarningModal } = useWarningModal();
  const history = useHistory();
  const theme = useContext(ThemeContext);
  const { workpaperId } = useParams();
  const engagement = useSelector(engagementSelectors.selectEngagement);
  const dispatch = useDispatch();
  let readOnlyfromWP = useSelector(wpProcessSelectors.readOnlyfromWP);
  const isInputOptionTriggered = useSelector(wpStep1Selectors.isInputOptionTriggered);
  const isInputDataClearing = useSelector(wpStep1Selectors.isInputDataClearing);
  const isDatasetDeleting = useSelector(wpStep1Selectors.isDatasetDeleting);
  const isAddingDatasetToFlow = useSelector(wpStep1Selectors.isAddingDatasetToFlow);
  const isTriggeringDMVsForZip = useSelector(wpStep1Selectors.isTriggeringDMVsForZip);
  const isRetryingInputFileCopy = useSelector(wpStep1Selectors.isRetryingInputFileCopy);
  const isDatasetUpdating = useSelector(datawranglerSelectors.isDatasetUpdating);
  const isUpdatingTheInput = useSelector(wpStep1Selectors.isUpdatingTheInput);
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const isFetchingBundles = useSelector(wpStep1Selectors.isFetchingBundles);
  const connectTrifactBundles = useSelector(wpStep1Selectors.connectTrifactBundles);
  const selectMeRoles = useSelector(securitySelectors.selectMeRoles);
  const permissions = useCheckAuth();
  const isSettingAutoDmtFlag = useSelector(wpStep1Selectors.isSettingAutoDmtFlag);
  const dmtProgress = useSelector(WPProcessingSelectors.overallProgress);
  const shouldSendMessage = useIsSpecificRoute(shouldSendMessageRoutes);
  const { t } = useTranslation();

  const isTrifactaDatasetRename = useSelector(wpStep1Selectors.isTrifactaDatasetRename);
  const inputOptionErrors = useSelector(errorsSelectors.selectInputOptionsErrors);
  const datasetTypes = useSelector(wpStep1Selectors.datasetTypes);
  const treeIsLoading = useSelector(attachDialogSelectors.isLoading);
  const isReplacingDMLoader = useSelector(wpStep1Selectors.isReplacingDMLoader);
  const preview = useSelector(attachDialogSelectors.preview);
  const [dataModelId, setDataModelId] = useState('');
  const [previewName, setPreviewName] = useState('');
  const [jsonPreview, setJsonPreview] = useState(null);
  const [datamodelTree, setDatamodelTree] = useState({});
  const datamodelTreeData = useSelector(attachDialogSelectors.datamodelTreeData);
  const [loadDMImport, setLoadDMImport] = useState(false);
  const [fetchDM, setFetchDM] = useState(false);
  const [headers, setHeaders] = useState(null);
  const [delimiter, setDelimiter] = useState(DELIMITER.COMMA);

  readOnlyfromWP = !readOnlyfromWP ? useSelector(wpProcessSelectors.isChildWorkpapersStatusCompleted) : readOnlyfromWP;

  useEffect(() => {
    if (dataModelId !== '') {
      dispatch(getDatamodelFields(dataModelId));
    }
  }, [dataModelId]);

  useEffect(() => {
    if (loadDMImport && !fetchDM) {
      dispatch(getDatamodelList()).then(() => {
        setFetchDM(true);
      });
    }
  }, [loadDMImport]);

  useEffect(() => {
    setDatamodelTree(datamodelTreeData);
  }, [datamodelTreeData]);

  useEffect(() => {
    if (!openConnectToBundle) {
      dispatch(resetconnectToBundleError());
    }
  }, [openConnectToBundle]);

  useEffect(() => {
    if (engagement?.encryption) {
      setShouldAutoDmt(false);
    } else {
      dispatch(getAutoDmtFlag(workpaperId)).then(response => {
        setShouldAutoDmt(response);
      });
    }
  }, [engagement]);

  useEffect(() => {
    if (dmtProgress != null) {
      const isDmtRunning = dmtProgress.some(progress => progress.status === ProgressBarTypes.RUNNING);

      setIsMidDmtFlow(isDmtRunning);
    }
  }, [dmtProgress]);

  useEffect(() => {
    if (inputs != null) {
      const hasAnyDataConnection = inputs.some(input => isInputConnectedToDataRequest(input));
      setHasDataConnection(hasAnyDataConnection);
    }
  }, [inputs]);

  useEffect(() => {
    if (isInputDataClearing) {
      setSpinnerLabel(t('Components_WOPROCESSSTEP1_CLEARINPUT_SPINNER_LABEL'));
    } else if (isDatasetDeleting) {
      setSpinnerLabel(t('Components_WOPROCESSSTEP1_DELETEINPUT_SPINNER_LABEL'));
    } else if (isAddingDatasetToFlow || isReplacingDMLoader) {
      setSpinnerLabel(t('Components_WOPROCESSSTEP1_ADDDATASETTOFLOW_SPINNER_LABEL'));
    } else if (isTriggeringDMVsForZip) {
      setSpinnerLabel('');
    } else {
      setSpinnerLabel(config.step1.inputOptions.allOptions_Spinner_label);
    }
  }, [
    isInputDataClearing,
    isDatasetDeleting,
    isAddingDatasetToFlow,
    isRetryingInputFileCopy,
    isTriggeringDMVsForZip,
    isReplacingDMLoader,
  ]);

  useEffect(() => {
    if (config?.step1?.isCentralisededOptionExists && !hasRequestedDatasets) {
      dispatch(getWorkpaperDatasetTypes());
      setHasRequestedDatasets(true);
    }
  }, [datasetTypes, dispatch]);

  const isAddDisabled = () => {
    let isButtoNDisabled = false;

    if (readOnlyfromWP || isAnyInputProcessing || workpaper.reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW) {
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
    setIsNewUpload(false);
  };

  const onCloseInputOptions = () => {
    setIsInputOptionModalShown(false);
    setShowDeleteWarning(false);
    setSelectedInput(null);
    setDatasetType([]);
    setSelectionMade(false);
    setSelectedDatasets([]);
    setSelectOptions([]);
    setSelectedValue([]);
    setinputOptionValue(false);
    setActiveOption(false);
    setShowDuplicateTableNameError(false);
    setOpenConnectToBundle(false);
    setCallConnectBundle(false);
    setDataModelId('');
    setPreviewName('');
    setLoadDMImport(false);
    setDatamodelTree({});
    setFetchDM(false);
  };

  useEffect(() => {
    if (isAnyInputProcessing) isProcessing(isAnyInputProcessing);
  }, [isAnyInputProcessing]);

  useEffect(() => {
    if (dataModelId && Object.values(preview.data).length > 0) {
      setJsonPreview(preview.data);
    }
  }, [preview]);

  const onPreviewClickHandler = (previewPath, fileName) => {
    setPreviewName(fileName);
    setDataModelId(previewPath);
  };
  const handleOnchangeSearch = textSearch => {
    const searchText = textSearch;
    if (searchText) {
      const filteredDM = {};
      const searchRegExp = searchText.toLowerCase();

      [...Object.values(datamodelTreeData)].forEach(eachValue => {
        if (eachValue.name?.toLowerCase()?.includes(searchRegExp)) {
          filteredDM[`${eachValue.id}`] = { ...eachValue };
        }
      });
      setDatamodelTree(filteredDM);
    } else {
      setDatamodelTree(datamodelTreeData);
    }
  };
  const triggerDMVsForZipInputs = zipInputs => {
    dispatch(triggerDMVForZipUploads(workpaper.id, workpaper.trifactaFlowId, zipInputs));
  };

  useEffect(() => {
    setInputsStatus(inputs?.every(input => input?.status !== WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP));
    if (inputs.length > 0 && isFirstLoad) {
      setIsFirstLoad(false);
      const zipDMVInputs = inputs?.filter(input => input?.status === WP_PROCESS_INPUT_STATUS.DMV_ZIP);
      if (zipDMVInputs?.length > 0) {
        triggerDMVsForZipInputs(zipDMVInputs);
      }
    }
  }, [inputs]);

  useEffect(() => {
    const datasets = [];
    inputs.forEach(input => {
      if (input?.centralizedData) {
        datasets.push(input.centralizedData.type);
      }
    });
    setSelectedDatasets([...datasets]);
  }, [inputs, selectedInput]);

  useEffect(() => {
    if (selectedInput) {
      let options = datasetTypes.filter(ds => {
        return selectedDatasets.indexOf(ds.value) === -1;
      });
      let selectValue = datasetTypes.filter(ds => selectedInput?.centralizedData?.type === ds.value);
      if (selectionMade && datasetType.length === 0) {
        options = [...options, ...datasetTypes.filter(ds => selectedInput?.centralizedData?.type === ds.value)];
        selectValue = [];
      } else if (selectionMade && datasetType.length > 0) {
        selectValue = datasetType;
        options = datasetTypes.filter(ds => {
          return datasetType[0]['value'] !== ds.value;
        });
      }
      setSelectedValue(selectValue);
      setSelectOptions(options);
    }
  }, [datasetType, inputs, selectedDatasets, selectedInput]);

  const isInputProcessing = input =>
    !input.error &&
    (WP_PROCESS_INPUT_STATUS.MAPPING === input.status ||
      WP_PROCESS_INPUT_STATUS.UPLOADING === input.status ||
      WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP === input.status);

  const gotoMappingScreen = inputData => {
    switch (canvasType) {
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS:
        history.push(`/library/workpapers/${workpaperId}/inputs/${inputData.id}`);
        break;
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS:
        if (workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
          history.push(`/library/datamodelTransformations/${workpaperId}/inputs/${inputData.id}`);
        }
        break;
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS:
        if (workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
          history.push(`/library/bundleTransformations/${workpaperId}/inputs/${inputData.id}`);
        }
        break;
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD:
      case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_CANVAS:
      case WORKPAPER_CANVAS_TYPES.CORTEX_ENGAGEMENT_WIZARD:
        history.push(`/workpapers/${workpaperId}/inputs/${inputData.id}`);
        break;
      default:
        break;
    }
  };
  const handleGoToInputDataScreen = (inputData, isMappingScreen = false) => {
    if (inputData.centralizedData?.status === WP_INPUT_CENTRALIZED_DATA_STATUS.ERROR) {
      dispatch(retryInputFileCopy(workpaper.id, inputData.id));
    } else if (
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_ERROR ||
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_WARNING ||
      inputData?.error?.code === WP_PROCESS_INPUT_ERRORS.DMV_MAPPING_ERROR
    ) {
      window.location.href = `${env.ANALYTICSUI_URL}/data-models/${inputData?.clonedDataModelId}/${workpaperId}/engagement-ui/input-workbench`;
    } else if (
      !readOnlyfromWP &&
      inputData?.file?.url &&
      inputData.status !== WP_PROCESS_INPUT_STATUS.UPLOADING_ZIP &&
      workpaper.workpaperSource === WORKPAPER_TYPES.TRIFACTA &&
      (!inputData?.trifactaInputId || inputData.trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS)
    ) {
      dispatch(
        connectDataSetToFlow(workpaper.id, workpaper.trifactaFlowId, inputData.file.url, inputData.id, inputData.name)
      );
    } else if (isMappingScreen && inputData.status && !isInputProcessing(inputData)) {
      gotoMappingScreen(inputData);
    } else if (inputData.error && inputData?.status === WP_PROCESS_INPUT_STATUS.MAPPING) {
      gotoMappingScreen(inputData);
    } else if (inputData?.status === WP_PROCESS_INPUT_STATUS.DMV_ZIP) {
      dispatch(triggerDMVForZipUploads(workpaper.id, workpaper.trifactaFlowId, [inputData]));
    } else if (inputData?.status === WP_PROCESS_INPUT_STATUS.DONE) {
      switch (canvasType) {
        case WORKPAPER_CANVAS_TYPES.TRIFACTA_CL_CANVAS:
          history.push(`/library/workpapers/${workpaperId}/inputs/${inputData.id}/data`);
          break;
        case WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS:
          if (workpaper?.isDMT && !!workpaper?.trifactaFlowId) {
            history.push(`/library/datamodelTransformations/${workpaperId}/inputs/${inputData.id}/data`);
          }
          break;
        case WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS:
          if (workpaper?.bundleTransformation && !!workpaper?.trifactaFlowId) {
            history.push(`/library/bundleTransformations/${workpaperId}/inputs/${inputData.id}/data`);
          }
          break;
        case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_WIZARD:
        case WORKPAPER_CANVAS_TYPES.TRIFACTA_ENGAGEMENT_CANVAS:
          history.push(`/workpapers/${workpaperId}/inputs/${inputData.id}/data`);
          break;
        case WORKPAPER_CANVAS_TYPES.CORTEX_ENGAGEMENT_WIZARD:
          history.push(`/workpapers/${workpaperId}/inputs/${inputData.id}`);
          break;
        default:
          break;
      }
    }
  };

  const submitOptionsCallback = response => {
    if (response) {
      onCloseInputOptions();
    }
  };

  const dispatchReplaceModel = () => {
    const arr = [];
    for (let i = 0; i < headers.length; i++) {
      arr.push(headers[i].name);
    }
    const csvFile = `${arr.join(',')}\r`;
    const myFile = new Blob([csvFile], { type: 'text/csv' });
    const ModifiedDate = new Date();
    const fileContent = new File([myFile], previewName, { lastModifiedDate: ModifiedDate });

    return replaceInputDataModel(
      workpaperId,
      headers,
      delimiter,
      dataModelId,
      previewName,
      fileContent,
      workpaper?.trifactaFlowId,
      workpaper.isDMT,
      selectedInput.id,
      workpaper.engagementId,
      isPriorPeriod,
      priorPeriodYear
    );
  };

  const onSubmitInputOptions = () => {
    const existingTableNames = inputs && inputs.map(input => input.name);
    if (inputOptionValue && existingTableNames.indexOf(inputOptionValue) !== -1) {
      setShowDuplicateTableNameError(true);

      return;
    }

    setShowDuplicateTableNameError(false);
    const executeOption =
      !activeOption && inputOptionValue ? config.step1.inputOptions.allOptions.rename_input : activeOption;
    switch (executeOption) {
      case config.step1.inputOptions.allOptions.mark_as_required:
      case config.step1.inputOptions.allOptions.mark_as_optional:
        dispatch(updateRequiredStatus(selectedInput.id, !selectedInput.required, workpaper.id)).then(response => {
          if (response) {
            if (inputOptionValue) {
              dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue)).then(submitOptionsCallback);
            } else {
              onCloseInputOptions();
            }
          }
        });
        break;

      case config.step1.inputOptions.allOptions.rename_input: // dispatch clear action in future
        dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue)).then(submitOptionsCallback);
        break;

      case config.step1.inputOptions.allOptions.clear_data: {
        // dispatch clear action in futuren
        if (workpaper.reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW) {
          onCloseInputOptions();
          dispatch(addGlobalError({ type: AlertTypes.ERROR, message: t(`Pages_WorkpaperProcess_Step1_Error_Inputs`) }));
          break;
        }
        if (inputOptionValue) {
          dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue));
        }
        dispatch(
          clearInputData(workpaper.id, selectedInput.id, workpaper?.trifactaFlowId, engagement?.id, shouldSendMessage)
        ).then(submitOptionsCallback);
        break;
      }

      case config.step1.inputOptions.allOptions.view_request: {
        window.location.href = `${env.EXTRACTIONUI_URL}/engagement/${workpaper.engagementId}/data-request/${selectedInput.dataRequestInfo[0].dataRequestId}`;
        break;
      }
      case config.step1.inputOptions.allOptions.edit_request: {
        window.location.href = `${env.EXTRACTIONUI_URL}/engagement/${workpaper.engagementId}/edit-data-request/${selectedInput.dataRequestInfo[0].dataRequestId}`;
        break;
      }
      case config.step1.inputOptions.allOptions.decouple_request: {
        dispatch(decoupleDataRequest(workpaper.id, selectedInput.id, workpaperType, selectedInput.trifactaFlowId)).then(
          submitOptionsCallback,
          dispatch(getWorkpaperDMTs(workpaperId))
        );
        break;
      }

      case config.step1.inputOptions.allOptions.delete_input:
        if (workpaper.reviewStatus === WP_REVIEW_STATUS.SUBMITTED_FOR_REVIEW) {
          onCloseInputOptions();
          dispatch(addGlobalError({ type: AlertTypes.ERROR, message: t(`Pages_WorkpaperProcess_Step1_Error_Inputs`) }));
          break;
        }
        if (
          (canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS ||
            canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_BUNDLE_TRANSFORMATION_CANVAS) &&
          inputs.length === 1
        ) {
          setIsInputOptionModalShown(false);
          setActiveOption(false);
          showWarningModal(t('Components_AddWorkpaperModal_Step1_DeleteInputWarning'), null, true);
        } else if (selectedInput.trifactaInputId && !showDeleteWarning) {
          setShowDeleteWarning(true);
        } else {
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
            if (selectedInput.centralizedData && response) {
              dispatch(
                addCentralizedDataEventsToAuditLog(
                  workpaper.id,
                  WP_CENTRALISEDDATASET_EVENTS.DELETEDCENTRALIZEDDATASET,
                  selectedInput.name,
                  selectedInput.centralizedData.type
                )
              ).then(submitOptionsCallback);
            }
            if (response) {
              onCloseInputOptions();
            }
          });
        }
        break;
      case config.step1.inputOptions.allOptions.view_mapping:
        if (inputOptionValue) {
          dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue)).then(response => {
            if (response) {
              handleGoToInputDataScreen(selectedInput, true);
            }
          });
        } else {
          handleGoToInputDataScreen(selectedInput, true);
        }
        break;
      case config.step1.inputOptions.allOptions.retain_input:
        if (inputOptionValue) {
          dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue));
        }
        // presist the change in the analytics db
        dispatch(updateInputCentralizedData(selectedInput.id, datasetType[0]['value'])).then(response => {
          if (response) {
            // add a record in auditlog service
            dispatch(
              addCentralizedDataEventsToAuditLog(
                workpaper.id,
                WP_CENTRALISEDDATASET_EVENTS.MARKEDCENTRALIZEDDATASET,
                selectedInput.name,
                datasetType[0]['value']
              )
            ).then(submitOptionsCallback);
          }
        });
        break;
      case config.step1.inputOptions.allOptions.unmark_retain_input:
        if (inputOptionValue) {
          dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue));
        }
        dispatch(updateInputCentralizedData(selectedInput.id, null, true)).then(response => {
          if (response) {
            dispatch(
              addCentralizedDataEventsToAuditLog(
                workpaper.id,
                WP_CENTRALISEDDATASET_EVENTS.UNMARKEDCENTRALIZEDDATASET,
                selectedInput.name,
                selectedInput.centralizedData.type
              )
            ).then(submitOptionsCallback);
          }
        });
        break;
      case config.step1.inputOptions.allOptions.edit_connect_to_bundle:
      case config.step1.inputOptions.allOptions.connect_to_bundle:
        if (openConnectToBundle) {
          if (inputOptionValue) {
            dispatch(renameTrifactaDataset(selectedInput.id, inputOptionValue));
          }
          setCallConnectBundle(true);
        } else {
          setOpenConnectToBundle(true);
        }
        break;
      case config.step1.inputOptions.allOptions.replace_datamodel:
        if (!loadDMImport) {
          setLoadDMImport(true);
        }
        if (loadDMImport && dataModelId !== '') {
          dispatch(dispatchReplaceModel()).then(submitOptionsCallback);
          setIsInputOptionModalShown(false);
          setActiveOption(false);
          setLoadDMImport(false);
        }
        break;
      default:
        break;
    }
  };

  const onCloseWarning = () => {
    setIsWarningShown(false);
  };

  const onCloseLargeFileWarning = () => {
    setIsLargeFileWarningShown(false);
  };

  const onAddDataTableClick = () => {
    setSelectedInput(null);
    setDatasetType([]);
    setSelectionMade(false);
    setSelectedDatasets([]);
    setSelectOptions([]);
    setSelectedValue([]);
    setSelectedInputData(null);
    setIsUploaderShown(true);
    setIsNewUpload(true);
    setLoadDMImport(false);
  };
  const getSelectedDMName = () => {
    return datamodelTreeData[output.datamodelId]?.name;
  };

  const inputValidation = e => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const updatePriorPeriod = e => {
    if (!e.target.value || e.target.value === '0') setIsPriorPeriod(false);
    setPriorPeriodYear(e.target.value);
  };

  const updateIsPriorPeriod = value => {
    if (!priorPeriodYear || priorPeriodYear === '0') setPriorPeriodYear(1);
    setIsPriorPeriod(value);
  };

  const getConnectDMContent = () => {
    return (
      <Box width='100%' dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper`}>
        <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper-Header`} flexDirection='column'>
          <Text type={TextTypes.H2} fontWeight='s' color='black' mb={3}>
            {t('Pages_EngagementWorkpapers_AttachSourceModal_Output_Title_datamodel')}
          </Text>
          <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
            {t('Pages_EngagementWorkpapers_AttachSourceModal_Output_Note_datamodel')}
          </Text>
        </Flex>
        <Spinner
          spinning={treeIsLoading || isReplacingDMLoader}
          label={
            isReplacingDMLoader
              ? t(`Components_OutputOptionsModal_ConnectDM_AddingDM--test`)
              : t(`Components_OutputOptionsModal_ConnectDM_Feteching_${dataModelId ? 'preview' : 'datamodel'}`)
          }
        >
          <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Wrapper-Body`} flexDirection='row' margin='2vh 0'>
            <Flex
              dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane`}
              minWidth='30%'
              maxWidth='30%'
              flexDirection='column'
              marginRight='1vw'
            >
              {output?.datamodelId && (
                <PreviewSettings
                  dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Current-connected-Datamodel`}
                  showDelimeter={false}
                  fileName={getSelectedDMName()}
                  isNameCanClose={false}
                  onDeleteFile={() => {
                    setJsonPreview(null);
                  }}
                  onDelimiterChange={value => setDelimiter(value)}
                  hideSheetSelect
                  isExistingFile
                  indicatorType={PREVIEW_INDICATOR_TYPE.CONNECTED_DATAMODEL}
                />
              )}
              <Search
                data-instance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree-Search`}
                maxWidth='100%'
                data={[]}
                onChange={handleOnchangeSearch}
                placeholder={t('Components_WORKPAPERPROCESS_DATAMODEL_SEARCH_PLACEHOLDER')}
                manualFiltering
                marginTop='1vh'
              />
              <TreeMenu flexGrow={1} dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree-wrapper`}>
                <Tree
                  nodes={datamodelTree}
                  onPreviewClick={onPreviewClickHandler}
                  data-instance={`${COMPONENT_NAME}-Connet-DataModel-Left-Pane-Tree`}
                />
              </TreeMenu>
            </Flex>
            <Flex dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Right-Pane`} flexDirection='column'>
              <PreviewSettings
                dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Current-selected-File`}
                showDelimeter={false}
                fileName={previewName}
                isNameCanClose={false}
                onDeleteFile={() => {
                  setJsonPreview(null);
                }}
                hideSheetSelect
                isExistingFile
                indicatorType={PREVIEW_INDICATOR_TYPE.DATAMODEL}
              />
              <Preview dataInstance={`${COMPONENT_NAME}-Connet-DataModel-Right-Pane-Preview`}>
                <FilePreview type={FilePreviewTypes.DEFAULT} json={jsonPreview} setHeaders={setHeaders} />
              </Preview>
            </Flex>
          </Flex>
          <Box ml={300} mt={-65}>
            <Box ml={5}>
              <Checkbox
                label={t('Pages_EngagementWorkpapers_AttachSourceModal_Existing_Comparative_Period')}
                isChecked={isPriorPeriod}
                onChange={() => updateIsPriorPeriod(!isPriorPeriod)}
              />
            </Box>
            <Box mt={5} display='flex'>
              <Box width={40}>
                <Input onKeyPress={inputValidation} onChange={updatePriorPeriod} value={priorPeriodYear} />
              </Box>
              <Box ml={5}>
                <Text>
                  <i>{t('Pages_EngagementWorkpapers_AttachSourceModal_Existing_Prior_Periods')}</i>
                </Text>
              </Box>
            </Box>
          </Box>
        </Spinner>
      </Box>
    );
  };

  const getTertiaryButtonText = () => {
    if (showDeleteWarning || openConnectToBundle) {
      return (
        <Flex alignItems='center'>
          <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} /> {t('Components_AddNewWorkpaperModal_Tertiary')}
        </Flex>
      );
    }
    if (loadDMImport) {
      return (
        <Flex alignItems='center'>
          <Icon type={IconTypes.CHEVRON_LEFT} size={18} mr={2} />{' '}
          {t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_REPLACE_DATAMODEL_BACK')}
        </Flex>
      );
    }

    return null;
  };

  const getPrimaryButtonText = () => {
    if (openConnectToBundle) {
      return t('Pages_WorkpaperProcess_Input_ConnectToBundle_PrimaryButton');
    }
    if (activeOption === INPUT_OPTIONS.REPLACE_DATAMODEL && loadDMImport) {
      return t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_REPLACE_DATAMODEL_PRIMARYBUTTON');
    }

    return t('Pages_WorkpaperProcess_Input_ExistingMappingPrimaryButton');
  };

  const isPrimaryButtonDisabled = () => {
    if (openConnectToBundle) {
      if (isFetchingBundles || connectTrifactBundles || disablebuttonFromBundle) {
        return true;
      }

      return false;
    }
    if (loadDMImport && dataModelId === '') {
      return true;
    }

    return activeOption === INPUT_OPTIONS.RETAIN_INPUT && datasetType.length === 0;
  };

  const onCentralizedDataUpdateClick = () => {
    setShowCentralizedOutdatedVersionInfo(false);
    dispatch(refreshCentralizedData(workpaper.id, latestTemplate));
  };

  const tertiaryButtonClick = () => {
    if (showDeleteWarning) {
      setShowDeleteWarning(false);
    } else if (openConnectToBundle) {
      setOpenConnectToBundle(false);
    }
    if (loadDMImport) {
      setLoadDMImport(false);
      setDataModelId('');
    }
  };

  const onSelectedOptions = event => {
    setActiveOption(event);
  };
  const onChangeInputevent = event => {
    setinputOptionValue(event.target.value);
  };
  const onDatasetTypeChange = event => {
    setDatasetType(event);
    setSelectionMade(true);
  };

  const readyInputOptions = activeInput => {
    if (activeInput === null) {
      return config.step1.inputOptions.deleteOption;
    }

    let radioOptions;

    const hasDataRequestCoupling = activeInput.dataRequestInfo?.length > 0;

    if (workpaper.engagementId === null && !workpaper.isDMT) {
      if (activeInput?.centralizedData && isCentralizedDSUpdated && activeInput?.mappings?.length > 0) {
        radioOptions = [...config.step1.inputOptions.options.filter(option => option.value === 'view_mapping')];
      } else if (activeInput?.centralizedData) {
        radioOptions = [
          config.step1.inputOptions.CLoptions[INPUT_OPTIONS.UNMARK_RETAIN_INPUT],
          ...config.step1.inputOptions.options.filter(
            centralizedDataOption => centralizedDataOption.value === 'delete_input'
          ),
        ];
      } else if (activeInput.required) {
        if (
          activeInput.status !== WP_PROCESS_INPUT_STATUS.DONE &&
          activeInput.status !== WP_PROCESS_INPUT_STATUS.DATA_CLEARED
        ) {
          radioOptions = [
            config.step1.inputOptions.CLoptions[INPUT_OPTIONS.MARK_AS_OPTIONAL],
            ...config.step1.inputOptions.options.filter(
              centralizedDataOption => centralizedDataOption.value !== 'retain_input'
            ),
          ];
        } else {
          radioOptions = [
            config.step1.inputOptions.CLoptions[INPUT_OPTIONS.MARK_AS_OPTIONAL],
            ...config.step1.inputOptions.options,
          ];
        }
      } else if (!activeInput.required) {
        if (
          activeInput.status !== WP_PROCESS_INPUT_STATUS.DONE &&
          activeInput.status !== WP_PROCESS_INPUT_STATUS.DATA_CLEARED
        ) {
          radioOptions = [
            config.step1.inputOptions.CLoptions[INPUT_OPTIONS.MARK_AS_REQUIRED],
            ...config.step1.inputOptions.options.filter(
              centralizedDataOption => centralizedDataOption.value !== 'retain_input'
            ),
          ];
        } else {
          radioOptions = [
            config.step1.inputOptions.CLoptions[INPUT_OPTIONS.MARK_AS_REQUIRED],
            ...config.step1.inputOptions.options,
          ];
        }
      }

      if (
        workpaperType === WORKPAPER_TYPES.TRIFACTA &&
        workpaper?.status === WP_STATE_STATUS.DRAFT &&
        config.step1.inputOptions.isReplaceDMRequired
      ) {
        radioOptions = [...radioOptions, config.step1.inputOptions.CLoptions[INPUT_OPTIONS.REPLACE_DATAMODEL]];
      }
    } else if (hasDataRequestCoupling) {
      radioOptions = [...config.step1.inputOptions.datarequestOptions];
    } else {
      radioOptions = [...config.step1.inputOptions.options];
    }

    if (
      activeInput.status !== WP_PROCESS_INPUT_STATUS.DONE &&
      activeInput.status !== WP_PROCESS_INPUT_STATUS.DATA_CLEARED
    ) {
      radioOptions = radioOptions.filter(centralizedDataOption => centralizedDataOption.value !== 'retain_input');
    }

    const inputHasNotFinishedProcessing =
      activeInput.status !== WP_PROCESS_INPUT_STATUS.DONE &&
      activeInput.status !== WP_PROCESS_INPUT_STATUS.DATA_CLEARED &&
      !activeInput.error &&
      !hasDataRequestCoupling;

    if (
      inputHasNotFinishedProcessing ||
      (workpaperType === WORKPAPER_TYPES.TRIFACTA &&
        (activeInput.trifactaStatus === TRIFACTA_WP_PROCESS_INPUT_STATUS.TRIFACTA_STATUS ||
          !activeInput.trifactaInputId))
    ) {
      radioOptions = config.step1.inputOptions.deleteOption;
    }

    const shouldShowViewMappingOption = activeInput.mappings?.length > 0;

    if (!shouldShowViewMappingOption) {
      radioOptions = radioOptions.filter(item => item.value !== 'view_mapping');
    }
    // Condition for having "Connect/Edit TO Bundle" as an option
    if (
      workpaper?.engagementId === null &&
      activeInput?.datamodelId &&
      !workpaper?.isDMT &&
      !workpaper?.bundleTransformation
    ) {
      radioOptions = [
        ...radioOptions,
        config.step1.inputOptions.CLoptions[
          activeInput?.linkedBundles?.length > 0
            ? INPUT_OPTIONS.EDIT_CONNECT_TO_BUNDLE
            : INPUT_OPTIONS.CONNECT_TO_BUNDLE
        ],
      ];
      // Added this for enabling tag bundle option for published workpapers.
      // To be removed when tag bundle is moved from workpaper input options.
      if (readOnlyfromWP) {
        radioOptions = [
          config.step1.inputOptions.CLoptions[
            activeInput?.linkedBundles?.length > 0
              ? INPUT_OPTIONS.EDIT_CONNECT_TO_BUNDLE
              : INPUT_OPTIONS.CONNECT_TO_BUNDLE
          ],
        ];
      }
    }

    return radioOptions;
  };

  const inputOptionsModalContent = activeInput => {
    const displayOptions = readyInputOptions(activeInput);
    let showInputNameEditor = true;
    if (
      (workpaper.engagementId === null &&
        !workpaper.isDMT &&
        activeInput?.centralizedData &&
        isCentralizedDSUpdated &&
        activeInput?.mappings?.length > 0) ||
      readOnlyfromWP
    ) {
      showInputNameEditor = false;
    }

    const updatedRadioOptions = displayOptions.map(option => {
      const newOption = { ...option };

      if (newOption.required_permissions?.length > 0) {
        newOption.isDisabled = true;
        newOption.required_permissions.every(requirement => {
          if (checkPermissions(permissions.permissions, requirement.permission, requirement.action)) {
            newOption.isDisabled = false;

            return false;
          }

          return true;
        });
      }

      if (newOption.isExtraComponent) {
        switch (activeOption) {
          case INPUT_OPTIONS.RETAIN_INPUT:
            newOption.isExtraComponent = true;

            newOption.extraComponent = (
              <Flex borderBottomWidth={1} borderBottomColor='lightGray' borderBottomStyle='solid' pb={6}>
                <Select
                  type={SelectTypes.SINGLE}
                  label={t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_RETAIN_DATA_SELECT')}
                  options={selectOptions}
                  value={selectedValue}
                  required
                  emptyMessage={t('Components_WOPROCESSSTEP1_INPUTOPTION_OPTIONSLIST_RETAIN_DATA_SELECT_EMPTY')}
                  filtering={false}
                  onChange={onDatasetTypeChange}
                  optionValueKey='value'
                  optionTextKey='name'
                  dataInstance={`${COMPONENT_NAME}-datasetType`}
                />
              </Flex>
            );
            break;
          case INPUT_OPTIONS.REPLACE_DATAMODEL:
          case INPUT_OPTIONS.MARK_AS_REQUIRED:
          case INPUT_OPTIONS.MARK_AS_OPTIONAL:
          case INPUT_OPTIONS.DELETE_INPUT:
          case INPUT_OPTIONS.UNMARK_RETAIN_INPUT:
          default:
            newOption.isExtraComponent = false;
            newOption.extraComponent = null;
            break;
        }
      }

      return newOption;
    });

    return (
      <Box width='100%'>
        <Flex>
          {showDuplicateTableNameError && (
            <Alert
              type={AlertTypes.ERROR}
              message={t('Components_WOPROCESSSTEP1_INPUTOPTION_DUPLICATE_TABLE_NAME_ERROR')}
              dataInstance={`${COMPONENT_NAME}-DuplicateTableName`}
              mb={5}
              onClose={() => setShowDuplicateTableNameError(false)}
            />
          )}
        </Flex>
        <Flex>
          <Text type={TextTypes.H2} fontWeight='s' color='black'>
            {config.step1.inputOptions.title}
          </Text>
          <Text type={TextTypes.H2} fontWeight='s' pl={2} color='gray'>
            {config.step1.inputOptions.name}
          </Text>
        </Flex>

        <Box my={10}>
          {showInputNameEditor && (
            <Flex>
              <Input
                label={config.step1.inputOptions.rename_header}
                value={inputOptionValue === false ? activeInput.name : inputOptionValue}
                onChange={event => {
                  onChangeInputevent(event);
                }}
                disabled={activeOption === INPUT_OPTIONS.DELETE_INPUT}
              />
            </Flex>
          )}
        </Box>
        <Box mt={8}>
          <Flex>
            <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
              {config.step1.inputOptions.todo}
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

  const getModalContent = () => {
    if (showDeleteWarning === true) {
      return (
        <Text
          padding={8}
          sx={{ overflowWrap: 'break-word' }}
          dataInstance={`${COMPONENT_NAME}-warningDeleteText`}
          type={TextTypes.H3}
        >
          {t('Components_AddWorkpaperModal_Step1_DeleteWarningLabel')}
        </Text>
      );
    }

    if (openConnectToBundle && selectedInput) {
      return (
        <ConnectToBundle
          callConnectBundle={callConnectBundle}
          setCallConnectBundle={setCallConnectBundle}
          connectedBundle={selectedInput.linkedBundles || []}
          disablePrimaryButton={setDisablebuttonFromBundle}
          selectedInputId={selectedInput.id}
          workpaperId={workpaperId}
          onCloseInputOptions={onCloseInputOptions}
        />
      );
    }

    if (loadDMImport) {
      return getConnectDMContent();
    }

    if (workpaperType === WORKPAPER_TYPES.TRIFACTA && selectedInput) {
      return inputOptionsModalContent(selectedInput);
    }

    return null;
  };

  const onChangeToggle = () => {
    dispatch(setAutoDmtFlag(workpaperId, !shouldAutoDmt)).then(setShouldAutoDmt(!shouldAutoDmt));
  };

  const constructToggleLabel = () => {
    if (shouldAutoDmt) {
      const isMidDmtFlowText = isMidDmtFlow
        ? t('Pages_WorkpaperProcess_Step1_AutoDmtToggle_Label_On_CanotToggle')
        : t('Pages_WorkpaperProcess_Step1_AutoDmtToggle_Label_On_CanToggle');

      return `${t('Pages_WorkpaperProcess_Step1_AutoDmtToggle_Label_On')} - ${isMidDmtFlowText}`;
    }

    return t('Pages_WorkpaperProcess_Step1_AutoDmtToggle_Label_Off');
  };

  return (
    <Box pl={90}>
      <Spinner
        overlayOpacity={0.9}
        pathSize={theme.space[1]}
        size={theme.space[8]}
        spinning={isAddingDatasetToFlow || isRetryingInputFileCopy || isTriggeringDMVsForZip || isReplacingDMLoader}
        label={spinnerLabel}
        optionalRender={false}
      >
        {template?.isOutdatedAnalytic === true &&
          (latestTemplate?.centralizedDSUpdate
            ? showCentralizedOutdatedVersionInfo && (
                <Flex>
                  <Alert
                    type={AlertTypes.INFO}
                    message={t('Pages_WorkpaperProcess_Step1_CentralizedOutdatedVersionInfo')}
                    dataInstance={`${COMPONENT_NAME}-TrifactaCentralizedDSOutdatedInfo`}
                    mb={5}
                    onClose={() => setShowCentralizedOutdatedVersionInfo(false)}
                    hasExtraLink
                    extraLinkText='Update'
                    handleExtraLink={onCentralizedDataUpdateClick}
                    color='blue'
                    charLimit={400}
                  />
                </Flex>
              )
            : showOutdatedVersionInfo && (
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
              ))}
        {config?.step1?.showAnalyticTemplate && (
          <Box mb={20}>
            <Text type={TextTypes.BODY} mb={3} color='gray'>
              {t('Pages_WorkpaperProcess_Step1_SelectedTemplateType')}
            </Text>
            <Flex alignItems='center'>
              <Tag dataInstance={`${COMPONENT_NAME}-AnalyticsTemplate`}>{template?.name}</Tag>
              {template?.link ? (
                <Link ml={4} to={template.link?.url} external target='_blank'>
                  {template.link?.name}
                </Link>
              ) : (
                ''
              )}
            </Flex>
          </Box>
        )}
        <Box>
          <ScheduleAlert workpaperId={workpaperId} shouldAutoDmt={shouldAutoDmt} />
          <Text type={TextTypes.BODY} color='gray' mb={5}>
            {t('Pages_WorkpaperProcess_Step1_TableDescription')}
          </Text>
          <WorkpaperInputs
            workpaperId={workpaperId}
            workpaperType={workpaperType}
            engagementId={workpaper?.engagementId}
            config={config}
            setSelectedInput={setSelectedInput}
            setIsInputOptionModalShown={setIsInputOptionModalShown}
            setShouldClean={setShouldClean}
            setIsNewUpload={setIsNewUpload}
            setIsWarningShown={setIsWarningShown}
            setIsUploaderShown={setIsUploaderShown}
            handleGoToInputDataScreen={handleGoToInputDataScreen}
            setSelectedInputData={setSelectedInputData}
            trifactaFlowId={workpaper?.trifactaFlowId}
            isAnyInputProcessing={isAnyInputProcessing}
            isCentralizedDSUpdated={isCentralizedDSUpdated}
            setIsAnyInputProcessing={setIsAnyInputProcessing}
            reviewStatus={workpaper.reviewStatus}
            canvasType={canvasType}
          />
        </Box>
        <Box mt={5}>
          {config?.step1?.addDataTableExists && inputsStatus && (
            <Button
              disabled={isAddDisabled()}
              type={ButtonTypes.LINK}
              icon={IconTypes.PLUS}
              iconWidth={20}
              onClick={() => onAddDataTableClick()}
              dataInstance={`${COMPONENT_NAME}-DataTable`}
            >
              <Text type={TextTypes.H3}>{config.step1.addDataTable}</Text>
            </Button>
          )}
        </Box>
        <Box>
          {workpaperType === WORKPAPER_TYPES.TRIFACTA && shouldAutoDmt !== null && hasDataConnection && (
            <Flex alignItems='center' mt='2'>
              <Toggle
                disabled={isMidDmtFlow || isSettingAutoDmtFlag || engagement?.encryption}
                value={shouldAutoDmt}
                onChange={onChangeToggle}
                dataInstance={`${COMPONENT_NAME}-AutoDmtToggle`}
              />
              <Text ml={2}>{constructToggleLabel()}</Text>
            </Flex>
          )}
        </Box>
        {isUploaderShown && (
          <InputUploaderModal
            isDMT={workpaper?.isDMT}
            isOpen={isUploaderShown}
            isNewUpload={isNewUpload}
            inputId={selectedInput}
            selectedInput={selectedInputData}
            shouldClean={shouldClean}
            workpaperType={workpaperType}
            trifactaFlowId={workpaper?.trifactaFlowId}
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
        <LargeFileWarningModal isOpen={isLargeFileWarningShown} onClose={onCloseLargeFileWarning} />
        {workpaperType === WORKPAPER_TYPES.TRIFACTA && (
          <Modal
            isOpen={isInputOptionModalShown}
            onClose={onCloseInputOptions}
            primaryButtonText={getPrimaryButtonText()}
            secondaryButtonText={t('Components_OutputOptionsModal_Secondary')}
            tertiaryButtonText={getTertiaryButtonText()}
            onPrimaryButtonClick={onSubmitInputOptions}
            onSecondaryButtonClick={onCloseInputOptions}
            onTertiaryButtonClick={tertiaryButtonClick}
            size={showDeleteWarning ? ModalSizes.SMALL : ModalSizes.LARGE}
            dataInstance={`${COMPONENT_NAME}-Options`}
            disablePrimaryButton={isPrimaryButtonDisabled()}
          >
            <Spinner
              overlayOpacity={showDeleteWarning ? 0.95 : 0.85}
              spinning={
                isInputOptionTriggered ||
                isTrifactaDatasetRename ||
                isInputDataClearing ||
                isDatasetDeleting ||
                isDatasetUpdating ||
                isUpdatingTheInput
              }
              label={spinnerLabel}
            >
              <AlertHub alerts={inputOptionErrors} />
              {getModalContent()}
            </Spinner>
          </Modal>
        )}
        {renderWarningModal()}
      </Spinner>
    </Box>
  );
};

WpProcessStep1.propTypes = {
  template: PropTypes.object,
};

WpProcessStep1.defaultProps = {
  template: {},
};

export default WpProcessStep1;
