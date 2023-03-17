import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Box, TextTypes, Spinner, FileDropZone, AlertHub } from 'cortex-look-book';
import env from 'env';
import useTranslation from '../../../../../../hooks/useTranslation';
import { uploadDataModels } from '../../../../../../store/contentLibrary/datamodels/actions';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { convertBytes } from '../../../../../../utils/fileHelper';

const PAGE_NAME = 'CL_DATAMODELS_UPLOAD';

const UploadDataModel = forwardRef((props, ref) => {
  const { handleClose } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isUploadDM = useSelector(contentLibraryDMSelectors.isUploadDM);
  const uploadDMError = useSelector(contentLibraryDMSelectors.uploadDMError);

  const [files, setFiles] = useState();
  const [uploadAlerts, setUploadAlerts] = useState([]);

  useEffect(() => {
    if (files?.length) {
      setUploadAlerts(uploadDMError);
    }
  }, [uploadDMError]);

  const fileDropZoneChange = fileData => {
    if (fileData.length < 1) {
      const tempAlert = [...uploadAlerts];
      tempAlert.unshift({
        type: 'error',
        message: t(`Pages_Content_Library_Upload_DataModel_Error_Invalid_File_Type`),
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
    }
  };

  const fileDropZoneSave = () => {
    if (files) {
      dispatch(uploadDataModels(files[0])).then(resp => {
        if (resp) {
          handleClose();
        }
      });
    }
  };

  useImperativeHandle(ref, () => ({
    submit() {
      fileDropZoneSave();
    },
  }));

  const onErrorClose = key => {
    const newAlerts = uploadAlerts.filter(alert => alert.key !== key);
    setUploadAlerts(newAlerts);
  };

  return (
    <>
      <Spinner spinning={isUploadDM} dataInstance={`${PAGE_NAME}-Upload-Data-Model`}>
        <br />
        <AlertHub alerts={uploadAlerts} onClose={onErrorClose} dataInstance={`${PAGE_NAME}-Upload-Modal-AlertHub`} />
        <Text type={TextTypes.H2} fontWeight='m' dataInstance={`${PAGE_NAME}-Upload-Modal-Heading`}>
          {t(`Pages_Content_Library_DataModel_Upload_Data_Modal_Header`)}
        </Text>
        <Box my={10}>
          <FileDropZone
            cursor='pointer'
            dataInstance={`${PAGE_NAME}-FileDropZone`}
            p={8}
            hint={t('Pages_Content_Library_DataModel_Upload_Modal_Hint').replace('fileFormat', 'JSON')}
            accept={['.json']}
            files={files}
            onChange={fileDropZoneChange}
          />
        </Box>
      </Spinner>
    </>
  );
});

export default UploadDataModel;
