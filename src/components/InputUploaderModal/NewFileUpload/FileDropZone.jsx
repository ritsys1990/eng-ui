import React from 'react';
import { StateView, IconTypes } from 'cortex-look-book';
import { useUploadDrop } from '../../../hooks/useUploadDrop';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import { DropZoneStyle, DropZoneWrapper } from '../StyledFileUpload';
import useTranslation from 'src/hooks/useTranslation';
import { NOTEBOOK_WP_ALLOWED_FILE_TYPES } from './constants';

export const FileDropZone = ({ workpaperType, onUpload }) => {
  const { t } = useTranslation();
  const isNotebookWP = workpaperType === WORKPAPER_TYPES.NOTEBOOK;
  let allowedTypes;
  if (isNotebookWP) {
    allowedTypes = NOTEBOOK_WP_ALLOWED_FILE_TYPES;
  }
  const { DropZone, HiddenInput, onClick, dragging } = useUploadDrop(onUpload, DropZoneWrapper, allowedTypes);

  return (
    <>
      <HiddenInput />
      <DropZoneStyle isDragged={dragging} onClick={onClick}>
        <DropZone>
          <StateView
            icon={IconTypes.DRAG_DROP_UPLOAD}
            message={
              isNotebookWP
                ? t('pages-notebook-attach-new-file-upload-message')
                : t('Pages_EngagementWorkpapers_AttachSourceModal_NewFile_UploadMessage')
            }
          />
        </DropZone>
      </DropZoneStyle>
    </>
  );
};
