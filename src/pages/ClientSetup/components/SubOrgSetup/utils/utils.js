import React from 'react';
import { Button, ButtonTypes, Flex, IconTypes, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME, ContextMenuOptions } from '../constants/constants';
import LocalizedDate from '../../../../../components/LocalizedDate/LocalizedDate';
import { Actions, checkPermissions, Permissions } from '../../../../../utils/permissionsHelper';
import { isLegacyMode } from '../../../../../utils/legacyUtils';

export const getErrors = (t, FormErrorModel, subOrgName, entityRows, orgName) => {
  const errors = { ...FormErrorModel };

  if (orgName === '') {
    errors.orgName = t('Pages_Client_Setup_Step1_Link_To_Org_Error');
  }

  if (subOrgName === '') {
    errors.subOrgName = t('Pages_Client_Setup_Step1_Sub_Org_Name_Error');
  }

  if (entityRows.length < 1) {
    errors.entityRows = t('Pages_Client_Setup_Step1_Entity_Error');
  }

  return errors;
};

export const getOrgHeaders = (t, permissions, deleteOrg, copyOrg) => {
  return [
    {
      key: 'orgName',
      title: t('Pages_Client_Setup_Step4_Org_Name_Title'),
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.name}</Text>,
    },
    {
      key: 'orgUUID',
      title: t('Pages_Client_Setup_Step4_Org_UUID_Title'),
      render: (name, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row?.orgUUID}</Text>
            {row?.orgId && (
              <Button
                p={0}
                type={ButtonTypes.FLAT}
                onClick={() => {
                  copyOrg(row.orgUUID);
                }}
                icon={IconTypes.COPY}
                iconWidth={18}
                dataInstance={`${COMPONENT_NAME}_Copy`}
              />
            )}
          </Flex>
        );
      },
    },
    {
      key: 'orgId',
      title: t('Pages_Client_Setup_Step4_Org_Id_Title'),
      render: (name, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row?.orgId}</Text>
          </Flex>
        );
      },
    },
    {
      key: '',
      title: '',
      render: (name, row) => {
        return (
          !isLegacyMode &&
          checkPermissions(permissions, Permissions.ORGS, Actions.DELETE) &&
          row.orgId && (
            <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
              <Button
                p={2}
                type={ButtonTypes.FLAT}
                onClick={() => {
                  deleteOrg();
                }}
                icon={IconTypes.DELETE}
                iconWidth={18}
                dataInstance={`${COMPONENT_NAME}_Delete`}
              />
            </Flex>
          )
        );
      },
    },
  ];
};

export const getOrgRows = orgDetails => {
  return orgDetails?.orgId
    ? [
        {
          orgId: orgDetails?.orgId,
          name: orgDetails?.name,
          orgUUID: orgDetails?.orgUUID,
        },
      ]
    : [];
};

export const checkEntitiesSubOrg = (entities, editingId) => {
  return entities?.filter(entity => entity.subOrgId === editingId).map(entity => entity.id);
};

