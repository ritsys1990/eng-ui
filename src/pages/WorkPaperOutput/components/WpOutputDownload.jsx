import React from 'react';
import { Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import { downloadOutputAsCSV, saveOutputAsCSV } from '../../../store/workpaperProcess/step3/actions';
import { PAGE_NAME } from '../constants/WorkPaperOutput.constants';
import { WORKPAPER_TYPES } from '../../../utils/WorkpaperTypes.const';
import useTranslation from 'src/hooks/useTranslation';
import { useFileSystem } from 'src/hooks/useFileSystem';

const RUNNING_REFRESH_INTERVAL = 3 * 1000;

const WpOutputDownload = props => {
  const { filename, workpaperType, outputId, workpaper, showDownloadRestrictWarning } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { downloadWorkpaperOutputs } = useFileSystem('', RUNNING_REFRESH_INTERVAL);

  const handleSaveAsCsv = () => {
    if (workpaper.engagementId && workpaper.isRestrictFileDownload) {
      showDownloadRestrictWarning();
    } else {
      if (workpaperType === WORKPAPER_TYPES.TRIFACTA) {
        dispatch(downloadOutputAsCSV(filename, outputId));
      }
      if (workpaperType === WORKPAPER_TYPES.CORTEX) {
        dispatch(saveOutputAsCSV(outputId));
      }
      if (workpaperType === WORKPAPER_TYPES.NOTEBOOK) {
        downloadWorkpaperOutputs(workpaper.id, outputId, filename);
      }
    }
  };

  return (
    <Button
      type={ButtonTypes.LINK}
      iconWidth={20}
      icon={IconTypes.UPLOAD}
      mr={20}
      onClick={handleSaveAsCsv}
      dataInstance={`${PAGE_NAME}-SaveCSV`}
    >
      {t('Pages_WorkpaperProcess_Output_SaveAsCSV')}
    </Button>
  );
};

export default WpOutputDownload;
