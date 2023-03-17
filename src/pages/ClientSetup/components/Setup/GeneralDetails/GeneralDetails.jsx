import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  Button,
  ButtonTypes,
  Box,
  Checkbox,
  Flex,
  Input,
  Intent,
  Spinner,
  Text,
  TextTypes,
  Icon,
  IconTypes,
} from 'cortex-look-book';
import IndustrySelect from '../../../../../components/IndustrySelect/IndustrySelect';
import CountrySelect from '../../../../../components/CountrySelect/CountrySelect';
import { useDispatch, useSelector } from 'react-redux';
import { securitySelectors } from '../../../../../store/security/selectors';
import { fetchCountries } from '../../../../../store/security/actions';
import { fetchAllTags } from '../../../../../store/bundles/actions';
import { addGlobalError } from '../../../../../store/errors/actions';
import { filterTagsByTagGroup } from '../../../../../utils/tagsHelper';
import {
  saveClient,
  updateClientSetupStepStatus,
  updateClientUsesSecureAgent,
} from '../../../../../store/client/actions';
import { clientSelectors } from '../../../../../store/client/selectors';
import { isValidDate } from '../../../../../utils/dateHelper';
import useTranslation from '../../../../../hooks/useTranslation';
import ClientReconcileModal from '../../ClientReconcileModal/ClientReconcileModal';
import useCheckAuth from '../../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../../utils/permissionsHelper';
import { isLegacyMode } from '../../../../../utils/legacyUtils';

export const COMPONENT_NAME = 'Client_Setup_Step_1_General_Details';
const INDRUSTRIES_TAG_GROUP = 'INDUSTRIES';
const FormErrorModel = Object.freeze({
  clientName: null,
  fiscalYear: null,
});