export const getSubOrgHeaders = (
  t,
  entities,
  generateSubOrgToken,
  copySubOrg,
  onContextButtonClick,
  copyToken,
  orgId
) => {
  return [
    {
      key: 'subOrgName',
      title: t('Pages_Client_Setup_Step4_Sub_Org_Label'),
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.name}</Text>,
    },
    {
      key: 'subOrgUUID',
      title: t('Pages_Client_Setup_Step4_Suborg_UUID_Title'),
      render: (name, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row?.orgUUID}</Text>
            {row?.orgUUID && (
              <Button
                p={0}
                type={ButtonTypes.FLAT}
                onClick={() => {
                  copySubOrg(row.orgUUID);
                }}
                icon={IconTypes.COPY}
                iconWidth={18}
                dataInstance={`${COMPONENT_NAME}_Copy`}
              />
            )}
          </Flex>
        );
      },
    },
    {
      key: 'subOrgId',
      title: t('Pages_Client_Setup_Step4_Suborg_ID_Title'),
      render: (id, row) => {
        return (
          <Flex alignContent='center'>
            <Text type={TextTypes.BODY}>{row?.id}</Text>
          </Flex>
        );
      },
    },
    {
      key: 'entities',
      title: t('Pages_Client_Setup_Step4_Entities_Title'),
      render: (id, row) => {
        const entitiesLength = checkEntitiesSubOrg(entities, row?.id).length;

        return (
          <Flex alignContent='center' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
            <Text type={TextTypes.BODY}>{entitiesLength || 0}</Text>
          </Flex>
        );
      },
    },
    {
      key: 'serviceAccount',
      title: t('Pages_Client_Setup_Step4_Service_Account_Title'),
      render: (id, row) => {
        return (
          <Flex alignContent='center' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
            {row.installToken ? (
              <Text type={TextTypes.BODY}>{row.installToken.userName}</Text>
            ) : (
              <Text type={TextTypes.BODY}>-</Text>
            )}
          </Flex>
        );
      },
    },
    {
      key: 'token',
      title: t('Pages_Client_Setup_Step4_Generate_Token_Title'),
      render: (id, row) => {
        return (
          <Flex alignContent='center' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
            {row.installToken ? (
              <Flex alignContent='center'>
                <Text>{t('Pages_Client_Setup_Step4_Suborg_Token_Hidden')}</Text>
                <Button
                  p={0}
                  type={ButtonTypes.FLAT}
                  onClick={() => {
                    copyToken(row.installToken.result);
                  }}
                  icon={IconTypes.COPY}
                  iconWidth={18}
                  dataInstance={`${COMPONENT_NAME}_Copy`}
                />
              </Flex>
            ) : (
              <Button
                p={0}
                type={ButtonTypes.LINK}
                onClick={() => {
                  generateSubOrgToken(row.id, orgId);
                }}
                dataInstance={`${COMPONENT_NAME}_Generate_Token`}
              >
                {t('Pages_Client_Setup_Step4_Suborg_Generate_Token')}
              </Button>
            )}
          </Flex>
        );
      },
    },
    {
      key: 'lastGenerated',
      title: t('Pages_Client_Setup_Step4_Last_Generated_Title'),
      render: (id, row) => {
        return (
          <Flex alignContent='center' dataInstance={`${COMPONENT_NAME}-${row.id}`}>
            {row.installToken ? (
              <LocalizedDate date={row.installToken.installTokenUpdateTime} isTimeStamp />
            ) : (
              <Text type={TextTypes.BODY}>-</Text>
            )}
          </Flex>
        );
      },
    },
    {
      key: 'id',
      render: (id, row) => (
        <Flex justifyContent='flex-end' cursor='pointer' dataInstance={`${COMPONENT_NAME}-context}`}>
          <Button
            p={2}
            type={ButtonTypes.FLAT}
            icon={IconTypes.ELLIPSIS_Y}
            iconWidth={18}
            dataInstance={`${COMPONENT_NAME}-Context`}
            onClick={e => {
              onContextButtonClick(e, row);
            }}
          />
        </Flex>
      ),
    },
  ];
};

export const getAgentHeaders = t => {
  return [
    {
      key: 'subOrg',
      title: 'Sub Org',
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.subOrg?.name}</Text>,
    },
    {
      key: 'name',
      title: 'Name',
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.name}</Text>,
    },
    {
      key: 'id',
      title: 'Id',
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.id}</Text>,
    },
    {
      key: 'version',
      title: 'Version',
      render: (name, row) => (
        <Text type={TextTypes.BODY}>
          {row?.agentVersion} ({row?.platform})
        </Text>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (name, row) => (
        <Text type={TextTypes.BODY}>
          {row?.active
            ? t('Pages_Client_Setup_Step4_Secure_Agent_Active')
            : t('Pages_Client_Setup_Step4_Secure_Agent_Not_Active')}
          ,{' '}
          {row?.readyToRun
            ? t('Pages_Client_Setup_Step4_Secure_Agent_Ready_To_Run')
            : t('Pages_Client_Setup_Step4_Secure_Agent_Not_Ready_To_Run')}
        </Text>
      ),
    },
    {
      key: 'updateStatus',
      title: 'Update status',
      render: (name, row) => <Text type={TextTypes.BODY}>{row?.upgradeStatus}</Text>,
    },
  ];
};

export const getSubOrgContextMenuOptions = (t, row, permissions) => {
  const options = [];

  if (checkPermissions(permissions, Permissions.SUBORGS, Actions.UPDATE)) {
    options.push({
      id: ContextMenuOptions.EDIT,
      text: t('Pages_Client_Setup_Step4_Entity_Edit'),
    });
  }

  if (row?.installToken) {
    options.push({
      id: ContextMenuOptions.REGENERATE,
      text: t('Pages_Client_Setup_Step4_Entity_Regenerate'),
    });
  }

  if (!isLegacyMode && checkPermissions(permissions, Permissions.SUBORGS, Actions.DELETE)) {
    options.push({
      id: ContextMenuOptions.DELETE,
      text: t('Pages_Client_Setup_Step4_Entity_Delete'),
    });
  }

  return options;
};
