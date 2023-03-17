import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertHub, Modal, ModalSizes } from 'cortex-look-book';
import { InputUploader } from './InputUploader/InputUploader';
import { NewFileUploader } from './NewFileUpload/NewFileUploader';
import { ExistingUploader } from './ExistingUploader/ExistingUploader';
import { ZipFileUploader } from './ZipFileUploader/ZipFileUploader';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { wpStep1Selectors } from '../../store/workpaperProcess/step1/selectors';
import { attachDialogSelectors } from '../../store/dialogs/attachFiles/selectors';
import { AttachFilesActions } from '../../store/dialogs/attachFiles/actionTypes';
import { engagementSelectors } from '../../store/engagement/selectors';
import { clientSelectors } from '../../store/client/selectors';
import { deleteInputFileError } from '../../store/errors/actions';
import { errorsSelectors } from '../../store/errors/selectors';
import { getEngagementFolders } from '../../store/staging/actions';
import { getAllDataModelsForWB } from '../../store/bundles/actions';
import { createDataRequest } from '../../store/workpaper/actions';
import {
  COMPONENT_NAME,
  INPUT_UPLOADER_TYPES,
  INPUT_UPLOADER_TYPE_VALUES,
  INPUT_UPLOADER_TYPE_PAGES,
} from './constants/constants';
import useConfig from '../WorkPaperProcess/hooks/useConfig';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';
import { WORKPAPER_CANVAS_TYPES } from '../../utils/WorkpaperTypes.const';

