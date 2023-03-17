import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkpaper } from '../../store/workpaperProcess/actions';
import { getCanvasType } from '../../utils/workpaperProcessHelper';
import { wpProcessSelectors } from '../../store/workpaperProcess/selectors';
import WorkPaperOutput from './WorkPaperOutput';

const WorkPaperOutputWrapper = props => {
  const { workpaperId, mainWorkpaperId, outputId } = useParams();
  const { match } = props;
  const dispatch = useDispatch();
  const wpData = useSelector(wpProcessSelectors.selectWorkPaper);
  const [canvasType, setCanvasType] = useState('');

  useEffect(() => {
    dispatch(getWorkpaper(match.params.workpaperId));
  }, [match.params.workpaperId, dispatch]);

  useEffect(() => {
    if (wpData) {
      setCanvasType(getCanvasType(wpData));
    }
  }, [wpData]);

  return canvasType ? (
    <WorkPaperOutput
      match={match}
      mainWorkpaperId={mainWorkpaperId}
      workpaperId={workpaperId}
      outputId={outputId}
      canvasType={canvasType}
    />
  ) : null;
};

export default React.memo(WorkPaperOutputWrapper);
