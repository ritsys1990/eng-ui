import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Box, Input, Intent, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import { COMPONENT_NAME, FormErrorModel } from './constants/constants';
import useTranslation from '../../../../../hooks/useTranslation';
import { addClientDomain, getClientById } from '../../../../../store/client/actions';
import { getErrors } from './utils/utils';

const AddClientDomain = forwardRef((props, ref) => {
  const { client, handleClose } = props;
  const clientId = client?.id;
  const dispatch = useDispatch();
  const [showErrors, setShowErrors] = useState(false);
  const [domainName, setDomainName] = useState('');
  const { t } = useTranslation();

  const hasErrors = () => {
    const errors = getErrors(FormErrorModel, domainName, t, client);

    return errors.domainName;
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }
    dispatch(addClientDomain(clientId, domainName)).then(() => {
      dispatch(getClientById(clientId));
    });
    handleClose();
  };

  const handleDomainChange = e => {
    setDomainName(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    submit() {
      handleSubmit();
    },
  }));

  const errors = showErrors ? getErrors(FormErrorModel, domainName, t, client) : { ...FormErrorModel };

  return (
    <Spinner spinning={false} dataInstance={`${COMPONENT_NAME}-Spinner`}>
      <Box width='100%'>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step1_Add_Client_Domain')}
        </Text>
      </Box>

      <Box mb={12}>
        <Input
          label={t('Pages_Client_Setup_Step1_Domain_Name')}
          value={domainName}
          placeholder={t('Pages_Client_Setup_Step1__Domain_Placeholder')}
          dataInstance={`${COMPONENT_NAME}_Domain_Name`}
          onChange={handleDomainChange}
          hint={errors.domainName}
          intent={errors.domainName ? Intent.ERROR : null}
        />
      </Box>
    </Spinner>
  );
});

export default AddClientDomain;
