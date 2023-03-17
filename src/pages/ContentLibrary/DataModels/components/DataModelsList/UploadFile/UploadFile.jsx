import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Box, TextTypes, Spinner, Modal, ModalSizes, FileDropZone, AlertHub } from 'cortex-look-book';
import env from 'env';
import useTranslation from '../../../../../../hooks/useTranslation';
import { uploadExampleDatamodel } from '../../../../../../store/contentLibrary/datamodels/actions';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { convertBytes } from '../../../../../../utils/fileHelper';

const PAGE_NAME = 'CL_DATAMODELS_UPLOAD';

const UploadFile = ({ isUploadModalOpen, setIsUploadModalOpen, currentDatamodel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isUploadExample = useSelector(contentLibraryDMSelectors.isUploadExample);
  const uploadExapmleError = useSelector(contentLibraryDMSelectors.uploadExapmleError);

  const [files, setFiles] = useState();
  const [uploadAlerts, setUploadAlerts] = useState([]);
  const [disablePrimaryButton, setDisablePrimaryButton] = useState(true);

  useEffect(() => {
    if (files?.length) {
      setUploadAlerts(uploadExapmleError);
    }
  }, [uploadExapmleError]);

  const fileDropZoneChange = fileData => {
    if (fileData.length < 1) {
      const tempAlert = [...uploadAlerts];
      tempAlert.unshift({
        type: 'error',
        message: t(`Pages_Content_Library_DataModel_Error_Invalid_File_Type`),
        key: Date.now(),
      });
      setUploadAlerts(tempAlert);
    } else if (fileData.size > env.FILE_UPLOAD_MAX_BYTES) {
      const tempAlert = [...uploadAlerts];
      tempAlert.unshift({
        type: 'error',
        message: t('Pages_Content_Library_DataModel_Warning_LargeFileWarningModal_Description').replace(
          '{size}',
          `${convertBytes(env.FILE_UPLOAD_MAX_BYTES)}`
        ),
        key: Date.now(),
      });
      setUploadAlerts(tempAlert);
    } else if (fileData[0].size < env.FILE_UPLOAD_MAX_BYTES) {
      setFiles(fileData);
      setDisablePrimaryButton(false);
    }
  };

  const fileDropZoneSave = () => {
    if (files) {
      dispatch(uploadExampleDatamodel(files[0], currentDatamodel.id)).then(resp => {
        if (resp) {
          setIsUploadModalOpen(false);
        }
      });
    }
  };

  const onErrorClose = key => {
    const newAlerts = uploadAlerts.filter(alert => alert.key !== key);
    setUploadAlerts(newAlerts);
  };

  return (
    <Box pt={12}>
      {isUploadModalOpen && (
        <Modal
          dataInstance={`${PAGE_NAME}-UPLOAD-MODAL`}
          isOpen={isUploadModalOpen}
          size={ModalSizes.MEDIUM}
          disablePrimaryButton={disablePrimaryButton}
          primaryButtonText={t(`Pages_Content_Library_DataModel_Add_Guidance_Modal_Primary_Button`)}
          onPrimaryButtonClick={() => {
            fileDropZoneSave();
          }}
          secondaryButtonText={t(`Pages_Content_Library_DataModel_Add_Guidance_Modal_Secondary_Button`)}
          onSecondaryButtonClick={() => {
            setIsUploadModalOpen(false);
          }}
          onClose={() => {
            setIsUploadModalOpen(false);
          }}
        >
          <Spinner spinning={isUploadExample} dataInstance={`${PAGE_NAME}-Upload-Example_Spinner`}>
            <AlertHub alerts={uploadAlerts} onClose={onErrorClose} />

            <Text type={TextTypes.H2} fontWeight='m' dataInstance={`${PAGE_NAME}-Upload-Modal-Heading`}>
              {t(`Pages_Content_Library_DataModel_Upload_Modal_Header`)}
            </Text>
            <Box my={10}>
              <FileDropZone
                dataInstance={`${PAGE_NAME}-FileDropZone`}
                p={8}
                hint={t('Pages_Content_Library_DataModel_Upload_Modal_Hint').replace('fileFormat', 'CSV')}
                accept={['.csv']}
                files={files}
                onChange={fileDropZoneChange}
              />
            </Box>
          </Spinner>
        </Modal>
      )}
    </Box>
  );
};

export default UploadFile;