// eslint-disable-next-line sonarjs/cognitive-complexity
const GeneralDetails = props => {
  const { client } = props;
  const { matClientId, memberFirmCode, geoCode, matCustomerNumber } = client;
  const [isReady, setIsReady] = useState(false);
  const [savedClient, setSavedClient] = useState(client);
  const [oldClient, setOldClient] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [useSecureAgent, setUseSecureAgent] = useState(client.usesSecureAgent);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [shouldRenderReconcileModal, setShouldRenderReconcileModal] = useState(false);
  const [canUpdateClient, setCanUpdateClient] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { permissions } = useCheckAuth({ useClientPermissions: true });
  const allIndustries = useSelector(state => {
    return filterTagsByTagGroup(state.bundles.get('tagsList'), INDRUSTRIES_TAG_GROUP);
  });
  const countries = useSelector(securitySelectors.selectCountries);
  const { add: isGlobalClientPermission } = permissions.globalClient;
  const isSaving = useSelector(clientSelectors.selectIsSavingClient);
  const isUpdatingClientUsesSecureAgent = useSelector(clientSelectors.selectIsUpdatingClientUsesSecureAgent);

  useEffect(() => {
    if (geoCode && memberFirmCode) {
      dispatch(fetchCountries(memberFirmCode, geoCode, isGlobalClientPermission));
      dispatch(fetchAllTags(addGlobalError));
    }
  }, [dispatch, memberFirmCode, geoCode, isGlobalClientPermission]);

  useEffect(() => {
    if (client && client?.industries && allIndustries.length > 0 && countries.length > 0 && !isReady) {
      const updatedClient = {
        ...savedClient,
        industries: client?.matClientId
          ? client?.industries?.map(industry => {
              return {
                name: industry,
              };
            })
          : allIndustries.filter(i => client?.industries?.includes(i?.id) || client?.industries?.includes(i?.name)),
        countries: countries.filter(c => c.countryCode === client.countryCode),
      };
      setSavedClient(updatedClient);
      setOldClient(updatedClient);
      setIsReady(true);
    }
  }, [client, countries, allIndustries]);

  useEffect(() => {
    setUseSecureAgent(client?.usesSecureAgent);
  }, [client]);

  useEffect(() => {
    dispatch(updateClientSetupStepStatus(1, client?.matClientId));
  }, [dispatch, client]);

  useEffect(() => {
    setCanUpdateClient(checkPermissions(permissions, Permissions.CLIENT, Actions.UPDATE));
  }, [permissions]);

  const handleOnChangeName = event => {
    setSavedClient({ ...savedClient, name: event.target.value });
  };

  const handleOnChangeDay = event => {
    let value = parseInt(event.target.value, 10);
    value = !Number.isNaN(Number(value)) ? value : null;
    setSavedClient({ ...savedClient, fiscalYearEnd: { ...savedClient.fiscalYearEnd, day: value } });
  };

  const handleOnChangeMonth = event => {
    let value = parseInt(event.target.value, 10);
    value = !Number.isNaN(Number(value)) ? value : null;
    setSavedClient({ ...savedClient, fiscalYearEnd: { ...savedClient.fiscalYearEnd, month: value } });
  };

  const handleOnChangeIndustries = value => {
    setSavedClient({ ...savedClient, industries: value });
  };

  const canSaveClient = () => {
    if (oldClient) {
      return oldClient !== savedClient;
    }

    return false;
  };

  const getErrors = () => {
    const errors = { ...FormErrorModel };
    // Client name
    if (!(savedClient.name && savedClient.name.length > 0)) {
      errors.client = t('Pages_Client_Setup_Step1_Error_ClientName');
    }
    // FiscalYear
    if (savedClient?.fiscalYearEnd && savedClient?.fiscalYearEnd?.month && savedClient?.fiscalYearEnd?.day) {
      errors.fiscalYear = isValidDate(savedClient?.fiscalYearEnd?.day, savedClient?.fiscalYearEnd?.month)
        ? null
        : t('Pages_Client_Setup_Step1_Error_FiscalYear_ValidDate');
    } else {
      errors.fiscalYear = t('Pages_Client_Setup_Step1_Error_FiscalYear_Required');
    }

    return errors;
  };

  const hasErrors = () => {
    const errors = getErrors();

    return errors.client || errors.fiscalYear;
  };

  const handleOnSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }
    const newClient = {
      ...savedClient,
      industries: savedClient.industries.map(i => i.id),
      countries: client.countries,
    };
    dispatch(saveClient(newClient));
  };

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

  const onChangeUseSecureAgent = value => {
    setUseSecureAgent(value);
    dispatch(updateClientUsesSecureAgent(client.id, value));
  };

  const errors = showErrors ? getErrors() : { ...FormErrorModel };

  return (
    <Spinner spinning={!isReady || isSaving} dataInstance={COMPONENT_NAME}>
      {shouldRenderReconcileModal && (
        <ClientReconcileModal
          isModalOpen={isReconcileModalOpen}
          isClientEditable={!client.matClientId}
          handleClose={onReconcileModalClose}
          dataInstance={COMPONENT_NAME}
          onRemoveFromDom={onReconcileModalRemovedFromDom}
        />
      )}

      <Box width='100%' pl={80}>
        {!client.matClientId && (
          <AlertDialog
            type={Intent.INFO}
            title={t('Pages_Client_Setup_Step1_ReconcileTitle')}
            mb={8}
            dataInstance={COMPONENT_NAME}
          >
            <Text>
              {t('Pages_Client_Setup_Step1_ReconcileText')}
              <Button
                type={ButtonTypes.LINK}
                display='inline-block'
                ml={3}
                onClick={onReconcileClick}
                dataInstance={`${COMPONENT_NAME}-Reconcile`}
              >
                {t('Pages_Client_Setup_Step1_ReconcileButton')}
              </Button>
            </Text>
          </AlertDialog>
        )}
        {!isLegacyMode && (
          <Box mb={5}>
            <Flex>
              <Text type={TextTypes.HBODY3} color='gray' mr={10}>
                {t('Pages_Client_Setup_Step1_Secury_Agent_Question')}
              </Text>
              <Box mx={5}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_Yes_Option`}
                  label={t('Pages_Client_Setup_Step1_Secury_Agent_Yes_Option')}
                  isChecked={useSecureAgent}
                  disabled={isUpdatingClientUsesSecureAgent || !canUpdateClient}
                  onChange={() => {
                    onChangeUseSecureAgent(true);
                  }}
                />
              </Box>
              <Box mx={5}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_No_Option`}
                  label={t('Pages_Client_Setup_Step1_Secury_Agent_No_Option')}
                  isChecked={!useSecureAgent}
                  disabled={isUpdatingClientUsesSecureAgent || !canUpdateClient}
                  onChange={() => {
                    onChangeUseSecureAgent(false);
                  }}
                />
              </Box>
              {isUpdatingClientUsesSecureAgent && (
                <Box position='relative' width='18px' ml={3}>
                  <Icon
                    dataInstance={`${COMPONENT_NAME}_SecureAgent_Spinner`}
                    type={IconTypes.ANIMATED_REFRESH}
                    width={20}
                    position='absolute'
                    sx={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </Box>
              )}
            </Flex>
          </Box>
        )}
        <Box>
          <Text type={TextTypes.h4} fontWeight='m' mb={4} color='black'>
            {t('Pages_Client_Setup_Step1_General_Info_Title')}
          </Text>
          <Text type={TextTypes.BODY} color='gray'>
            {t('Pages_Client_Setup_Step1_General_Info_Description')}
          </Text>
          <Box mt={5}>
            <Flex>
              <Box mr={10} width='100%' maxWidth='250px'>
                <Input
                  dataInstance={`${COMPONENT_NAME}_Client_Name`}
                  label={t('Pages_Client_Setup_Step1_Client_Name')}
                  value={matClientId ? client.name : savedClient.name}
                  onChange={handleOnChangeName}
                  disabled={!!matClientId || !canUpdateClient || !!matCustomerNumber}
                />
              </Box>
              <Box mx={10} width='100%' maxWidth='250px'>
                <Input
                  dataInstance={`${COMPONENT_NAME}_Client-Id`}
                  label={t('Pages_Client_Setup_Step1_Client_ID')}
                  value={matCustomerNumber || t('Pages_Client_Setup_Step1_Client_ID_Not_Found')}
                  disabled
                  readOnly
                />
              </Box>
              <Box ml={10} width='100%' maxWidth='250px'>
                <Box>
                  <Text type={TextTypes.H4} fontWeight='m' mb={2}>
                    {t('Pages_Client_Setup_Step1_Fiscal_Year_End')}
                  </Text>
                  <Flex alignItems='center'>
                    <Box width={70}>
                      <Input
                        onChange={handleOnChangeMonth}
                        value={savedClient?.fiscalYearEnd?.month || ''}
                        disabled={!!matClientId || !canUpdateClient || !!matCustomerNumber}
                        maxLength={2}
                        placeholder={t('Pages_Client_Setup_Step1_Fiscal_Year_End_Month')}
                        intent={errors.fiscalYear ? Intent.ERROR : null}
                        dataInstance={`${COMPONENT_NAME}_Fiscal_Year_End_Month`}
                      />
                    </Box>
                    <Text type={TextTypes.BODY} mx={2}>
                      /
                    </Text>
                    <Box width={70}>
                      <Input
                        width={70}
                        onChange={handleOnChangeDay}
                        value={savedClient?.fiscalYearEnd?.day || ''}
                        disabled={!!matClientId || !canUpdateClient || !!matCustomerNumber}
                        maxLength={2}
                        placeholder={t('Pages_Client_Setup_Step1_Fiscal_Year_End_Day')}
                        intent={errors.fiscalYear ? Intent.ERROR : null}
                        dataInstance={`${COMPONENT_NAME}_Fiscal_Year_End_Day`}
                      />
                    </Box>
                  </Flex>
                  {errors.fiscalYear && (
                    <Text type={TextTypes.H4} mt={2} color='errorBorder'>
                      {errors.fiscalYear}
                    </Text>
                  )}
                </Box>
              </Box>
            </Flex>
          </Box>
          <Box mt={30}>
            <Flex>
              <Box mr={20} width='100%' maxWidth='250px'>
                <IndustrySelect
                  placeholder={t('Pages_Client_Setup_Step1_Industry')}
                  dataInstance={`${COMPONENT_NAME}_Industries`}
                  value={isReady ? savedClient.industries : []}
                  onChange={handleOnChangeIndustries}
                  disabled={!!matClientId || !canUpdateClient || !!matCustomerNumber}
                  filtering={false}
                  fetchedTags
                />
              </Box>
              <Box ml={20} width='100%' maxWidth='250px'>
                <CountrySelect
                  placeholder={t('Pages_Client_Setup_Step1_Country')}
                  dataInstance={COMPONENT_NAME}
                  isManual={!matClientId}
                  disabled
                  value={isReady ? savedClient.countries : []}
                />
              </Box>
            </Flex>
          </Box>
          {client?.matClientId && (
            <Button
              mt={8}
              type={ButtonTypes.LINK}
              iconWidth={20}
              onClick={onReconcileClick}
              dataInstance={`${COMPONENT_NAME}-SeeDetails`}
            >
              <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step1_See_Details')}</Text>
            </Button>
          )}
          {!matClientId && (
            <Button
              type={ButtonTypes.PRIMARY}
              mt={40}
              onClick={handleOnSubmit}
              disabled={!canSaveClient() || !canUpdateClient}
              dataInstance={`${COMPONENT_NAME}_Save`}
            >
              {t('Pages_Client_Setup_Step1_Save')}
            </Button>
          )}
        </Box>
      </Box>
    </Spinner>
  );
};

export default GeneralDetails;
