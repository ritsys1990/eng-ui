import React, { useState, useEffect } from 'react';
import { AlertDialog, Box, Button, ButtonTypes, Flex, IconTypes, Intent, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants/constants';
import ClientReconcileModal from '../ClientReconcileModal/ClientReconcileModal';
import useTranslation from '../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientSetupStepStatus } from '../../../../store/client/actions';
import AddEntityModal from './AddEntityModal';
import AllEntitiesTable from './AllEntitiesTable';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { clientSelectors } from '../../../../store/client/selectors';
import ActiveEntitiesTable from './ActiveEntitiesTable';
import DeleteEntityModal from './DeleteEntityModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const Entities = () => {
  const { t } = useTranslation();
  const [activeEntities, setActiveEntities] = useState([]);
  const [otherEntities, setOtherEntities] = useState([]);

  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [areEntitiesReconciled, setAreEntitiesReconciled] = useState(false);
  const [shouldRenderReconcileModal, setShouldRenderReconcileModal] = useState(false);
  const [isAddEntityModalOpen, setIsAddEntityModalOpen] = useState(false);
  const [shouldRenderAddEntityModal, setShouldRenderAddEntityModal] = useState(false);
  const [isDeleteEntityModalOpen, setIsDeleteEntityModalOpen] = useState(false);
  const [shouldRenderDeleteEntityModal, setShouldRenderDeleteEntityModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isEditingEntity, setIsEditingEntity] = useState(false);

  const client = useSelector(clientSelectors.selectClient);
  const engagementList = useSelector(engagementSelectors.selectClientEngagementList);
  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const dispatch = useDispatch();

  useEffect(() => {
    setAreEntitiesReconciled(client?.entities?.every(entity => entity.matEntityId));
  }, [client]);

  useEffect(() => {
    const initialState = {};
    client?.entities?.forEach(entity => {
      initialState[entity.id] = [];
    });

    const activeMapping = engagementList.reduce((prev, current) => {
      const newValues = { ...prev };
      current?.entityIds?.forEach(eId => {
        if (newValues[eId]) {
          newValues[eId].push(current.name);
        } else {
          newValues[eId] = [current.name];
        }
      });

      return newValues;
    }, initialState);

    const active = client?.entities
      .filter(entity => activeMapping[entity.id].length > 0)
      .map(entity => ({
        ...entity,
        engagementNames: activeMapping[entity.id],
        canDelete: false,
        canEdit: permissions.entities.update && !entity.matEntityId,
      }));

    const other = client?.entities
      .filter(entity => activeMapping[entity.id].length === 0)
      .map(entity => ({
        ...entity,
        canDelete: permissions.entities.delete,
        canEdit: permissions.entities.update && !entity.matEntityId,
      }));

    setActiveEntities(active);
    setOtherEntities(other);
  }, [client, engagementList]);

  useEffect(() => {
    const isStepComplete = areEntitiesReconciled && client?.entities.length > 0;
    dispatch(updateClientSetupStepStatus(2, isStepComplete));
  }, [dispatch, areEntitiesReconciled, client]);

  const onReconcileClick = () => {
    setShouldRenderReconcileModal(true);
    setIsReconcileModalOpen(true);
  };

  const onReconcileModalClose = () => {
    setIsReconcileModalOpen(false);
  };

  const onReconcileModalRemovedFromDom = () => {
    setShouldRenderReconcileModal(false);
  };

  const onAddEntityClick = () => {
    setSelectedEntity(null);
    setIsEditingEntity(false);
    setShouldRenderAddEntityModal(true);
    setIsAddEntityModalOpen(true);
  };

  const onAddEntityModalClose = () => {
    setIsAddEntityModalOpen(false);
  };

  const onAddEntityModalRemovedFromDom = () => {
    setShouldRenderAddEntityModal(false);
  };

  const onDeleteEntityClick = entity => {
    setSelectedEntity(entity);
    setShouldRenderDeleteEntityModal(true);
    setIsDeleteEntityModalOpen(true);
  };

  const onDeleteEntityModalClose = () => {
    setIsDeleteEntityModalOpen(false);
  };

  const onDeleteEntityModalRemovedFromDom = () => {
    setShouldRenderDeleteEntityModal(false);
  };

  const onEditEntity = entity => {
    setSelectedEntity(entity);
    setIsEditingEntity(true);
    setShouldRenderAddEntityModal(true);
    setIsAddEntityModalOpen(true);
  };

  return (
    client && (
      <Box ml={14} dataInstance={`${COMPONENT_NAME}`}>
        {shouldRenderReconcileModal && (
          <ClientReconcileModal
            isModalOpen={isReconcileModalOpen}
            isEntityEditable={!areEntitiesReconciled}
            handleClose={onReconcileModalClose}
            dataInstance={COMPONENT_NAME}
            onRemoveFromDom={onReconcileModalRemovedFromDom}
          />
        )}
        {shouldRenderAddEntityModal && (
          <AddEntityModal
            isModalOpen={isAddEntityModalOpen}
            handleClose={onAddEntityModalClose}
            onRemoveFromDom={onAddEntityModalRemovedFromDom}
            dataInstance={COMPONENT_NAME}
            selectedEntity={selectedEntity}
            isEditing={isEditingEntity}
          />
        )}
        {shouldRenderDeleteEntityModal && (
          <DeleteEntityModal
            isModalOpen={isDeleteEntityModalOpen}
            handleClose={onDeleteEntityModalClose}
            onRemoveFromDom={onDeleteEntityModalRemovedFromDom}
            dataInstance={COMPONENT_NAME}
            entityId={selectedEntity && selectedEntity.id}
            clientId={client && client.id}
          />
        )}

        {!areEntitiesReconciled && (
          <AlertDialog
            type={Intent.INFO}
            title={t('Pages_Client_Setup_Step2_ReconcileTitle')}
            mb={8}
            dataInstance={COMPONENT_NAME}
          >
            <Text>
              {t('Pages_Client_Setup_Step2_ReconcileText')}
              <Button
                type={ButtonTypes.LINK}
                display='inline-block'
                ml={3}
                onClick={onReconcileClick}
                dataInstance={`${COMPONENT_NAME}-Reconcile`}
              >
                {t('Pages_Client_Setup_Step2_ReconcileButton')}
              </Button>
            </Text>
          </AlertDialog>
        )}
        <Text pb={8} type={TextTypes.BODY}>
          {t('Pages_Client_Setup_Step2_Entities_Desc_ListOfEntities')}
        </Text>
        <Text pb={8} type={TextTypes.BODY}>
          {t('Pages_Client_Setup_Step2_Entities_Desc_ReviewEntitiesList')}
        </Text>
        <Text pb={8} type={TextTypes.BODY}>
          {t('Pages_Client_Setup_Step2_Entities_Desc_NotRequired')}
        </Text>
        <Box mb={11}>
          <ActiveEntitiesTable entities={activeEntities || []} />
        </Box>
        <AllEntitiesTable
          entities={activeEntities?.concat(otherEntities) || []}
          onEditEntity={onEditEntity}
          onDeleteEntity={onDeleteEntityClick}
        />
        <Flex mt={5} justifyContent='space-between'>
          <Button
            type={ButtonTypes.LINK}
            icon={IconTypes.PLUS}
            iconWidth={20}
            onClick={onAddEntityClick}
            dataInstance={`${COMPONENT_NAME}-AddEntities`}
            disabled={!checkPermissions(permissions, Permissions.ENTITIES, Actions.ADD)}
          >
            <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step2_Add_Entities')}</Text>
          </Button>
          {client?.entities?.length && areEntitiesReconciled ? (
            <Button
              type={ButtonTypes.LINK}
              iconWidth={20}
              onClick={onReconcileClick}
              dataInstance={`${COMPONENT_NAME}-SeeDetails`}
            >
              <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step2_See_Detail')}</Text>
            </Button>
          ) : null}
        </Flex>
      </Box>
    )
  );
};
