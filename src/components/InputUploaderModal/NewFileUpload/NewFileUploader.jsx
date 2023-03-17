import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonTypes,
  FilePreview,
  FilePreviewTypes,
  Flex,
  IconTypes,
  Intent,
  Spinner,
  Select,
  SelectTypes,
  Box,
  RadioGroup,
  Text,
  TextTypes,
} from 'cortex-look-book';
import { BackButton } from '../StyledFileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/Header/Header';
import { PreviewSettings } from '../components/UploadedFilePreview/PreviewSettings';
import { DELIMITER } from '../components/Delimeter/constants';
import { useParams } from 'react-router-dom';
import { attachNewFile, getWPStep1Details, uploadNewInput } from '../../../store/workpaperProcess/step1/actions';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import { datawranglerSelectors } from '../../../store/dataWrangler/selectors';
import { bundlesSelectors } from '../../../store/bundles/selectors';
import { ThemeContext } from 'styled-components';
import { AttachFilesActions } from '../../../store/dialogs/attachFiles/actionTypes';
import { addInputFileError } from '../../../store/errors/actions';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import env from 'env';
import { COMPONENT_NAME, oneMB } from './constants';
import { getInputHeaderSelectionOptions } from '../constants/constants';
import useConfig from '../../WorkPaperProcess/hooks/useConfig';
import { FileDropZone } from './FileDropZone';
import useTranslation from 'src/hooks/useTranslation';
import useIsSpecificRoute from 'src/hooks/useIsSpecificRoute';
import { WPProcessingSelectors } from '../../../store/workpaperProcess/step2/selectors';
import { engagementSelectors } from '../../../store/engagement/selectors';
import { shouldSendMessageRoutes } from 'src/constants/pipelineMessages';
import { fileUpload, saveFileForDataTable } from '../../../store/notebookWorkpaperProcess/step1/actions';
import StagingService from '../../../services/staging.service';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const NewFileUploader = forwardRef((props, ref) => {
  const {
    onBack,
    onClose,
    inputId,
    shouldClean,
    workpaperType,
    onFolderChange,
    isNewUpload,
    dataTableName,
    trifactaFlowId,
    handleLargeFileWarning,
    selectedInput,
    canvasType,
  } = props;
  const { t } = useTranslation();
  const { workpaperId } = useParams();
  const shouldSendMessage = useIsSpecificRoute(shouldSendMessageRoutes);
  const { config } = useConfig(canvasType);
  const [file, setFile] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [blankHeaders, setBlankHeaders] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [selectedDataModel, setSelectedDataModel] = useState([]);
  const [valid, setValid] = useState(false);
  const [sheetList, setSheetList] = useState([]);
  const [delimiter, setDelimiter] = useState(DELIMITER.COMMA);
  const [uploadedSheets, setUploadedSheets] = useState({});
  const [sheetOptions, setSheetOptions] = useState([]);
  const [currentSheet, setCurrentSheet] = useState(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [ensureHeader, setEnsureHeader] = useState(true);
  const theme = useContext(ThemeContext);
  const engagementId = useSelector(engagementSelectors.selectEngagement)?.id;
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const isDatasetUpdating = useSelector(datawranglerSelectors.isDatasetUpdating);
  const datamodelsListForWB = useSelector(bundlesSelectors.datamodelsListForWB);
  const isFetchingDatamodelsListForWB = useSelector(bundlesSelectors.selectIsFetchingDatamodelsListForWB);
  const isFetchingModified = useSelector(datawranglerSelectors.isFetchingModified(workpaperId));
  const isLoadingWPData = useSelector(WPProcessingSelectors.isLoading(workpaperId));
  const isFetchingStatus = useSelector(WPProcessingSelectors.isFetchingStatus(workpaperId));
  const fetchingTrifactaParams = useSelector(WPProcessingSelectors.fetchingTrifactaParams(workpaperId));
  const fetchingTrifactaJRSteps = useSelector(WPProcessingSelectors.fetchingTrifactaJRSteps(workpaperId));
  const [encodingType, setEncodingType] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  let isLoading;

  if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
    isLoading = isFetchingModified || isLoadingWPData;
  } else {
    isLoading =
      isFetchingModified || isLoadingWPData || isFetchingStatus || fetchingTrifactaParams || fetchingTrifactaJRSteps;
  }
  const dispatch = useDispatch();

  useEffect(() => {
    if (!file) {
      dispatch({
        type: AttachFilesActions.RESET,
      });
    }
  }, [file]);

  useEffect(() => {
    dispatch({
      type: AttachFilesActions.VALIDATION_ERROR,
      validation: valid,
    });
  }, [valid]);

  useEffect(() => {
    if (isNewUpload) {
      if (file && !folderName) {
        onFolderChange(true);
      } else {
        onFolderChange(false);
      }
    }
  }, [file, folderName]);

  const detectFileEncoding = async slicedContent => {
    const fileEncoding = await StagingService.getFileEncoding(slicedContent, engagementId);
    setEncodingType(fileEncoding);
    setShowPreview(true);
  };

  const getDataForEncoding = async uploadedFile => {
    const contentForEncoding = await new Promise(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        if (e.target.result) {
          resolve(e.target.result);
        }
      };
      fileReader.readAsArrayBuffer(uploadedFile.slice(0, oneMB)); // Read 1MB of data from the uploaded data
    });
    const slicedContent = new File([contentForEncoding], uploadedFile.name, {
      lastModified: Date.now(),
    });
    detectFileEncoding(slicedContent);
  };

  useEffect(() => {
    if (file) {
      const extention = file.name.split('.').pop().toLowerCase();
      if (extention === 'csv' || extention === 'txt') {
        getDataForEncoding(file);
      } else {
        setShowPreview(true);
      }
    }
  }, [file]);

  useEffect(() => {
    setSheetOptions(Object.keys(uploadedSheets).map((sheet, i) => ({ value: i, text: sheet })));
  }, [uploadedSheets]);

  const validateMultipleSheets = useCallback((sheets, sheetNameList) => {
    if (!sheetNameList.length) {
      return [];
    }

    const sheetsWithErrors = [];
    const firstSheet = sheets[sheetNameList[0]];

    sheetNameList.forEach(sheet => {
      if (sheets[sheet].length !== firstSheet.length) {
        sheetsWithErrors.push(sheet);
      } else {
        for (let i = 0; i < sheets[sheet].length; i++) {
          if (sheets[sheet][i] !== firstSheet[i]) {
            sheetsWithErrors.push(sheet);
            break;
          }
        }
      }
    });

    return sheetsWithErrors;
  }, []);

  const handleSubmit = () => {
    if (file && headers) {
      const sheetsWithErrors = validateMultipleSheets(
        uploadedSheets,
        (sheetList || []).map(sheet => sheet.text)
      );
      if (!sheetsWithErrors.length) {
        const dmId = selectedInput?.datamodelId || selectedDataModel[0]?.id;
        if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
          const parentNodeId = selectedInput?.file.parentNodeId;

          dispatch(fileUpload(workpaperId, file, parentNodeId)).then(response => {
            if (response) {
              const fileContent = {
                nodeId: response.id,
                parentNodeId,
              };
              const fileDelimiter = delimiter;

              dispatch(saveFileForDataTable(headers, fileContent, file.name, fileDelimiter, selectedInput?.id)).then(
                () => {
                  dispatch(getWPStep1Details(workpaperId, true, workpaperType));
                }
              );
            }
          });
        } else if (workpaperType === WORKPAPER_TYPES.TRIFACTA && isNewUpload) {
          dispatch(
            uploadNewInput(
              workpaperId,
              shouldClean,
              file,
              headers,
              sheetList,
              delimiter,
              folderName,
              dataTableName,
              null,
              trifactaFlowId,
              selectedInput?.id,
              dmId,
              blankHeaders,
              ensureHeader,
              engagementId,
              shouldSendMessage
            )
          );
        } else {
          // This if else needs to be refactored as this will pass trifactaFlowID for cortexWP since the state is not getting rested.
          dispatch(
            attachNewFile(
              workpaperId,
              inputId,
              shouldClean,
              file,
              headers,
              sheetList,
              delimiter,
              workpaperType,
              trifactaFlowId,
              blankHeaders,
              ensureHeader,
              engagementId,
              shouldSendMessage
            )
          );
        }
        onClose();
      } else {
        dispatch(
          addInputFileError({
            message: t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_Error_Sheets'),
            type: Intent.ERROR,
          })
        );
      }
    }
  };

  const updateFolderName = folder => {
    const updatedFolder = folder && typeof folder === 'object' && folder.length > 0 ? folder : [{ fileName: folder }];
    if (updatedFolder?.length > 0 && updatedFolder[0]?.fileName.length > 0) {
      if (typeof folder === 'object') {
        setSelectedFolder(updatedFolder);
      } else {
        setSelectedFolder([]);
      }
      setFolderName(updatedFolder[0].fileName);
    } else {
      setSelectedFolder([]);
      setFolderName(null);
    }
  };

  const onChange = value => {
    setSelectedDataModel(value);
  };

  const onInputChange = value => {
    if (value) {
      setSelectedDataModel([]);
    }
  };

  const onUpload = fileData => {
    if (!fileData) {
      let wrongFileTypeMsg = t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_Error_WrongType');

      if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
        wrongFileTypeMsg = t('pages_notebook-attach-new-file-upload_wrong_type_message');
      }
      dispatch(
        addInputFileError({
          message: wrongFileTypeMsg,
          type: Intent.ERROR,
        })
      );
    } else if (fileData.size < env.FILE_UPLOAD_MAX_BYTES) {
      setFile(fileData);
    } else {
      handleLargeFileWarning();
    }
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  return (
    <>
      <Header
        titleText={t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_Title')}
        noteText={t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_Note')}
      />

      <Spinner spinning={isAttachingFile || isDatasetUpdating || isFetchingDatamodelsListForWB || isLoading}>
        <Box dataInstance={`${COMPONENT_NAME}-Model`}>
          <Flex theme={theme} my={8} flexDirection='column'>
            {!file && (
              <>
                <FileDropZone workpaperType={workpaperType} onUpload={onUpload} />
              </>
            )}
            {file && (
              <Spinner spinning={isParsingFile}>
                <PreviewSettings
                  fileName={file.name}
                  sheets={sheetOptions}
                  valid={setValid}
                  onDeleteFile={() => setFile(null)}
                  onDelimiterChange={value => setDelimiter(value)}
                  onSheetChange={sheets => {
                    setSheetList(sheets);
                  }}
                  onLastSelectedChange={sheet => {
                    setCurrentSheet(sheet);
                  }}
                  onChange={folder => {
                    updateFolderName(folder);
                  }}
                  selectedFolder={selectedFolder}
                  workpaperType={workpaperType}
                  isNewUpload={isNewUpload}
                >
                  {showPreview && (
                    <FilePreview
                      mt={6}
                      type={FilePreviewTypes.DEFAULT}
                      file={file}
                      delimiter={delimiter}
                      setHeaders={setHeaders}
                      setBlankHeaders={setBlankHeaders}
                      onFileChosen={setUploadedSheets}
                      currentSheet={currentSheet?.text}
                      sanitizeHeaders
                      setIsParsing={setIsParsingFile}
                      encoding={encodingType}
                    />
                  )}
                </PreviewSettings>
                {workpaperType === WORKPAPER_TYPES.TRIFACTA && (
                  <Box display='none' my={8}>
                    <Text type={TextTypes.H3}>{t('Components_FileUploader_HeaderRow_Label')}</Text>
                    <RadioGroup
                      dataInstance={`${COMPONENT_NAME}-Header`}
                      fontWeight='s'
                      options={getInputHeaderSelectionOptions(t)}
                      selectedValue={ensureHeader}
                      onOptionChange={value => setEnsureHeader(value)}
                    />
                  </Box>
                )}
              </Spinner>
            )}
          </Flex>
        </Box>
      </Spinner>
      {config?.step1?.smartUploadExists && isNewUpload && (
        <Box width='30%' mb={3}>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_NewFileUploader_SelectDataModel')}
            options={datamodelsListForWB}
            value={selectedDataModel}
            filtering
            onChange={onChange}
            onInputChange={onInputChange}
            inputChangeDebounce={1000}
            optionValueKey='nameTech'
            optionTextKey='nameTech'
            dataInstance={COMPONENT_NAME}
          />
        </Box>
      )}
      <BackButton
        type={ButtonTypes.SECONDARY}
        icon={IconTypes.CHEVRON_LEFT}
        onClick={onBack}
        data-instance={`${COMPONENT_NAME}-Back`}
      >
        {t('Components_NewFileUploader_BackButton_Back')}
      </BackButton>
    </>
  );
});

NewFileUploader.propType = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
  onFolderChange: PropTypes.func,
};
