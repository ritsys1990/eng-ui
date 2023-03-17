import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkpaper } from '../../store/workpaperProcess/actions';
import EngagementCanvas from '../EngagementCanvas/EngagementCanvas';
import TrifactaCanvas from '../TrifactaCanvas/TrifactaCanvas';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import { WORKPAPER_CANVAS_TYPES } from '../../utils/WorkpaperTypes.const';
import { getCanvasType } from 'src/utils/workpaperProcessHelper';
import { resetWPProcessingErrors } from '../../store/errors/actions';
import NotebooksCanvas from '../NotebooksCanvas/NotebooksCanvas';

const WorkPaperType = ({ match }) => {
  const dispatch = useDispatch();
  const workpaper = useSelector(wpProcessSelectors.selectWorkPaper);

  useEffect(() => {
    dispatch(getWorkpaper(match.params.workpaperId));
    dispatch(resetWPProcessingErrors({ workpaperId: match.params.workpaperId }));

    return () => {
      dispatch(resetWPProcessingErrors({ workpaperId: match.params.workpaperId }));
    };
  }, [match.params.workpaperId, dispatch]);

  const renderWorkpaper = () => {
    if (workpaper && match.params.workpaperId === workpaper?.id) {
      const canvasType = getCanvasType(workpaper);
      if (canvasType === WORKPAPER_CANVAS_TYPES.CORTEX_ENGAGEMENT_WIZARD) {
        return <EngagementCanvas match={match} workpaperType={workpaper.workpaperSource} canvasType={canvasType} />;
      } else if (canvasType === WORKPAPER_CANVAS_TYPES.NOTEBOOKS_CANVAS) {
        return <NotebooksCanvas match={match} workpaperType={workpaper.workpaperSource} canvasType={canvasType} />;
      }

      return <TrifactaCanvas match={match} workpaperType={workpaper.workpaperSource} canvasType={canvasType} />;
    }

    return null;
  };

  return <>{renderWorkpaper()}</>;
};

export default WorkPaperType;
