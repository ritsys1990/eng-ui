import React from 'react';
import { Box, Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import {
  TRANSLATION_KEY_ALL_ENTITIES,
  TRANSLATION_KEY_ACTIVE_ENTITIES,
  ContextMenuOptions,
} from '../constants/constants';

const renderNameHeader = name => {
  return (
    <Flex alignContent='center'>
      <Text type={TextTypes.BODY}>{name}</Text>
    </Flex>
  );
};

const renderMatEntityIdHeader = matEntityId => {
  return (
    <Flex alignContent='center'>
      <Text type={TextTypes.BODY}>{matEntityId || '—'}</Text>
    </Flex>
  );
};

export const getAllEntitiesTableHeaders = (t, onContextButtonClick) => {
  return [
    {
      key: 'name',
      title: t(`${TRANSLATION_KEY_ALL_ENTITIES}_TableHeader1`),
      render: renderNameHeader,
    },
    {
      key: 'matEntityId',
      title: t(`${TRANSLATION_KEY_ALL_ENTITIES}_TableHeader2`),
      render: renderMatEntityIdHeader,
    },
    {
      key: 'id',
      render: (id, row) =>
        (row.canDelete || row.canEdit) && (
          <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${TRANSLATION_KEY_ALL_ENTITIES}-${row.id}`}>
            <Button
              p={2}
              type={ButtonTypes.FLAT}
              icon={IconTypes.ELLIPSIS_Y}
              iconWidth={18}
              dataInstance={`${TRANSLATION_KEY_ALL_ENTITIES}-Context`}
              onClick={e => {
                onContextButtonClick(e, row);
              }}
            />
          </Flex>
        ),
    },
  ];
};

export const getActiveEntitiesTableHeaders = t => {
  return [
    {
      key: 'name',
      title: t(`${TRANSLATION_KEY_ACTIVE_ENTITIES}_TableHeader1`),
      render: renderNameHeader,
    },
    {
      key: 'matEntityId',
      title: t(`${TRANSLATION_KEY_ACTIVE_ENTITIES}_TableHeader2`),
      render: renderMatEntityIdHeader,
    },
    {
      key: 'engagementNames',
      title: t(`${TRANSLATION_KEY_ACTIVE_ENTITIES}_TableHeader3`),
      render: engagementNames => (
        <Box>
          {engagementNames.length > 0 ? (
            engagementNames.map((name, index) => (
              <Text key={`${name}-${index}`} type={TextTypes.BODY} mb={index === engagementNames.length - 1 ? 0 : 3}>
                {name}
              </Text>
            ))
          ) : (
            <Text type={TextTypes.BODY}>—</Text>
          )}
        </Box>
      ),
    },
  ];
};

export const getAllEntitiesContextMenuOptions = (t, entity) => {
  const options = [];
  if (entity && entity.canEdit) {
    options.push({
      id: ContextMenuOptions.EDIT,
      text: t(`${TRANSLATION_KEY_ALL_ENTITIES}_ContextMenu_Option1`),
    });
  }

  if (entity && entity.canDelete) {
    options.push({
      id: ContextMenuOptions.DELETE,
      text: t(`${TRANSLATION_KEY_ALL_ENTITIES}_ContextMenu_Option2`),
    });
  }

  return options;
};
