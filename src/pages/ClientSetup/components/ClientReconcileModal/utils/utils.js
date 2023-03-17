import { TRANSLATION_KEY } from '../constants/constants';
import React from 'react';
import { Text, TextTypes } from 'cortex-look-book';

export const getTableHeaders = t => {
  return [
    {
      key: 'name',
      title: '',
      width: '20%',
      render: name => {
        return (
          <Text type={TextTypes.BODY} fontWeight='l'>
            {name}
          </Text>
        );
      },
    },
    {
      key: 'manual',
      title: t(`${TRANSLATION_KEY}_TableHeader2`),
      width: '40%',
      render: manual => {
        return manual();
      },
    },
    {
      key: 'mat',
      title: t(`${TRANSLATION_KEY}_TableHeader3`),
      width: '40%',
      render: mat => {
        return mat();
      },
    },
  ];
};

export const getEntityRepeatableOptions = t => {
  return [
    {
      id: null,
      name: t(`${TRANSLATION_KEY}_MatEntitySelectDefault`),
    },
  ];
};

export const getEngagementRepeatableOptions = t => {
  return [
    {
      id: null,
      name: t(`${TRANSLATION_KEY}_MatEngagementSelectDefault`),
    },
  ];
};
