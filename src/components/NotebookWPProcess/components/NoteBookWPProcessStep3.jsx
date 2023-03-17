import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner, Box, Text, TextTypes } from 'cortex-look-book';
import RenderLists from '../../WorkPaperProcess/components/RenderLists';
import useTranslation from '../../../hooks/useTranslation';
import { WORKPAPER_CANVAS_TYPES } from '../../../utils/WorkpaperTypes.const';
import { getNotebookWPOutputs, getWorkbooks } from '../../../store/notebookWorkpaperProcess/step3/actions';
import { wpProcessSelectors } from '../../../store/workpaperProcess/selectors';
import { notebookWPStep3Selector } from '../../../store/notebookWorkpaperProcess/step3/selectors';

const NoteBookWPProcessStep3 = ({ workpaperId, showSimplePopUp, closeSimplePopup }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const loading = useSelector(notebookWPStep3Selector.selectLoading);
  const outputs = useSelector(notebookWPStep3Selector.selectOutputs(workpaperId));
  const isDownloadingAllOutputs = useSelector(wpProcessSelectors.isDownloadingAllOutputs);
  const isFetchingWorkbooks = useSelector(notebookWPStep3Selector.selectIsFetchingWorkbooks);

  const isOutputWithData = outputs?.dataTable?.length > 0 || outputs?.dqc?.length > 0 || outputs?.tableau?.length > 0;

  useEffect(() => {
    dispatch(getNotebookWPOutputs(workpaperId));
    dispatch(getWorkbooks(workpaperId));
  }, [dispatch, workpaperId]);

  const isLoading = () => {
    return loading || isFetchingWorkbooks || isDownloadingAllOutputs;
  };

  return (
    <Spinner minHeight={200} spinning={isLoading()} label={t('Components_AddPipelineModal_Step3_SpinnerLoading')}>
      <Box pl={90}>
        {outputs && isOutputWithData && (
          <>
            <>
              <Text fontSize={16} color='black' fontWeight='bold' mr={4} mb={6} mt={10}>
                {t('Pages_WorkpaperProcess_Step3_WorkpaperOutputs')}
              </Text>
              <Text type={TextTypes.BODY} color='gray' mr={4} mb={10}>
                {t('Pages_WorkpaperProcess_Step3_WorkpaperOutputsDescription')}
              </Text>
            </>
            <RenderLists
              canvasType={WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS}
              workpaperId={workpaperId}
              isCentralizedDSUpdated={false}
              showSimplePopUp={showSimplePopUp}
              closeSimplePopup={closeSimplePopup}
              showTableauAlert
            />
          </>
        )}
      </Box>
    </Spinner>
  );
};

export default NoteBookWPProcessStep3;
