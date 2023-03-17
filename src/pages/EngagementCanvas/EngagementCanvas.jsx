import React from 'react';
import WorkPaperProcess from '../WorkPaperProcess/WorkPaperProcess';

const EngagementCanvas = ({ match, canvasType }) => {
  return <WorkPaperProcess match={match} canvasType={canvasType} />;
};

export default EngagementCanvas;
