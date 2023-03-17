import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AlertHub,
  Modal,
  ModalSizes,
  StateView,
  IconTypes,
  Text,
  TextTypes,
  Flex,
  Spinner,
  Icon,
  Intent,
  useInterval,
} from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';

import { DropZoneStyle, DropZoneWrapper } from '../../../InputUploaderModal/StyledFileUpload';

import { useUploadDrop } from '../../../../hooks/useUploadDrop';
import { importFlow, getWorkpaperSetup } from '../../../../store/workpaperProcess/step2/actions';
import { getWorkpaper } from '../../../../store/workpaperProcess/actions';
import { Header } from '../../../InputUploaderModal/components/Header/Header';
import { WPProcessingSelectors } from '../../../../store/workpaperProcess/step2/selectors';
import { errorsSelectors } from '../../../../store/errors/selectors';
import { addImportFlowError, deleteImportFlowError, deleteImportFlowEachError } from '../../../../store/errors/actions';

import { getWPStep1Details } from '../../../../store/workpaperProcess/step1/actions';

import { COMPONENT_NAME, FLOW_IMPORT_STATUS } from '../../constants/WorkPaperProcess.const';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import { getFlowDetails } from '../../../../store/dataWrangler/actions';

const REFRESH_INTERVAL = 5000; // 5 seconds

// eslint-disable-next-line sonarjs/cognitive-complexity
const ImportFlowsModal = forwardRef((props, ref) => {
  const { isOpen, handleClose, workpaperId, trifactaFlowId, canvasType, showImportErrors } = props;
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [fileData, setFileData] = useState(null);
  const [isDMTFailure, setIsDMTFailure] = useState(false);

  const importProgress = useSelector(WPProcessingSelectors.importProgress);
  const importFlowInitiatePolling = useSelector(WPProcessingSelectors.importFlowInitiatePolling);
  const selectImportFlowErrors = useSelector(errorsSelectors.selectImportFlowErrors);

  const { DropZone, HiddenInput, onClick, dragging } = useUploadDrop(
    uploadedFileData => {
      if (uploadedFileData) {
        setFileData(uploadedFileData);
      } else {
        dispatch(
          addImportFlowError({
            message: t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_FileType_Error'),
            type: Intent.ERROR,
          })
        );
      }
    },
    DropZoneWrapper,
    ['zip']
  );

  const closeAllErrors = () => {
    dispatch(deleteImportFlowError());
  };

  const closeModal = () => {
    setFileData(null);
    closeAllErrors();
    handleClose();
  };

  const handleSubmit = () => {
    if (fileData) {
      dispatch(importFlow(workpaperId, trifactaFlowId, fileData, canvasType)).then(result => {
        if (result?.length > 0 && result[0]?.message) {
          setIsDMTFailure(true);
          const errorMessages = [];
          result.map(val => {
            if (val.message) {
              errorMessages.push(val.message);
            }

            return val;
          });
          closeModal();
          showImportErrors(errorMessages);
        } else if (result && result.flows.length > 0) {
          dispatch(getFlowDetails(workpaperId, result.flows[0].id));
        }
      });
    } else {
      setIsDMTFailure(false);
      dispatch(
        addImportFlowError({
          message: t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_File_NotSelected'),
          type: Intent.ERROR,
        })
      );
    }
  };

  useInterval(() => {
    if (importProgress === FLOW_IMPORT_STATUS.PENDING && importFlowInitiatePolling) {
      dispatch(getWorkpaperSetup(workpaperId)).then(result => {
        if (result?.importStatus === FLOW_IMPORT_STATUS.COMPLETED) {
          dispatch(getWorkpaper(workpaperId));
        }
      });
    }
  }, REFRESH_INTERVAL);

  useEffect(() => {
    if (
      !isDMTFailure &&
      (importProgress === FLOW_IMPORT_STATUS.FAILED || importProgress === FLOW_IMPORT_STATUS.ERROR)
    ) {
      dispatch(
        addImportFlowError({
          message: t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_Error'),
          type: Intent.ERROR,
        })
      );
    }
    if (importProgress === FLOW_IMPORT_STATUS.COMPLETED) {
      dispatch(getWPStep1Details(workpaperId));
      closeModal();
    }
  }, [dispatch, importProgress]);

  const onErrorClose = errorKey => {
    dispatch(deleteImportFlowEachError(errorKey));
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={closeModal}
      primaryButtonText={t('Import', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.LARGE}
      disablePrimaryButton={importProgress === FLOW_IMPORT_STATUS.PENDING}
      dataInstance={`${COMPONENT_NAME}-ImportFlowModal`}
    >
      <Header
        titleText={t('Pages_WorkpaperProcess_Step2_Import_Data_Flow')}
        noteText={t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_SubHeader')}
      />
      <AlertHub
        alerts={selectImportFlowErrors}
        type='error'
        onClose={onErrorClose}
        dataInstance={`${COMPONENT_NAME}-ImportFlowModal-Error`}
      />

      {!fileData ? (
        <Flex justifyContent='center' mb='4' mt='4'>
          <HiddenInput />
          <DropZoneStyle isDragged={dragging} onClick={onClick}>
            <DropZone>
              <StateView icon={IconTypes.DRAG_DROP_UPLOAD} />
            </DropZone>
          </DropZoneStyle>{' '}
        </Flex>
      ) : (
        <Flex justifyContent='center' mb='4' mt='4'>
          <Spinner
            spinning={importProgress === FLOW_IMPORT_STATUS.PENDING}
            label={t('Pages_WorkpaperProcess_Step2_Import_Data_Flow_Label')}
          >
            <Flex>
              <Icon type={IconTypes.DOCUMENT} size={25} ml={2} />

              <Text type={TextTypes.H2} fontWeight='s'>
                {fileData?.name}
              </Text>
            </Flex>
          </Spinner>
        </Flex>
      )}
    </Modal>
  );
});

export default ImportFlowsModal;

ImportFlowsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  showImportErrors: PropTypes.func.isRequired,
};
