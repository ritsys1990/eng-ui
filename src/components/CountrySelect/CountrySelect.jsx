import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectTypes } from 'cortex-look-book';
import { fetchCountries } from '../../store/security/actions';
import { addGlobalError } from '../../store/errors/actions';
import { securitySelectors } from '../../store/security/selectors';
import { Constants } from './constants';
import useTranslation, { nameSpaces } from '../../hooks/useTranslation';

const COMPONENT_NAME = 'Country';

const CountrySelect = props => {
  const { isManual, value, onChange, errorAction, geoCode, globalClient, dataInstance, ...extraProps } = props;
  const dispatch = useDispatch();
  const isFetching = useSelector(securitySelectors.selectFetchingCountries);
  const security = useSelector(securitySelectors.selectMe);
  const memberFirmCode = security.memberFirmCode ? security.memberFirmCode : Constants.defaultMemberFirmCode;
  const { t, exists } = useTranslation();

  const memberFirmCountry = useSelector(securitySelectors.selectCountries);

  const countryOptions = memberFirmCountry.map(x => {
    return {
      newCountryName: exists(x.countryCode, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_COUNTRY)
        ? t(x.countryCode, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_COUNTRY)
        : x.countryName,
      ...x,
    };
  });

  useEffect(() => {
    if (isManual && geoCode) {
      dispatch(fetchCountries(memberFirmCode, geoCode, globalClient));
    }
  }, [dispatch, geoCode]);

  const onChangeCountry = countries => {
    onChange(countries, countryOptions);
  };

  return (
    <Select
      type={SelectTypes.SINGLE}
      label={t('Components_CountrySelect_Select_Label')}
      options={countryOptions}
      value={value}
      filtering
      onChange={onChangeCountry}
      loading={isFetching}
      emptyMessage={t('Components_CountrySelect_Select_EmptyMessage')}
      optionValueKey='countryCode'
      optionTextKey='newCountryName'
      dataInstance={`${dataInstance}_${COMPONENT_NAME}`}
      {...extraProps}
    />
  );
};

CountrySelect.defaultProps = {
  errorAction: addGlobalError,
  dataInstance: '',
};

export default CountrySelect;
