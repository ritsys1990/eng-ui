export const COMPONENT_NAME = 'InputUploaderModal';

export const getInputHeaderSelectionOptions = t => {
  return [
    {
      value: true,
      text: t('Components_FileUploader_FirstRowHeader_Option'),
    },
    {
      value: false,
      text: t('Components_FileUploader_AutoInferHeader_Option'),
    },
  ];
};

export const INPUT_UPLOADER_TYPES = {
  UPLOAD: 'upload',
  SELECT: 'select',
  DATA_REQUEST: 'create data request',
  DATA_MODEL: 'add datamodel',
  ZIP: 'zip',
  CONNECT_DATA_REQUEST: 'connect data request',
};

export const INPUT_UPLOADER_TYPE_VALUES = {
  [INPUT_UPLOADER_TYPES.UPLOAD]: 'Upload',
  [INPUT_UPLOADER_TYPES.SELECT]: 'Select',
  [INPUT_UPLOADER_TYPES.DATA_REQUEST]: 'CreateDataRequest',
  [INPUT_UPLOADER_TYPES.DATA_MODEL]: 'AddDatamodel',
  [INPUT_UPLOADER_TYPES.ZIP]: 'Zip',
  [INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST]: 'ConnectDataRequest',
};

export const INPUT_UPLOADER_TYPE_PAGES = {
  [INPUT_UPLOADER_TYPES.UPLOAD]: 1,
  [INPUT_UPLOADER_TYPES.SELECT]: 2,
  [INPUT_UPLOADER_TYPES.DATA_MODEL]: 2,
  [INPUT_UPLOADER_TYPES.ZIP]: 3,
  [INPUT_UPLOADER_TYPES.CONNECT_DATA_REQUEST]: 4,
};
