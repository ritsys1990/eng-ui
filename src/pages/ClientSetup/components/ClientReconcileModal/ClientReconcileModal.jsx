import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table, Text, TextTypes, Box, Flex, AlertHub, Spinner, ModalSizes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { clientSelectors } from '../../../../store/client/selectors';
import { COMPONENT_NAME, TRANSLATION_KEY, DefaultMemberFirmCode, EngagementSourceState } from './constants/constants';
import { getEngagementRepeatableOptions, getEntityRepeatableOptions, getTableHeaders } from './utils/utils';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import {
  getMatClient,
  getMatClientEntities,
  resetMatClientDetails,
  saveClient,
} from '../../../../store/client/actions';
import {
  getEngagementsByClient,
  getMatClientEngagements,
  reconcileEngagements,
} from '../../../../store/engagement/actions';
import ClientSelect from '../../../../components/ClientSelect/ClientSelect';
import ReconcileSelect from './ReconcileSelect';
import { securitySelectors } from '../../../../store/security/selectors';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { errorsSelectors } from '../../../../store/errors/selectors';
import {
  addReconcileClientError,
  deleteReconcileClientError,
  resetReconcileClientErrors,
} from '../../../../store/errors/actions';
import useTranslation from '../../../../hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
const ClientReconcileModal = props => {
  const { isModalOpen, handleClose, isClientEditable, isEntityEditable, isEngagementEditable, onRemoveFromDom } = props;

  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [matClientOptions, setMatClientOptions] = useState([]);
  const [matEntitiesMapping, setMatEntitiesMapping] = useState({});
  const [matEngagementsMapping, setMatEngagementsMapping] = useState({});
  const [entityRepeatableOptions, setEntityRepeatableOptions] = useState([]);
  const [engagementRepeatableOptions, setEngagementRepeatableOptions] = useState([]);
  const [memberFirmCode, setMemberFirmCode] = useState(DefaultMemberFirmCode);
  const [selectedMatClient, setSelectedMatClient] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(!isClientEditable && !isEntityEditable && !isEngagementEditable);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const me = useSelector(securitySelectors.selectMe);
  const client = useSelector(clientSelectors.selectClient);
  const matClient = useSelector(clientSelectors.selectMatClient);
  const matEntities = useSelector(clientSelectors.selectMatClientEntities);
  const matEngagements = useSelector(engagementSelectors.selectMatClientEngagements);
  const isFetchingMatEntities = useSelector(clientSelectors.selectIsFetchingMatClientEntities);
  const isFetchingMatEngagements = useSelector(engagementSelectors.selectIsFetchingMatClientEngagements);
  const engagements = useSelector(engagementSelectors.selectClientEngagementList);
  const isFetchingEngagements = useSelector(engagementSelectors.selectIsFetchingClientEngagementList);
  const isSavingClient = useSelector(clientSelectors.selectIsSavingClient);
  const isReconcilingEngagements = useSelector(engagementSelectors.selectIsReconcilingEngagements);
  const alertErrors = useSelector(errorsSelectors.selectReconcileClientErrors);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { permissions } = useCheckAuth();

  /**
   * This is not covered by unit tests
   */
  const handleMatClientChange = useCallback(value => {
    setSelectedMatClient(value);
  }, []);

  /**
   * This is not covered by unit tests
   */
  const handleEntitySelected = useCallback(
    (entityId, matEntityId) => {
      const mappings = { ...matEntitiesMapping };
      mappings[entityId] = matEntityId;
      setMatEntitiesMapping(mappings);
    },
    [matEntitiesMapping]
  );

  /**
   * This is not covered by unit tests
   */
  const handleEngagementSelected = useCallback(
    (engagementId, matEngagementId) => {
      const mappings = { ...matEngagementsMapping };
      mappings[engagementId] = matEngagementId;
      setMatEngagementsMapping(mappings);
    },
    [matEngagementsMapping]
  );

  const reconcileCallback = useCallback(
    response => {
      if (response) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleReconcileClient = useCallback(
    (reconcileEntities = false) => {
      const updatedClient = { ...client };

      if (!client.matClientId && selectedMatClient?.length) {
        updatedClient.matClientId = selectedMatClient[0].id;
        updatedClient.matCustomerNumber = selectedMatClient[0].customerNumber;
      }

      if (reconcileEntities) {
        const updatedEntities = client.entities.map(entity => {
          let matEntityId = matEntitiesMapping[entity.id] || null;
          matEntityId = matEntityId ? matEntityId.toString() : matEntityId;

          return { ...entity, matEntityId, subOrgId: null };
        });

        updatedClient.entities = updatedEntities;
      }
      dispatch(saveClient(updatedClient, addReconcileClientError, selectedMatClient?.[0].name)).then(reconcileCallback);
    },
    [dispatch, client, selectedMatClient, matEntities, matEntitiesMapping, reconcileCallback]
  );

  const handleReconcileEngagements = useCallback(() => {
    const engagementsToReconcile = engagements
      .map(engagement => {
        const matId = matEngagementsMapping[engagement.id];

        return matId && engagement.sourceState !== EngagementSourceState.RECONCILED && !engagement.matId
          ? { ...engagement, matId }
          : {};
      })
      .filter(engagement => {
        return engagement?.id;
      });

    if (engagementsToReconcile?.length > 0) {
      dispatch(reconcileEngagements(engagementsToReconcile, client.id, addReconcileClientError)).then(
        reconcileCallback
      );
    }
  }, [dispatch, engagements, matEngagementsMapping, client, reconcileCallback]);

  const handleReconcile = useCallback(() => {
    dispatch(resetReconcileClientErrors());
    if (isClientEditable || isEntityEditable) {
      handleReconcileClient(isEntityEditable);
    } else if (isEngagementEditable) {
      handleReconcileEngagements();
    }
  }, [
    dispatch,
    isClientEditable,
    isEntityEditable,
    isEngagementEditable,
    handleReconcileClient,
    handleReconcileEngagements,
  ]);

  const onErrorClose = useCallback(
    errorKey => {
      dispatch(deleteReconcileClientError(errorKey));
    },
    [dispatch]
  );

  /**
   * This is not covered by unit tests
   */
  const renderClientRowManual = useCallback(() => {
    return (
      <Flex alignContent='center' maxWidth='250px'>
        <Text type={TextTypes.BODY} ellipsisTooltip charLimit={25}>
          {client.name}
        </Text>
      </Flex>
    );
  }, [client]);

  /**
   * This is not covered by unit tests
   */
  const renderClientRowMat = useCallback(() => {
    return (
      <ClientSelect
        memberFirmCode={memberFirmCode}
        isGlobalClientPermission={permissions?.globalClient?.add}
        value={selectedMatClient}
        onChange={handleMatClientChange}
        placeholder={matClient ? matClient.name : t(`${TRANSLATION_KEY}_MatClientSelectPlaceholder`)}
        showLabel={false}
        dataInstance={COMPONENT_NAME}
        disabled={!isClientEditable || matClient}
        errorAction={addReconcileClientError}
      />
    );
  }, [
    t,
    matClient,
    matClientOptions,
    memberFirmCode,
    permissions,
    selectedMatClient,
    isClientEditable,
    handleMatClientChange,
  ]);

  /**
   * This is not covered by unit tests
   */
  const renderMatClientRowManual = useCallback(() => {
    return (
      <Flex alignContent='center'>
        <Text type={TextTypes.BODY}>{client?.matCustomerNumber || '—'}</Text>
      </Flex>
    );
  }, [client]);

  /**
   * This is not covered by unit tests
   */
  const renderMatClientRowMat = useCallback(() => {
    return (
      <Flex alignContent='center'>
        <Text type={TextTypes.BODY}>{matClient?.matCustomerNumber || '—'}</Text>
      </Flex>
    );
  }, [matClient]);

  /**
   * This is not covered by unit tests
   */
  const renderEntitiesRowManual = useCallback(() => {
    return (
      <Box>
        {client.entities.map((entity, index) => (
          <Box
            key={index}
            height='40px'
            lineHeight='40px'
            mb={index !== client.entities.length - 1 ? 4 : 0}
            maxWidth='250px'
          >
            <Text ellipsisTooltip charLimit={25}>
              {entity.isFromMat ? '—' : entity.name}
            </Text>
          </Box>
        ))}
      </Box>
    );
  }, [client]);

  /**
   * This is not covered by unit tests
   */
  const renderEntitiesRowMat = useCallback(() => {
    return (
      <Box>
        {client.entities.map((entity, index) => (
          <Box key={entity.id} mb={index !== client.entities.length - 1 ? 4 : 0}>
            <ReconcileSelect
              field={entity.id}
              value={matEntitiesMapping[entity.id]}
              selectedOptions={Object.values(matEntitiesMapping).map(entityMatId => {
                return { id: entityMatId };
              })}
              uniqueOptions={matEntities}
              repeatableOptions={entityRepeatableOptions}
              onFieldChange={handleEntitySelected}
              isFetchingData={isFetchingMatEntities}
              disabled={!isEntityEditable}
              textKey='name'
              valueKey='id'
            />
          </Box>
        ))}
      </Box>
    );
  }, [
    client,
    matEntitiesMapping,
    matEntities,
    entityRepeatableOptions,
    isEntityEditable,
    isFetchingMatEntities,
    handleEntitySelected,
  ]);

  /**
   * This is not covered by unit tests
   */
  const renderEngagementsRowManual = useCallback(() => {
    return (
      <Box>
        {engagements?.map((engagement, index) => (
          <Box
            key={index}
            height='40px'
            lineHeight='40px'
            mb={index !== engagements.length - 1 ? 4 : 0}
            maxWidth='250px'
          >
            <Text ellipsisTooltip charLimit={25}>
              {engagement.name}
            </Text>
          </Box>
        ))}
      </Box>
    );
  }, [engagements]);

  /**
   * This is not covered by unit tests
   */
  const renderEngagementsRowMat = useCallback(() => {
    return (
      <Box>
        {engagements?.map((engagement, index) => (
          <Box key={engagement.id} mb={index !== engagements.length - 1 ? 4 : 0}>
            <ReconcileSelect
              field={engagement.id}
              value={matEngagementsMapping[engagement.id]}
              selectedOptions={Object.values(matEngagementsMapping).map(engagementMatId => {
                return { id: engagementMatId };
              })}
              uniqueOptions={matEngagements}
              repeatableOptions={engagementRepeatableOptions}
              onFieldChange={handleEngagementSelected}
              isFetchingData={isFetchingMatEngagements}
              disabled={!isEngagementEditable || !!engagement.matId}
              textKey='name'
              valueKey='id'
            />
          </Box>
        ))}
      </Box>
    );
  }, [
    engagements,
    matEngagementsMapping,
    matEngagements,
    engagementRepeatableOptions,
    isEngagementEditable,
    isFetchingMatEngagements,
    handleEngagementSelected,
  ]);

  useEffect(() => {
    return () => {
      dispatch(resetReconcileClientErrors());
      dispatch(resetMatClientDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(isFetchingMatEntities || isFetchingMatEngagements || isFetchingEngagements);
  }, [dispatch, isFetchingMatEntities, isFetchingMatEngagements, isFetchingEngagements]);

  useEffect(() => {
    setIsReadOnly(!isClientEditable && !isEntityEditable && !isEngagementEditable);
  }, [isClientEditable, isEntityEditable, isEngagementEditable]);

  useEffect(() => {
    setIsSaving(isSavingClient || isReconcilingEngagements);
  }, [isSavingClient, isReconcilingEngagements]);

  useEffect(() => {
    setHeaders(getTableHeaders(t));
    setEntityRepeatableOptions(getEntityRepeatableOptions(t));
    setEngagementRepeatableOptions(getEngagementRepeatableOptions(t));
  }, [t]);

  useEffect(() => {
    setMemberFirmCode(me?.memberFirmCode || DefaultMemberFirmCode);
  }, [me]);

  useEffect(() => {
    if (matClient) {
      setSelectedMatClient([matClient]);
      setMatClientOptions([matClient]);

      dispatch(getMatClientEntities(matClient.matClientId, addReconcileClientError));
      dispatch(getMatClientEngagements(matClient.matClientId, addReconcileClientError));
    }
  }, [matClient, dispatch]);

  useEffect(() => {
    if (client?.matClientId) {
      dispatch(getMatClient(client.matClientId, addReconcileClientError));
    }
    if (client?.id) {
      dispatch(getEngagementsByClient(client.id, addReconcileClientError));
    }

    if (client?.entities) {
      const entitiesMapping = {};
      client.entities.forEach(entity => {
        entitiesMapping[entity.id] = entity.matEntityId;
      });

      setMatEntitiesMapping(entitiesMapping);
    }
  }, [dispatch, client]);

  useEffect(() => {
    if (engagements?.length) {
      const engagementsMapping = {};
      engagements.forEach(engagement => {
        engagementsMapping[engagement.id] = engagement.matId;
      });

      setMatEngagementsMapping(engagementsMapping);
    }
  }, [engagements]);

  useEffect(() => {
    const newRows = [
      {
        id: 0,
        name: t(`${TRANSLATION_KEY}_TableRow1`),
        manual: renderClientRowManual,
        mat: renderClientRowMat,
      },
      {
        id: 1,
        name: t(`${TRANSLATION_KEY}_TableRow2`),
        manual: renderMatClientRowManual,
        mat: renderMatClientRowMat,
      },
      {
        id: 2,
        name: t(`${TRANSLATION_KEY}_TableRow3`),
        manual: renderEntitiesRowManual,
        mat: renderEntitiesRowMat,
      },
      {
        id: 3,
        name: t(`${TRANSLATION_KEY}_TableRow4`),
        manual: renderEngagementsRowManual,
        mat: renderEngagementsRowMat,
      },
    ];

    setRows(newRows);
  }, [
    t,
    renderClientRowManual,
    renderClientRowMat,
    renderMatClientRowManual,
    renderMatClientRowMat,
    renderEntitiesRowManual,
    renderEntitiesRowMat,
    renderEngagementsRowManual,
    renderEngagementsRowMat,
  ]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      disablePrimaryButton={isSaving}
      primaryButtonText={isReadOnly ? t(`${TRANSLATION_KEY}_ReadOnlyButton`) : t(`${TRANSLATION_KEY}_PrimaryButton`)}
      onPrimaryButtonClick={isReadOnly ? handleClose : handleReconcile}
      disableSecondaryButton={isSaving}
      secondaryButtonText={t(`${TRANSLATION_KEY}_SecondaryButton`)}
      onSecondaryButtonClick={isReadOnly ? null : handleClose}
      onRemoveFromDom={onRemoveFromDom}
      size={ModalSizes.MEDIUM}
    >
      <Spinner spinning={isLoading || isSaving} label={t(`${TRANSLATION_KEY}_${isLoading ? 'Loading' : 'Saving'}`)}>
        <Box mb={9}>
          <Text type={TextTypes.H2} fontWeight='l'>
            {isReadOnly ? t(`${TRANSLATION_KEY}_ReadOnlyTitle`) : t(`${TRANSLATION_KEY}_Title`)}
          </Text>
        </Box>
        <AlertHub mb={9} alerts={alertErrors} onClose={onErrorClose} dataInstance={COMPONENT_NAME} />
        <Box mb={9}>
          <Table headers={headers} rows={rows} dataInstance={COMPONENT_NAME} />
        </Box>
      </Spinner>
    </Modal>
  );
};

ClientReconcileModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  isClientEditable: PropTypes.bool,
  isEntityEditable: PropTypes.bool,
  isEngagementEditable: PropTypes.bool,
  onRemoveFromDom: PropTypes.func,
};

ClientReconcileModal.defaultProps = {
  isModalOpen: false,
  isClientEditable: false,
  isEntityEditable: false,
  isEngagementEditable: false,
  onRemoveFromDom: null,
};

export default ClientReconcileModal;
