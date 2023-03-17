import React from 'react';
import { Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from '../constants/constants';

const TRANSLATION_KEY = 'Components_Child_Workpaper_FilterGrid_Headers';

export const getFilterHeaders = (t, deleteFilter) => {
  return [
    {
      key: 'tableName',
      title: t(`${TRANSLATION_KEY}_Table`),
      render: (_, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row?.tableName}</Text>
          </Flex>
        );
      },
    },
    {
      key: 'columnName',
      title: t(`${TRANSLATION_KEY}_Column`),
      render: (_, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>
              {row?.hasFilter ? row?.columnName : t(`${TRANSLATION_KEY}_No_Filter_Applied`)}
            </Text>
          </Flex>
        );
      },
    },
    {
      key: 'filterValue',
      title: t(`${TRANSLATION_KEY}_Filter`),
      render: (_, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>
              {row?.hasFilter ? row?.filterValue : t(`${TRANSLATION_KEY}_No_Filter_Applied`)}
            </Text>
          </Flex>
        );
      },
    },
    {
      key: 'id',
      render: (_, row) => (
        <Flex justifyContent='flex-end' cursor='pointer'>
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            onClick={() => {
              deleteFilter(row?.id);
            }}
            icon={IconTypes.DELETE}
            iconWidth={18}
            dataInstance={`${COMPONENT_NAME}_Delete`}
          />
        </Flex>
      ),
    },
  ];
};
export const sortDataByTableName = (a, b) => {
  const nameA = a.tableName.toUpperCase();
  const nameB = b.tableName.toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  }

  return 0;
};
