import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PipelineList from './PipelineList';
import { getPipelineList } from '../../store/engagement/pipelines/actions';

export const COMPONENT_NAME = 'EngagementPipelines';
const EngagementPipelines = props => {
  const { searchValue } = props;
  const { engagementId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPipelineList(engagementId));
  }, [dispatch, engagementId]);

  return <PipelineList engagementId={engagementId} searchText={searchValue} dataInstance={COMPONENT_NAME} />;
};

export default EngagementPipelines;
