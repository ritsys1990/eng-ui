import React, { useEffect, useState } from 'react';
import { getDMTDetails } from '../../../../store/engagement/actions';
import { Link, Text } from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import env from 'env';
import { COMPONENT_NAME } from './constants';

const WorkpaperNameLink = props => {
  const { workpaperId, workpaperName, templateId } = props;

  const [wpLink, setWpLink] = useState(window.location.pathname);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDMTDetails(workpaperId)).then(inputs => {
      if ((inputs && !inputs.every(input => input.datamodelId === null)) || !templateId) {
        setWpLink(`${env.ANALYTICSUI_URL}/workpapers/${workpaperId}/data`);
      } else {
        setWpLink(`/workpapers/${workpaperId}`);
      }
    });
  });

  return (
    <Link m={3} to={wpLink} width='100%' dataInstance={COMPONENT_NAME}>
      <Text ellipsis>{workpaperName}</Text>
    </Link>
  );
};

export default WorkpaperNameLink;
