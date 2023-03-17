import { Box, Checkbox, Input, Intent, Select, SelectTypes, Spinner, Text, TextTypes } from 'cortex-look-book';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex } from 'reflexbox';
import useTranslation from '../../../../hooks/useTranslation';
import { getTemplatePropertiesList } from '../../../../store/bundles/actions';
import { BundlesActionTypes } from '../../../../store/bundles/actionTypes';
import { bundlesSelectors } from '../../../../store/bundles/selectors';
import { ADD_CONNECTION_TRANSLATION_KEY, VALUE_TYPES } from './constants';

const Parameters = ({
  selectedConnectorTemplate,
  showErrors,
  setParameters,
  clientCanPopulate,
  connectorParameters,
  setWaitForClient,
  isEdit,
  isWaitingforClientStatus,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const properties = useSelector(bundlesSelectors.selectTemplatePropertiesList);
  const isFetching = useSelector(bundlesSelectors.selectIsFetchingTemplatePropertiesList);

  const [isFormReady, setIsFormReady] = useState(false);
  const [clientWillPopulate, setClientWillPopulate] = useState(false);
  const [formState, setFormState] = useState(null);
  const [errors, setErrors] = useState(null);
  const [clientWaitingStatus, setClientWaitingStatus] = useState(false);
  const formFields = formState ? Object.keys(formState).map(fieldKey => formState[fieldKey]) : [];

  const cleanAll = () => {
    setIsFormReady(false);
    setFormState(null);
    setErrors(null);
    setClientWillPopulate(false);
    setWaitForClient(false);
    setClientWaitingStatus(false);
    dispatch({ type: BundlesActionTypes.CLEAN_TEMPLATE_PROPERTIES_LIST });
  };

  useEffect(() => {
    return cleanAll;
  }, []);

  useEffect(() => {
    if (dispatch) {
      if (selectedConnectorTemplate && selectedConnectorTemplate.id) {
        dispatch(getTemplatePropertiesList(selectedConnectorTemplate.id));
      } else {
        cleanAll();
      }
    }
    setClientWaitingStatus(isWaitingforClientStatus);
  }, [dispatch, selectedConnectorTemplate]);

  const getValueByType = (value, type) => {
    switch (type) {
      case VALUE_TYPES.BOOLEAN:
        return value === 'true';
      case VALUE_TYPES.NUMBER:
        return value ? +String(value).match(/\d+/).join('') : 0;
      default:
        return value;
    }
  };

  const getPropertyValue = property => {
    if (isEdit && !clientWaitingStatus) {
      return getValueByType(connectorParameters[property.id], property.valueType);
    }

    return getValueByType(property.defaultValue, property.valueType);
  };

  useEffect(() => {
    let form = {};
    let formErrors = {};
    if (properties && properties.items) {
      properties.items.forEach(item => {
        form = {
          ...form,
          [`property-${item.id}`]: {
            value: getPropertyValue(item),
            hidden: item.controlType === 'hidden',
            data: item,
          },
        };

        formErrors = {
          ...formErrors,
          [`property-${item.id}`]: null,
        };
      });

      setFormState(form);
      setErrors(formErrors);
      setIsFormReady(true);
    }
  }, [properties]);

  const checkErrors = (form, isClientPopulate, clientWaitStatus) => {
    let hasErrors = false;
    if (!isClientPopulate && !clientWaitStatus) {
      let newErrorsState = {};
      Object.keys(form).forEach(fieldId => {
        const fieldData = form[fieldId];
        let error = null;
        if (
          fieldData.data.valueType !== VALUE_TYPES.BOOLEAN &&
          fieldData.data.valueType !== VALUE_TYPES.NUMBER &&
          fieldData.data.isRequired &&
          !fieldData.value
        ) {
          hasErrors = true;
          error = t(`${ADD_CONNECTION_TRANSLATION_KEY}Parameters_EmptyFieldError`);
        }
        newErrorsState = {
          ...newErrorsState,
          [fieldId]: error,
        };
      });
      setErrors(newErrorsState);
    }

    return hasErrors;
  };

  useEffect(() => {
    if (isFormReady) {
      const hasErrors = checkErrors(formState, clientWillPopulate, clientWaitingStatus);
      setParameters({
        items: formFields,
        hasErrors,
        clientWillPopulate,
        clientWaitingStatus,
      });
    }
  }, [formState, clientWillPopulate, clientWaitingStatus]);

  const onChangeInput = (formId, valueType) => {
    return event => {
      const currentState = formState[formId];
      const newState = {
        ...currentState,
        value: getValueByType(event.target.value, valueType),
      };
      setFormState({
        ...formState,
        [formId]: newState,
      });
    };
  };

  const onChangeSelect = formId => {
    return value => {
      const currentState = formState[formId];
      const newState = {
        ...currentState,
        value: value.length > 0 ? value[0].value : null,
      };
      setFormState({
        ...formState,
        [formId]: newState,
      });
    };
  };

  const onChangeCheckbox = formId => {
    return event => {
      const currentState = formState[formId];
      const newState = {
        ...currentState,
        value: event.target.checked,
      };
      setFormState({
        ...formState,
        [formId]: newState,
      });
    };
  };

  const getInput = (formData, index) => {
    const field = formData.data;
    let input;
    const formId = `property-${field.id}`;
    switch (field.controlType) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'hidden':
        input = (
          <Input
            type={field.controlType}
            label={!formData.hidden ? field.label : null}
            name={field.label}
            required={clientCanPopulate ? field.isRequired : false} // In PROD this field is always empty, if the connection type is TRANSFER, it doesnt need to be required
            value={formData.value !== null ? formData.value : ''}
            width='100%'
            onChange={onChangeInput(formId, field.valueType)}
            intent={showErrors && !formData.hidden && errors[formId] ? Intent.ERROR : null}
            hint={showErrors && !formData.hidden && errors[formId] ? errors[formId] : null}
            disabled={clientWillPopulate || clientWaitingStatus}
          />
        );
        break;
      case 'select':
        input = (
          <Select
            label={field.label}
            type={SelectTypes.SINGLE}
            options={field.valueOptions}
            optionValueKey='value'
            optionTextKey='name'
            value={
              formData.value && formData.value !== ''
                ? field.valueOptions.filter(option => option.value === formData.value)
                : []
            }
            required={field.isRequired}
            filtering={false}
            onChange={onChangeSelect(formId)}
            customRenderSelected={(option, i) => (
              <Text key={i} type={TextTypes.BODY} color='black'>
                {option.name}
              </Text>
            )}
            intent={showErrors && errors[formId] ? Intent.ERROR : null}
            hint={showErrors && errors[formId] ? errors[formId] : null}
            width='100%'
            disabled={clientWillPopulate || clientWaitingStatus}
          />
        );
        break;
      case 'checkbox':
        const initialValue = formData.value === 'true' || formData.value === true;
        input = (
          <Checkbox
            label={field.label}
            isChecked={initialValue}
            onChange={onChangeCheckbox(formId)}
            disabled={clientWillPopulate || clientWaitingStatus}
          />
        );
        break;
      default:
        break;
    }

    if (formData.hidden) {
      return (
        <Flex key={index} width='0' height='0'>
          {input}
        </Flex>
      );
    }

    return (
      <Flex key={index} alignItems='center' minWidth='calc( 50% - 8px )' mr={index % 2 === 0 ? '16px' : 0} mt={2}>
        {input}
      </Flex>
    );
  };

  const areAllHidden = () => {
    let allHidden = false;
    if (properties && properties.items) {
      properties.items.forEach(item => {
        allHidden = allHidden || item.controlType !== 'hidden';
      });
    }

    return allHidden;
  };

  return (
    <Spinner spinning={isFetching} my='30px'>
      {isFormReady && areAllHidden() && (
        <Box>
          <Flex>
            <Text type={TextTypes.H2} fontWeight='l'>
              {t(`${ADD_CONNECTION_TRANSLATION_KEY}Parameters_Title`)}
            </Text>
          </Flex>
          {clientCanPopulate && (
            <Flex my={3}>
              <Checkbox
                label={t(`${ADD_CONNECTION_TRANSLATION_KEY}Parameters_ClientWillPopulate`)}
                onChange={event => {
                  setClientWillPopulate(event.target.checked);
                  setWaitForClient(event.target.checked);
                  setClientWaitingStatus(event.target.checked);
                }}
                isChecked={clientWillPopulate || clientWaitingStatus}
              />
            </Flex>
          )}
        </Box>
      )}
      <Flex width='100%' flexWrap='wrap'>
        {isFormReady && formFields.filter(field => field.hidden).map((field, index) => getInput(field, index))}
        {isFormReady && formFields.filter(field => !field.hidden).map((field, index) => getInput(field, index))}
      </Flex>
    </Spinner>
  );
};

export default Parameters;
