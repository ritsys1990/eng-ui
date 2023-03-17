import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectTypes } from 'cortex-look-book';
import { addGlobalError } from '../../store/errors/actions';
import { clientSelectors } from '../../store/client/selectors';
import useTranslation from '../../hooks/useTranslation';
import useDebounce from '../../hooks/useDebounce';
import { getMatClientsSearch } from '../../store/client/actions';

const COMPONENT_NAME = 'Client';
const RESULTS_LIMIT = 15;

const ClientSelect = props => {
  const {
    memberFirmCode,
    isGlobalClientPermission,
    value,
    onChange,
    errorAction,
    dataInstance,
    showLabel,
    ...extraProps
  } = props;

  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 500);
  const isFetching = useSelector(clientSelectors.selectFetchingMatSearch);
  const clients = useSelector(clientSelectors.selectMatSearch);
  const dispatch = useDispatch();

  const handleInputChange = text => {
    setInputValue(text);
  };

  useEffect(() => {
    if (debouncedInputValue.length > 1) {
      dispatch(
        getMatClientsSearch(debouncedInputValue, RESULTS_LIMIT, memberFirmCode, isGlobalClientPermission, errorAction)
      );
    }
  }, [dispatch, debouncedInputValue, memberFirmCode, isGlobalClientPermission]);

  return (
    <Select
      type={SelectTypes.AUTO_COMPLETE}
      label={showLabel ? t('Components_ClientSelect_Select_Label') : null}
      options={clients}
      value={value}
      filtering={false}
      onChange={onChange}
      onInputChange={handleInputChange}
      loading={isFetching}
      emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
      optionValueKey='id'
      optionTextKey='name'
      dataInstance={`${COMPONENT_NAME}`}
      {...extraProps}
    />
  );
};

ClientSelect.defaultProps = {
  errorAction: addGlobalError,
  dataInstance: '',
  showLabel: true,
};

export default ClientSelect;