// eslint-disable-next-line sonarjs/cognitive-complexity
const InputUploaderModal = props => {
  const {
    isOpen,
    handleClose,
    inputId,
    shouldClean,
    workpaperType,
    isNewUpload,
    trifactaFlowId,
    handleLargeFileWarning,
    canvasType,
    selectedInput,
    isDMT,
  } = props;
  const { config } = useConfig(canvasType);
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(
    canvasType === WORKPAPER_CANVAS_TYPES.TRIFACTA_DMT_CANVAS && isNewUpload && !inputId
      ? INPUT_UPLOADER_TYPES.DATA_MODEL
      : INPUT_UPLOADER_TYPES.UPLOAD
  );
  const [disableUpload, setDisableUpload] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dataTableName, setDataTableName] = useState('');
  const dispatch = useDispatch();
  const newFileRef = useRef();
  const existingFileRef = useRef();
  const zipFileRef = useRef();

  const engagementId = useSelector(engagementSelectors.selectEngagement)?.id;
  const { workpaperId } = useParams();
  const clientId = useSelector(clientSelectors.selectClient)?.id;
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const hasError = useSelector(attachDialogSelectors.error);
  const errors = useSelector(errorsSelectors.selectInputFileErrors);
  const preview = useSelector(attachDialogSelectors.preview);
  const dmtree = useSelector(attachDialogSelectors.datamodelTreeData);
  const [isPrimaryButtonDisabled, setIsPrimaryButtonDisabled] = useState(true);
  const [isNewDataRequestReady, setIsNewDataRequestReady] = useState(false);
  const [selectedDataSources, setSelectedDataSources] = useState([]);

  const onBackHandler = () => {
    setDisableUpload(false);
    setCurrent(0);
    dispatch({
      type: AttachFilesActions.RESET,
    });
  };

  const onErrorClose = errorKey => {
    dispatch(deleteInputFileError(errorKey));
  };

  const onFolderChange = isUploadDisabled => {
    setDisableUpload(isUploadDisabled);
  };

  const assignDataTableName = newName => {
    setDataTableName(newName);
  };

  useEffect(() => {
    if (selectedValue === INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST && !isNewDataRequestReady) {
      setIsPrimaryButtonDisabled(true);
    }
  }, [selectedValue]);

  useEffect(() => {
    const isDisabled =
      isAttachingFile ||
      (dmtree.size > 0 && !Object.values(preview.data).length > 0) ||
      (hasError && hasError.validation) ||
      (isNewUpload && disableUpload) ||
      (current === 3 && disableUpload);

    setIsPrimaryButtonDisabled(isDisabled);
  }, [isAttachingFile, dmtree, preview, hasError, isNewUpload, disableUpload, current]);

  const onChangeBundleDataSource = sourceSystemBundles => {
    const isDisabled =
      sourceSystemBundles.length === 0 ||
      sourceSystemBundles.some(sourceSystemBundle => sourceSystemBundle.dataSourceId === 0);

    setIsPrimaryButtonDisabled(isDisabled);
    setIsNewDataRequestReady(!isDisabled);
  };

  const onChangeBundleSourceSystem = () => {
    setIsPrimaryButtonDisabled(true);
    setIsNewDataRequestReady(false);
  };

  const views = [
    <InputUploader
      onSelected={setSelectedValue}
      value={selectedValue}
      inputId={inputId}
      selectedInput={selectedInput}
      shouldClean={shouldClean}
      workpaperType={workpaperType}
      isNewUpload={isNewUpload}
      dataTableNameAssign={assignDataTableName}
      canvasType={canvasType}
      selectedDataSources={selectedDataSources}
      setSelectedDataSources={setSelectedDataSources}
      onChangeBundleDataSource={sourceSystemBundles => onChangeBundleDataSource(sourceSystemBundles)}
      onChangeBundleSourceSystem={onChangeBundleSourceSystem}
      dataInstance={`${COMPONENT_NAME}_Input_Uploader`}
      {...props}
    />,
    <NewFileUploader
      ref={newFileRef}
      onBack={onBackHandler}
      onFolderChange={onFolderChange}
      onClose={handleClose}
      inputId={inputId}
      selectedInput={selectedInput}
      shouldClean={shouldClean}
      workpaperType={workpaperType}
      isNewUpload={isNewUpload}
      dataTableName={dataTableName}
      trifactaFlowId={trifactaFlowId}
      handleLargeFileWarning={handleLargeFileWarning}
      canvasType={canvasType}
      dataInstance={`${COMPONENT_NAME}_New_File_Uploader`}
    />,
    <ExistingUploader
      ref={existingFileRef}
      onBack={onBackHandler}
      onClose={handleClose}
      inputId={inputId}
      selectedInput={selectedInput}
      shouldClean={shouldClean}
      workpaperType={workpaperType}
      dataTableName={dataTableName}
      isNewUpload={isNewUpload}
      trifactaFlowId={trifactaFlowId}
      uploadtype={selectedValue}
      canvasType={canvasType}
      isDMT={isDMT}
      dataInstance={`${COMPONENT_NAME}_Existing_Uploader`}
    />,
    <ZipFileUploader
      ref={zipFileRef}
      onBack={onBackHandler}
      onFolderChange={onFolderChange}
      onClose={handleClose}
      inputId={inputId}
      shouldClean={shouldClean}
      workpaperType={workpaperType}
      dataTableName={dataTableName}
      trifactaFlowId={trifactaFlowId}
      canvasType={canvasType}
      handleLargeFileWarning={handleLargeFileWarning}
      dataInstance={`${COMPONENT_NAME}_Zip_File_Uploader`}
    />,
  ];

  const handleNewUpload = () => {
    if (((newFileRef || {}).current || {}).submit) {
      newFileRef.current.submit();
    }
  };

  const handleExistingUpload = () => {
    if (((existingFileRef || {}).current || {}).submit) {
      existingFileRef.current.submit();
    }
  };

  const handleZipFileUpload = () => {
    if (((zipFileRef || {}).current || {}).submit) {
      zipFileRef.current.submit();
    }
  };

  const handleSubmit = () => {
    switch (current) {
      case 0:
        if (
          selectedValue === INPUT_UPLOADER_TYPES.UPLOAD ||
          selectedValue === INPUT_UPLOADER_TYPES.SELECT ||
          selectedValue === INPUT_UPLOADER_TYPES.DATA_MODEL ||
          selectedValue === INPUT_UPLOADER_TYPES.ZIP
        ) {
          if (selectedValue !== INPUT_UPLOADER_TYPES.DATA_MODEL) {
            dispatch(getEngagementFolders(clientId, engagementId));
          }
          if (config?.step1?.smartUploadExists) {
            dispatch(getAllDataModelsForWB());
          }
          setCurrent(INPUT_UPLOADER_TYPE_PAGES[selectedValue]);
        }
        if (selectedValue === INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST && isNewDataRequestReady) {
          dispatch(createDataRequest(workpaperId, selectedDataSources, selectedInput?.id));
          handleClose();
        }
        break;
      case 1:
        handleNewUpload();
        break;
      case 3:
        handleZipFileUpload();
        break;
      default:
        handleExistingUpload();
        break;
    }
  };

  const primaryButtonText = t(
    `Components_${COMPONENT_NAME}_Value_${
      selectedValue === INPUT_UPLOADER_TYPES.ZIP
        ? INPUT_UPLOADER_TYPE_VALUES[INPUT_UPLOADER_TYPES.UPLOAD]
        : INPUT_UPLOADER_TYPE_VALUES[selectedValue]
    }`
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={primaryButtonText}
      secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      disablePrimaryButton={isPrimaryButtonDisabled}
      size={ModalSizes.LARGE}
      dataInstance={COMPONENT_NAME}
    >
      <AlertHub alerts={errors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}_Alert`} />
      {views[current]}
    </Modal>
  );
};

export default InputUploaderModal;

InputUploaderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
