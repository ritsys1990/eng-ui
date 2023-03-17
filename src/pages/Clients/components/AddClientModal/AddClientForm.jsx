import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { AlertHub, Box, Checkbox, Flex, Input, Intent, Link, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { createClient, createClientUser, createClientStorage } from 'src/store/client/actions';
import securityService from 'src/services/security.service';
import { getCountryDetails } from 'src/utils/engagementHelper';
import { isValidDate } from 'src/utils/dateHelper';
import CountrySelect from 'src/components/CountrySelect/CountrySelect';
import ClientSelect from 'src/components/ClientSelect/ClientSelect';
import Roles from 'src/utils/rolesEnum';
import IndustrySelect from 'src/components/IndustrySelect/IndustrySelect';
import { deleteAddClientError, resetAddClientErrors, addAddClientError } from 'src/store/errors/actions';
import { Constants, FormErrorModel, COMPONENT_NAME } from './constants';
import { securitySelectors } from '../../../../store/security/selectors';
import { errorsSelectors } from '../../../../store/errors/selectors';
import { isExternal, hasAppLevelRole } from '../../../../utils/securityHelper';
import useTranslation from 'src/hooks/useTranslation';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddClientForm = forwardRef((props, ref) => {
  const {
    isLoading,
    isGlobalClientPermission,
    memberFirmCode,
    setIsCreatingClientStorage,
    isCreatingClientStorage,
  } = props;

  const [matClient, setMatClient] = useState([]);
  const [geoCode, setGeoCode] = useState('');
  const [countries, setCountries] = useState([]);
  const [existingCountry, setExistingCountry] = useState({});
  const [countryOptions, setCountryOptions] = useState([]);
  const [fiscalYear, setFiscalYear] = useState({ day: null, month: null });
  const [industries, setIndustries] = useState([]);
  const [usesSecureAgent, setUsesSecureAgent] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const { t } = useTranslation();
  const history = useHistory();

  const me = useSelector(securitySelectors.selectMe);
  const alertErrors = useSelector(errorsSelectors.selectAddClientErrors);
  const roles = useSelector(securitySelectors.selectMeRoles);
  const memberFirmCountry = useSelector(securitySelectors.selectCountries);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAddClientErrors());
  }, []);

  useEffect(() => {
    securityService.fetchGeoCode().then(geoInformation => {
      setGeoCode(geoInformation.geoCode);
    });
  }, [dispatch]);

  const getErrors = () => {
    const errors = { ...FormErrorModel };
    // Client name
    const clientName = ((matClient || [])[0] || {}).name;
    if (!(clientName && clientName.length > 0)) {
      errors.client = t('Components_AddClientModal_Error_ClientName');
    }
    // Country Name
    if (!(countries && countries.length > 0)) {
      errors.country = t('Components_AddClientModal_Error_CountryName');
    }
    // FiscalYear
    if (fiscalYear && fiscalYear.month && fiscalYear.day) {
      errors.fiscalYear = isValidDate(fiscalYear.day, fiscalYear.month)
        ? null
        : t('Components_AddClientModal_Error_FiscalYear_ValidDate');
    } else {
      errors.fiscalYear = t('Components_AddClientModal_Error_FiscalYear_Required');
    }

    return errors;
  };

  const handleCreateClientStorage = (clientId, attempts) => {
    dispatch(createClientStorage(clientId, false))
      .then(response => {
        if (!response) {
          return;
        }

        setIsCreatingClientStorage(false);
        history.push(`/clients/${clientId}/setup`);
      })
      .catch(error => {
        if (error?.code === 401 && attempts < 5) {
          setTimeout(() => {
            handleCreateClientStorage(clientId, attempts + 1);
          }, Constants.createClientStorageRefreshTime);
        } else {
          setIsCreatingClientStorage(false);
          dispatch(addAddClientError(error));
        }
      });
  };

  const hasErrors = () => {
    const errors = getErrors();

    return errors.client || errors.country || errors.fiscalYear;
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }
    dispatch(resetAddClientErrors());
    const client = matClient[0];
    let newClient;
    if (client.id) {
      const {
        geoCode: countryGeoCode,
        containerCode,
        containerId,
        memberFirmCode: countryMemberFirmCode,
        countryCode,
      } = existingCountry;
      newClient = {
        name: client.name,
        matClientId: client.id,
        matCustomerNumber: client.customerNumber,
        usesSecureAgent,
        GeoCode: countryGeoCode,
        ContainerCode: containerCode,
        ContainerId: containerId,
        MemberFirmCode: countryMemberFirmCode,
        CountryCode: countryCode,
      };
    } else {
      const code = countries[0].countryCode;
      const {
        geoCode: countryGeoCode,
        containerCode,
        containerId,
        memberFirmCode: countryMemberFirmCode,
        countryCode,
      } = getCountryDetails(countryOptions, code);
      newClient = {
        fiscalYearEnd: fiscalYear,
        name: client.name,
        industries: (industries || []).map(x => x.name),
        countries: (countries || []).map(x => x.countryName),
        usesSecureAgent,
        GeoCode: countryGeoCode,
        ContainerCode: containerCode,
        ContainerId: containerId,
        MemberFirmCode: countryMemberFirmCode,
        CountryCode: countryCode,
      };
    }

    dispatch(createClient(newClient)).then(clientRes => {
      if (!clientRes) {
        return;
      }

      const user = {
        email: me.email,
        firstName: me.firstName,
        lastName: me.lastName,
        roleIds: [Roles.CLIENT_SETUP_ADMIN],
      };

      if (!hasAppLevelRole(roles, Roles.CLIENT_APP_SETUP_ADMIN)) {
        dispatch(createClientUser(clientRes.id, user, isExternal(me))).then(data => {
          if (!data) {
            return;
          }

          setIsCreatingClientStorage(true);
          handleCreateClientStorage(clientRes.id, 0);
        });
      } else {
        dispatch(createClientStorage(clientRes.id)).then(data => {
          if (!data) {
            return;
          }

          history.push(`/clients/${clientRes.id}/setup`);
        });
      }
    });
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  const handleClientChange = value => {
    const client = value[0];
    if (client && client.id) {
      setCountries([{ countryCode: client.country }]);
      setFiscalYear({
        month: (client.fiscalYearEnd || {}).month,
        day: (client.fiscalYearEnd || {}).day,
      });
      setIndustries([{ name: client.industryName }]);
      setExistingCountry(getCountryDetails(memberFirmCountry, client.country));
    } else {
      setCountries(null);
      setFiscalYear(null);
      setIndustries(null);
    }
    setMatClient(value);
  };

  const onCountryChange = (countriesArray, newCountryOptions) => {
    setCountries(countriesArray);
    setCountryOptions(newCountryOptions);
  };

  const handleDayChange = e => {
    let value = parseInt(e.target.value, 10);
    value = !Number.isNaN(Number(value)) ? value : null;
    setFiscalYear({ ...fiscalYear, day: value });
  };

  const handleMonthChange = e => {
    let value = parseInt(e.target.value, 10);
    value = !Number.isNaN(Number(value)) ? value : null;
    setFiscalYear({ ...fiscalYear, month: value });
  };

  const onErrorClose = errorKey => {
    dispatch(deleteAddClientError(errorKey));
  };

  const onChangeUseSecureAgent = value => {
    setUsesSecureAgent(value);
  };

  // Template vars
  const matClientId = ((matClient || [])[0] || {}).id || '';
  const matCustomerNumber = ((matClient || [])[0] || {}).customerNumber || '';
  const monthValue = (fiscalYear || {}).month || '';
  const dayValue = (fiscalYear || {}).day || '';
  const errors = showErrors ? getErrors() : { ...FormErrorModel };

  return (
    <Spinner
      spinning={isLoading}
      overlayOpacity={0.5}
      label={
        isCreatingClientStorage ? t('Components_AddClientModal_SpinnerStorage') : t('Components_AddClientModal_Spinner')
      }
    >
      <Box width='100%'>
        <Text type={TextTypes.H2} fontWeight='l'>
          {t('Components_AddClientModal_ModalTitle')}
        </Text>
        <Box py={4}>
          <AlertHub alerts={alertErrors} onClose={onErrorClose} />
          <Box mb={5}>
            <Flex>
              <Text type={TextTypes.H4} mr={10}>
                {t('Components_AddClientModal_SecureAgentQuestion')}
              </Text>
              <Box mx={5}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_Yes_Option`}
                  label={t('Components_AddClientModal_Yes_Option')}
                  isChecked={usesSecureAgent}
                  onChange={() => {
                    onChangeUseSecureAgent(true);
                  }}
                />
              </Box>
              <Box mx={5}>
                <Checkbox
                  dataInstance={`${COMPONENT_NAME}_No_Option`}
                  label={t('Components_AddClientModal_No_Option')}
                  isChecked={!usesSecureAgent}
                  onChange={() => {
                    onChangeUseSecureAgent(false);
                  }}
                />
              </Box>
            </Flex>
          </Box>
          <ClientSelect
            errorAction={addAddClientError}
            memberFirmCode={memberFirmCode}
            isGlobalClientPermission={isGlobalClientPermission}
            value={matClient}
            onChange={handleClientChange}
            hint={errors.client}
            placeholder={t('Components_AddClientModal_Placeholder_Name')}
            intent={errors.client ? Intent.ERROR : null}
            dataInstance={COMPONENT_NAME}
          />
          <Box mt={4}>
            <Input
              label={t('Components_AddClientModal_Label_ClientID')}
              disabled
              value={matCustomerNumber}
              placeholder={t('Components_AddClientModal_Placeholder_ClientID')}
              dataInstance={`${COMPONENT_NAME}-ClientId`}
            />
          </Box>
          <IndustrySelect
            errorAction={addAddClientError}
            value={industries}
            onChange={setIndustries}
            mt={4}
            placeholder={t('Components_AddClientModal_Placeholder_Industries')}
            disabled={!!matClientId}
            dataInstance={COMPONENT_NAME}
          />
          <CountrySelect
            errorAction={addAddClientError}
            value={countries}
            onChange={onCountryChange}
            my={4}
            geoCode={geoCode}
            globalClient={isGlobalClientPermission}
            placeholder={t('Components_AddClientModal_Placeholder_Countries')}
            disabled={!!matClientId}
            isManual={!matClientId}
            hint={errors.country}
            intent={errors.country ? Intent.ERROR : null}
            dataInstance={COMPONENT_NAME}
          />
          {!matClientId && (
            <Text textAlign='left' type={TextTypes.H4} mb={4}>
              {t('Components_CountrySelect_GuidlineMessage')}{' '}
              <Link
                external
                to={`mailto:${t('Components_HeaderHelp_SupportModal_Client_Email')}`}
                dataInstance={COMPONENT_NAME}
              >
                {t('Components_CountrySelect_GuidlineMailTo')}
              </Link>
            </Text>
          )}
          <Box>
            <Text type={TextTypes.H4} fontWeight='m' mb={2}>
              {t('Components_AddClientModal_Label_FiscalYear')}
            </Text>
            <Flex alignItems='center'>
              <Box width={70}>
                <Input
                  onChange={handleMonthChange}
                  value={monthValue}
                  disabled={!!matClientId}
                  maxLength={2}
                  placeholder={t('Components_AddClientModal_Placeholder_Month')}
                  intent={errors.fiscalYear ? Intent.ERROR : null}
                  dataInstance={`${COMPONENT_NAME}-Month`}
                />
              </Box>
              <Text type={TextTypes.BODY} mx={2}>
                /
              </Text>
              <Box width={70}>
                <Input
                  width={70}
                  onChange={handleDayChange}
                  value={dayValue}
                  disabled={!!matClientId}
                  maxLength={2}
                  placeholder={t('Components_AddClientModal_Placeholder_Day')}
                  intent={errors.fiscalYear ? Intent.ERROR : null}
                  dataInstance={`${COMPONENT_NAME}-Day`}
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
      </Box>
    </Spinner>
  );
});

export default AddClientForm;
