import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalSizes,
  Box,
  Input,
  Flex,
  Spinner,
  Text,
  TextTypes,
  Select,
  SelectTypes,
  Intent,
  Alert,
  AlertHub,
  AlertTypes,
  Tooltip,
  TooltipPosition,
  Icon,
  IconTypes,
} from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';
import {
  ComponentNames,
  FormErrorModel,
  FileTransferType,
  ADD_CONNECTION_TRANSLATION_KEY,
  TYPES,
  DataSourceTypes,
  CONNECTION_TYPES,
} from './constants';
import { getRunTimeEvironmentError } from '../../../../store/errors/actions';
import { clientSelectors } from 'src/store/client/selectors';
import { getConnectionRuntimeEnvironments, createConnection, testConnection } from 'src/store/client/actions';
import Parameters from './Parameters';
import { ClientActionTypes } from '../../../../store/client/actionTypes';
import TestConnectionModal from './TestConnectionModal';
import { bundlesSelectors } from '../../../../store/bundles/selectors';
import { getTemplateDetails } from '../../../../store/bundles/actions';
import { BundlesActionTypes } from '../../../../store/bundles/actionTypes';

const getConnectionTypeList = t => {
  return [
    {
      id: CONNECTION_TYPES.SOURCE,
      name: t(`${ADD_CONNECTION_TRANSLATION_KEY}Con_Type_Source`),
    },
    {
      id: CONNECTION_TYPES.EXTRACTION,
      name: t(`${ADD_CONNECTION_TRANSLATION_KEY}Con_Type_Extraction`),
    },
    {
      id: CONNECTION_TYPES.TRANSFER,
      name: t(`${ADD_CONNECTION_TRANSLATION_KEY}Con_Type_Transfer`),
    },
    {
      id: CONNECTION_TYPES.DATA_SYNCHRONIZATION,
      name: t(`${ADD_CONNECTION_TRANSLATION_KEY}Con_Type_Data_Synchronization`),
    },
  ];
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddConnectionModal = props => {
  const { isOpen, handleClose, rowData, selectedConnection, isEdit } = props;
  const { ADD_CONNECTION_MODAL: COMPONENT_NAME } = ComponentNames;
  const [connectionname, setConnectioName] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [connectionTypes, setConnectionTypes] = useState([]);
  const [selectedConnectionType, setSelectedConnectionType] = useState([]);
  const [connectorTemplate, setConnectorTemplate] = useState([]);
  const [selectedConnectorTemplate, setSelectedConnectorTemplate] = useState([]);
  const [runtimeEnvironment, setRuntimeEnvironment] = useState([]);
  const [selectedRuntimeEnvironment, setSelectedRuntimeEnvironment] = useState([]);
  const [connectionTypeList, setConnectionTypeList] = useState([]);
  const [paramaters, setParamaters] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [response, setResponse] = useState([]);
  const [waitForClient, setWaitForClient] = useState(false);
  const connectorTemplateList = useSelector(clientSelectors.selectConnectionTemplateList);
  const runTimeEnvironmentList = useSelector(clientSelectors.selectRuntimeDataList);
  const fetchingRuntimeEnvironments = useSelector(clientSelectors.selectRuntimeDataInProgress);
  const isCreating = useSelector(clientSelectors.selectIsCreatingDataSourceConnection);
  const isTestingConnection = useSelector(clientSelectors.selectIsTestingConnection);
  const creatingErrors = useSelector(clientSelectors.selectCreateDataSourceConnectionError);
  const connectorTemplateDetails = useSelector(bundlesSelectors.selectTemplateDetails);
  const isFetchingTemplateDetails = useSelector(bundlesSelectors.selectIsFetchingTemplateDetails);
  const testResultError = useSelector(clientSelectors.selectIsTestResultError);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  useEffect(() => {
    setConnectionTypeList(getConnectionTypeList(t));
  }, [t]);

  // API call to get the runtime environments for the client
  useEffect(() => {
    if (isOpen) {
      dispatch(getConnectionRuntimeEnvironments(rowData.clientId, rowData?.entityIds[0], getRunTimeEvironmentError));
    } else {
      setShowErrors(false);
    }
  }, [dispatch, rowData, isOpen]);

  useEffect(() => {
    if (isEdit && selectedConnection?.obsolete) {
      dispatch(getTemplateDetails(selectedConnection?.connectorId));
    }
  }, [dispatch, selectedConnection, isEdit]);

  // load the connection type list based on the conection type from the connections table
  useEffect(() => {
    if (!isEdit) {
      if (rowData?.fileTransferMode?.toLowerCase() === FileTransferType.MANUAL.toLowerCase()) {
        setConnectionTypes(connectionTypeList?.filter(list => list.id !== TYPES.TRANSFER));
      } else if (
        rowData?.type?.toLowerCase() === DataSourceTypes.CLIENT_FILE_SYSTEM.toLowerCase() &&
        rowData?.fileTransferMode?.toLowerCase() === FileTransferType.SECURE_AGENT.toLowerCase()
      ) {
        setConnectionTypes(connectionTypeList?.filter(list => list.id !== TYPES.SOURCE));
      } else {
        setConnectionTypes(connectionTypeList);
      }
    } else {
      // if the modal is for edit, setting the values of connection type, connector template
      let connType = [];
      setConnectioName(selectedConnection?.name);
      setDescription(selectedConnection?.description);
      connType = connectionTypeList?.filter(
        list => list?.id?.toLowerCase() === selectedConnection?.secureAgentType.toLowerCase()
      );

      setConnectionTypes(connType);
      setSelectedConnectionType(
        connType?.filter(list => list?.id.toLowerCase() === selectedConnection?.secureAgentType.toLowerCase())
      );
      let templates = connectorTemplateList?.items?.filter(
        list => list.kind.toLowerCase() === selectedConnection?.secureAgentType.toLowerCase()
      );
      if (selectedConnection?.obsolete && connectorTemplateDetails) {
        templates = [...templates, connectorTemplateDetails];
      }
      setConnectorTemplate(templates);
      setSelectedConnectorTemplate(templates?.filter(list => list?.id === selectedConnection?.connectorId));
    }
  }, [isEdit, rowData, selectedConnection, connectionTypeList, connectorTemplateDetails]);

  // load the run time environment list
  useEffect(() => {
    if (runTimeEnvironmentList?.length > 0 && !fetchingRuntimeEnvironments) {
      let envList = [];
      envList = runTimeEnvironmentList.map(list => {
        return {
          id: list.id,
          name: `${list.name} (${list.orgId})`,
        };
      });

      setRuntimeEnvironment(envList);
      if (isEdit) {
        setSelectedRuntimeEnvironment(envList?.filter(list => list?.id === selectedConnection?.runtimeEnvironmentId));
      }
    }
  }, [isEdit, runTimeEnvironmentList, selectedConnection, fetchingRuntimeEnvironments]);

  // function to handle the validations
  const getErrors = () => {
    const errors = { ...FormErrorModel };
    const errorMessage = t(`${ADD_CONNECTION_TRANSLATION_KEY}Validation_Message`);

    // connection name
    if (connectionname?.length <= 0) {
      errors.connectionName = errorMessage;
    }
    // description
    if (description?.length <= 0) {
      errors.description = errorMessage;
    }
    // connection type
    if (selectedConnectionType?.length <= 0) {
      errors.connectionType = errorMessage;
    }
    // connector template
    if (selectedConnectorTemplate?.length <= 0) {
      errors.connectorTemplate = errorMessage;
    }
    // run time environment
    if (selectedRuntimeEnvironment?.length <= 0) {
      errors.runtimeEnvironment = errorMessage;
    }

    return errors;
  };

  // load the connector template list against the connection type
  const handleSelectConnectionType = value => {
    setSelectedConnectionType(value);
    setSelectedConnectorTemplate([]);
    if (value.length > 0) {
      setConnectorTemplate(
        connectorTemplateList?.items?.filter(list => list.kind.toLowerCase() === value[0].id.toLowerCase())
      );
    } else {
      setConnectorTemplate([]);
    }
    setSelectedConnectionType(value);
  };

  // handler for the connector template select change
  const handleSelectConnectorTemplate = value => {
    setSelectedConnectorTemplate(value);
  };

  // handler for the run time environment select change
  const handleSelectRuntimeEnvironemnt = value => {
    setSelectedRuntimeEnvironment(value);
  };

  const onCloseAlerts = () => {
    dispatch({
      type: ClientActionTypes.CREATE_DATA_SOURCE_CONNECTION_REMOVE_ERROR,
    });
  };

  const onCloseTestError = () => {
    dispatch({
      type: ClientActionTypes.TEST_CONNECTION_REMOVE_ERROR,
    });
  };

  // function to handle the close event
  const closeConnections = () => {
    dispatch({ type: BundlesActionTypes.GET_TEMPLATE_DETAILS_CLEAR });
    setConnectioName('');
    setDescription('');
    setSelectedConnectionType([]);
    setConnectorTemplate([]);
    setSelectedConnectorTemplate([]);
    setSelectedRuntimeEnvironment([]);
    setShowErrors(false);
    onCloseAlerts();
    handleClose();
  };

  const hasErrors = () => {
    const errors = getErrors();
    const parametersErrors = paramaters && paramaters.hasErrors;

    return (
      errors.connectionName ||
      errors.connectionType ||
      errors.description ||
      errors.connectorTemplate ||
      errors.runtimeEnvironment ||
      parametersErrors
    );
  };

  const errors = showErrors ? getErrors() : { ...FormErrorModel };

  const handleSubmit = (isTesting = false) => () => {
    if (hasErrors()) {
      setShowErrors(true);

      return false;
    }
    setShowErrors(false);

    let data = {
      connectorId: selectedConnectorTemplate?.[0]?.id,
      dataSourceId: rowData?.id,
      description,
      id: selectedConnection?.id,
      name: connectionname,
      runtimeEnvironmentId: selectedRuntimeEnvironment?.[0]?.id,
      secureAgentType: selectedConnectionType?.[0]?.id,
      type: 'secureAgent',
    };

    if (paramaters) {
      let properties = {};
      paramaters?.items?.forEach(item => {
        properties = {
          ...properties,
          [item.data.id]: item.value,
        };
      });
      data = {
        ...data,
        connectorParameters: properties,
        connectorParametersFilledByClient: paramaters.clientWillPopulate || paramaters.clientWaitingStatus,
      };
    }

    if (isTesting) {
      dispatch(testConnection(data)).then(result => {
        const title = result?.latestOnlineStatus
          ? t('Components_ClientSetupConnections_Test_Result_Success')
          : t('Components_ClientSetupConnections_Test_Result_Error');
        if (result?.latestTestMessage) {
          setIsConfirmOpen(true);
          setResponse([title, result?.latestTestMessage]);
        }
      });
    } else {
      dispatch(createConnection(data, rowData.clientId, isEdit)).then(isSuccess => {
        if (isSuccess) {
          closeConnections();
        }
      });
    }

    return true;
  };

  const isOldTemplateSelected = (connection, template) => {
    return connection?.obsolete && template[0]?.id === connection.connectorId;
  };

  return (
    <Box>
      <Modal
        mt={4}
        isOpen={isOpen}
        onClose={closeConnections}
        onPrimaryButtonClick={handleSubmit(false)}
        onSecondaryButtonClick={closeConnections}
        onTertiaryButtonClick={handleSubmit(true)}
        primaryButtonText={
          !isEdit
            ? t(`${ADD_CONNECTION_TRANSLATION_KEY}Primary_Button_CREATE`)
            : t(`${ADD_CONNECTION_TRANSLATION_KEY}Primary_Button_EDIT`)
        }
        secondaryButtonText={t(`${ADD_CONNECTION_TRANSLATION_KEY}Secondary_Button`)}
        tertiaryButtonText={t(`${ADD_CONNECTION_TRANSLATION_KEY}Tertiary_Button`)}
        disablePrimaryButton={isCreating || isTestingConnection}
        disableSecondaryButton={isCreating || isTestingConnection}
        disableTertiaryButton={waitForClient || isCreating || isTestingConnection}
        size={ModalSizes.MEDIUM}
        dataInstance={`${COMPONENT_NAME}`}
      >
        <Spinner spinning={isCreating || isTestingConnection} dataInstance={`${COMPONENT_NAME}-Spinner`}>
          <Box width='100%'>
            {!isEdit ? (
              <Text type={TextTypes.H2} fontWeight='l'>
                {t(`${ADD_CONNECTION_TRANSLATION_KEY}Title_Create`)}
              </Text>
            ) : (
              <Text type={TextTypes.H2} fontWeight='l'>
                {t(`${ADD_CONNECTION_TRANSLATION_KEY}Title_Edit`)}
              </Text>
            )}
          </Box>
          <Box my={3}>
            <AlertHub alerts={creatingErrors} onClose={onCloseAlerts} />
            {testResultError?.message && (
              <Alert
                type={AlertTypes.ERROR}
                message={testResultError?.message}
                dataInstance={`${COMPONENT_NAME}-TestError`}
                mb={5}
                onClose={onCloseTestError}
              />
            )}
          </Box>
          <Box>
            <Flex justifyContent='space-between'>
              <Box width='50%' mr={4} mt={4}>
                <Input
                  required
                  label={t(`${ADD_CONNECTION_TRANSLATION_KEY}Label_Connection_Name`)}
                  value={connectionname}
                  dataInstance={`${COMPONENT_NAME}_Connection_Name`}
                  onChange={e => setConnectioName(e.target.value)}
                  hint={errors.connectionName}
                  intent={errors.connectionName ? Intent.ERROR : null}
                  placeholder={t(`${ADD_CONNECTION_TRANSLATION_KEY}Placeholder_Connection_Name`)}
                />
              </Box>
              <Box width='50%' ml={4} mt={4}>
                <Input
                  required
                  label={t(`${ADD_CONNECTION_TRANSLATION_KEY}Label_Description`)}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  dataInstance={`${COMPONENT_NAME}_Connection_Description`}
                  hint={errors.description}
                  intent={errors.description ? Intent.ERROR : null}
                  placeholder={t(`${ADD_CONNECTION_TRANSLATION_KEY}Placeholder_Description`)}
                />
              </Box>
            </Flex>
          </Box>
          <Flex justifyContent='space-between'>
            <Box width='50%' mr={4} mt={4}>
              <Select
                required
                label={t(`${ADD_CONNECTION_TRANSLATION_KEY}Label_Connection_Type`)}
                type={SelectTypes.SINGLE}
                value={selectedConnectionType}
                options={connectionTypes}
                filtering
                onChange={handleSelectConnectionType}
                dataInstance={`${COMPONENT_NAME}_Connection_Type`}
                hint={errors.connectionType}
                intent={errors.connectionType ? Intent.ERROR : null}
                placeholder={t(`${ADD_CONNECTION_TRANSLATION_KEY}Placeholder_Connection_Type`)}
                optionValueKey='id'
                optionTextKey='name'
              />
            </Box>
            <Box width='50%' ml={4} mt={4}>
              <Select
                required
                label={
                  <Text display='flex' alignItems='center'>
                    {t(`${ADD_CONNECTION_TRANSLATION_KEY}Label_Connector_Template`)}
                    {isEdit && isOldTemplateSelected(selectedConnection, selectedConnectorTemplate) && (
                      <Tooltip
                        display='inline-block'
                        direction={TooltipPosition.TOP}
                        tooltipContent={t(`${ADD_CONNECTION_TRANSLATION_KEY}ObsoleteConnection`)}
                        width='200px'
                        showOnHover
                      >
                        <Icon type={IconTypes.WARNING_NO_CIRCLE} height={20} width={20} ml={2} color='black' />
                      </Tooltip>
                    )}
                  </Text>
                }
                type={SelectTypes.SINGLE}
                value={selectedConnectorTemplate}
                onChange={handleSelectConnectorTemplate}
                options={connectorTemplate}
                loading={isFetchingTemplateDetails}
                filtering
                dataInstance={`${COMPONENT_NAME}_Connector_Template`}
                hint={errors.connectorTemplate}
                intent={errors.connectorTemplate ? Intent.ERROR : null}
                placeholder={t(`${ADD_CONNECTION_TRANSLATION_KEY}Placeholder_Connector_Template`)}
                optionValueKey='id'
                optionTextKey='name'
              />
            </Box>
          </Flex>
          <Flex justifyContent='space-between'>
            <Box width='49%' mr={4} my={8}>
              <Select
                required
                label={t(`${ADD_CONNECTION_TRANSLATION_KEY}Label_Runtime_Environment`)}
                type={SelectTypes.SINGLE}
                value={selectedRuntimeEnvironment}
                options={runtimeEnvironment}
                filtering
                onChange={handleSelectRuntimeEnvironemnt}
                dataInstance={`${COMPONENT_NAME}_Runtime_Environment`}
                hint={errors.runtimeEnvironment}
                loading={fetchingRuntimeEnvironments}
                intent={errors.runtimeEnvironment ? Intent.ERROR : null}
                placeholder={t(`${ADD_CONNECTION_TRANSLATION_KEY}Placeholder_Runtime_Environment`)}
                optionValueKey='id'
                optionTextKey='name'
              />
            </Box>
          </Flex>

          <Parameters
            selectedConnectorTemplate={selectedConnectorTemplate?.[0]}
            showErrors={showErrors}
            setParameters={setParamaters}
            clientCanPopulate={
              selectedConnectionType.length > 0
                ? selectedConnectionType[0].id === CONNECTION_TYPES.SOURCE ||
                  selectedConnectionType[0].id === CONNECTION_TYPES.EXTRACTION
                : false
            }
            connectorParameters={selectedConnection?.connectorParameters}
            setWaitForClient={setWaitForClient}
            isEdit={isEdit}
            isWaitingforClientStatus={selectedConnection?.connectorParametersFilledByClient}
          />
        </Spinner>
      </Modal>
      <TestConnectionModal
        handleClose={handleCloseConfirm}
        isTestModal={isConfirmOpen}
        response={response}
        dataInstance={`${COMPONENT_NAME}_Test_Connection`}
      />
    </Box>
  );
};

AddConnectionModal.propTypes = {
  /**
   * Whether the modal is open or not
   */
  isOpen: PropTypes.bool,

  /**
   * Callback that should set the value of isOpen to false
   */
  handleClose: PropTypes.func.isRequired,
};

AddConnectionModal.defaultProps = {
  isOpen: false,
};

export default AddConnectionModal;
