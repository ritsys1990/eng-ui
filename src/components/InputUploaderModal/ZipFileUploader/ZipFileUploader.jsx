import React, { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AlertHub,
  Box,
  ButtonTypes,
  Flex,
  Icon,
  IconTypes,
  Intent,
  RadioGroup as RadioGroupObj,
  Spinner,
  StateView,
  Text,
  TextTypes,
  Tree,
} from 'cortex-look-book';
import { useUploadDrop } from '../../../hooks/useUploadDrop';
import { BackButton, DropZoneStyle, DropZoneWrapper } from '../StyledFileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from 'styled-components';
import { StagingActionTypes } from '../../../store/staging/actionTypes';
import { addInputFileError } from '../../../store/errors/actions';
import { validateZipFile } from '../../../store/staging/actions';
import { uploadZipFile, checkforZipfile } from '../../../store/workpaperProcess/step1/actions';
import { stagingSelectors } from '../../../store/staging/selectors';
import { useParams } from 'react-router-dom';
import { COMPONENT_NAME } from './constants';
import env from 'env';
import { wpStep1Selectors } from '../../../store/workpaperProcess/step1/selectors';
import useConfig from '../../WorkPaperProcess/hooks/useConfig';
import {
  checkForZipUploadWarnings,
  checkForXLSXFilesOnZip,
  checkForDuplicateFiles,
} from '../../WorkPaperProcess/utils/WorkPaperProcess.utils';
import useTranslation from 'src/hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ZipFileUploader = forwardRef((props, ref) => {
  const { onBack, handleLargeFileWarning, onClose, canvasType, onFolderChange, trifactaFlowId, workpaperType } = props;
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState(null);
  const [selectedValue, setSelectedValue] = useState('overwrite');
  const [inputStatus, setInputStatus] = useState(false);
  const theme = useContext(ThemeContext);
  const zipFileContents = useSelector(stagingSelectors.zipFileContents);
  const isValidatingZipFile = useSelector(stagingSelectors.isValidatingZipFile);
  const zipFolders = useSelector(stagingSelectors.zipFolders);
  const zipFileStructure = useSelector(stagingSelectors.zipFileStructure);
  const isAttachingFile = useSelector(wpStep1Selectors.isAttachingFile);
  const inputs = useSelector(wpStep1Selectors.selectInputs);
  const checkingZipFile = useSelector(wpStep1Selectors.isCheckingZipFile);
  const hasZipValidationErrors = useSelector(stagingSelectors.hasZipValidationErrors);
  const [inputWarnings, setInputWarnings] = useState([]);
  const [hasXlsx, setHasXlsx] = useState(false);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const { workpaperId } = useParams();
  const { config } = useConfig(canvasType);
  const { options } = config.step1.zipUploadModal;
  const { t } = useTranslation();
  const checkZipFileStatus = useSelector(wpStep1Selectors.checkZipFileStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!file) {
      dispatch({
        type: StagingActionTypes.RESET,
      });
    }
  }, [file]);

  useEffect(() => {
    if (inputStatus) {
      dispatch(checkforZipfile(workpaperId));
    }
  }, [dispatch, inputStatus, workpaperId]);

  const { DropZone, HiddenInput, onClick, dragging } = useUploadDrop(
    fileData => {
      if (!fileData) {
        dispatch(
          addInputFileError({
            message: t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_FileType_Error'),
            type: Intent.ERROR,
          })
        );
      } else if (fileData.size < env.FILE_UPLOAD_MAX_BYTES) {
        setFile(fileData);
        dispatch(validateZipFile(fileData));
      } else {
        handleLargeFileWarning();
      }
    },
    DropZoneWrapper,
    ['zip']
  );

  const onBackClick = () => {
    setFile(null);
    onBack();
  };

  const onTreeItemClick = (id, folderPath) => {
    if (id) {
      setFolder(folderPath);
    }
  };

  const onPreviewClickHandler = (previewPath, fileName) => {
    if (previewPath && folder) {
      setFolder(fileName);
    }
  };

  useImperativeHandle(ref, () => ({
    submit() {
      if (file) {
        const isAppend = selectedValue === 'append';
        dispatch(
          uploadZipFile(workpaperId, file, zipFolders, zipFileStructure, isAppend, workpaperType, trifactaFlowId)
        );
        onClose();
      } else {
        dispatch(
          addInputFileError({
            message: t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_File_NotSelected'),
            type: Intent.ERROR,
          })
        );
      }
    },
  }));

  const inputStatusCheck = () => {
    const everyInput = inputs?.some(input => {
      return input.fileHistory?.length > 0;
    });
    setInputStatus(everyInput);
  };

  useEffect(() => {
    let warningDetails = checkForZipUploadWarnings(inputs, selectedValue, zipFolders, t);
    const fileXlsxWarning = checkForXLSXFilesOnZip(zipFileStructure, t);
    const duplicateFiles = checkForDuplicateFiles(zipFileStructure, t);

    if (fileXlsxWarning) {
      warningDetails =
        warningDetails && warningDetails.length > 0 ? [...warningDetails, fileXlsxWarning] : [fileXlsxWarning];
      setHasXlsx(true);
    } else {
      setHasXlsx(false);
    }

    if (duplicateFiles) {
      warningDetails =
        warningDetails && warningDetails.length > 0 ? [...warningDetails, duplicateFiles] : [duplicateFiles];
      setHasDuplicate(true);
    } else {
      setHasDuplicate(false);
    }

    if (warningDetails) {
      setInputWarnings(
        warningDetails?.map((warning, index) => {
          return {
            type: warning?.type,
            message: warning?.message,
            key: index,
          };
        })
      );
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      setInputWarnings(null);
    }
  }, [zipFolders, selectedValue, t]);

  useEffect(() => {
    const isError = inputWarnings?.some(input => input.type === 'error');
    onFolderChange(hasZipValidationErrors || isError);

    return () => {
      onFolderChange(false);
    };
  }, [inputWarnings, hasZipValidationErrors]);

  useEffect(() => {
    inputStatusCheck();
  }, [inputs]);

  const handleRemoveAlert = key => {
    const newAlerts = inputWarnings.filter(alert => alert.key !== key);
    setInputWarnings(newAlerts);
  };

  return (
    <Spinner spinning={checkingZipFile} overlayOpacity={1}>
      {inputWarnings && (checkZipFileStatus?.hasZipMeta || hasXlsx || hasDuplicate) && (
        <Box mb={10}>
          <AlertHub alerts={inputWarnings} onClose={handleRemoveAlert} />
        </Box>
      )}
      <Flex>
        <Text type={TextTypes.H2} theme={theme} fontWeight='s' mb={3} mr={2}>
          {t('Components_InputUploaderModal_Upload_ZIP')}:
        </Text>
        {!inputStatus ? (
          <Text type={TextTypes.H2} theme={theme} fontWeight='s' mb={3} color='gray'>
            {t('Components_InputUploaderModal_Upload_ZIP_SubHeader')}
          </Text>
        ) : (
          <Text type={TextTypes.H2} theme={theme} fontWeight='s' mb={3} color='gray'>
            {t('Components_InputUploaderModal_Upload_ZIP_Exist_SubHeader')}
          </Text>
        )}
      </Flex>
      {!inputStatus ? (
        <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
          {t('Components_InputUploaderModal_Upload_ZIP_desc')}
        </Text>
      ) : (
        <Box>
          {!checkZipFileStatus?.hasZipMeta ? (
            <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
              {t('Components_InputUploaderModal_Upload_ZIP_Exist_Desc')}
            </Text>
          ) : (
            <Box>
              <Text type={TextTypes.BODY} fontWeight='s' color='gray'>
                {t('Components_InputUploaderModal_Upload_ZIP_Exist_Options_Desc1')}
              </Text>
              <Text type={TextTypes.BODY} fontWeight='s' pt={5} color='gray'>
                {t('Components_InputUploaderModal_Upload_ZIP_Exist_Options_Desc2')}
              </Text>
              <Box my={8}>
                <RadioGroupObj
                  fontWeight='s'
                  name='modify'
                  options={options}
                  selectedValue={selectedValue}
                  onOptionChange={value => setSelectedValue(value)}
                  py={6}
                  borderColor='lightGray'
                  borderTop={1}
                  borderBottom={1}
                  dataInstance={`${COMPONENT_NAME}-modify`}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
      <Spinner spinning={isValidatingZipFile || isAttachingFile}>
        <Flex theme={theme} my={8} flexDirection='column'>
          {!zipFileContents && (
            <>
              <HiddenInput />
              <DropZoneStyle isDragged={dragging} onClick={onClick}>
                <DropZone>
                  <StateView icon={IconTypes.DRAG_DROP_UPLOAD} />
                </DropZone>
              </DropZoneStyle>
            </>
          )}
          {zipFileContents && (
            <Tree
              nodes={zipFileContents}
              onItemClick={onTreeItemClick}
              onPreviewClick={onPreviewClickHandler}
              defaultOpen
            />
          )}
        </Flex>
        <Text type={TextTypes.H4} fontWeight='m' color='blue4' mb={6}>
          {t('Components_InputUploaderModal_Upload_ZIP_Validation_Warning')}
        </Text>
        <Flex>
          <Icon type={IconTypes.NOTIFICATIONS_ERROR} width={16} color='yellow' mr={2} mb={6} />
          <Text type={TextTypes.BODY} fontWeight='s' color='gray' mb={3}>
            {t('Components_InputUploaderModal_Upload_ZIP_footer')}
          </Text>
        </Flex>
      </Spinner>
      <BackButton
        type={ButtonTypes.SECONDARY}
        icon={IconTypes.CHEVRON_LEFT}
        onClick={onBackClick}
        data-instance={`${COMPONENT_NAME}-Back`}
      >
        {t('Components_AddNewWorkpaperModal_Tertiary')}
      </BackButton>
    </Spinner>
  );
});

ZipFileUploader.propType = {
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
