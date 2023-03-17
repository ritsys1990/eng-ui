import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Spinner,
  Input,
  Textarea,
  Intent,
  Box,
  Toggle,
  Flex,
  TextTypes,
  Text,
  ModalSizes,
} from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { CLPipelinesSelectors } from '../../../../../store/contentLibrary/pipelines/selectors';
import { Header } from '../../../../../components/InputUploaderModal/components/Header/Header';
import {
  PIPELINE_DETAILS_REVIEW,
  PIPELINE_REVIEW_INITIAL_STATE,
  PIPELINE_REVIEW_FORM_STATE,
} from '../../constants/constants';
import { submitPipeline } from '../../../../../store/contentLibrary/pipelines/actions';
import ClientTable from '../../../../../components/ClientTable/ClientTable';

export const COMPONENT_NAME = 'CL_PIPELINES_SUBMIT_PIPELINE';

// eslint-disable-next-line sonarjs/cognitive-complexity
const PipelineSubmitFormModal = ({ isOpen, onClose, formValueProp }) => {
  const { t } = useTranslation();
  const isCLPipelineUpdating = useSelector(CLPipelinesSelectors.isCLPipelineUpdating);
  const [formValue, setFormValue] = useState(PIPELINE_REVIEW_INITIAL_STATE);
  const [formState, setFormState] = useState(PIPELINE_REVIEW_FORM_STATE);
  const [toggle, setToggle] = useState(false);
  const [selectedClients, setSelectedClients] = useState(
    PIPELINE_REVIEW_INITIAL_STATE[PIPELINE_DETAILS_REVIEW.CLIENTS]
  );
  const [showErrors, setShowErrors] = useState({});
  const dispatch = useDispatch();

  const isValidRequiredField = value => !!(value && value.length);

  const handleOnClose = () => {
    onClose();
  };

  const handleUpdateModalSubmit = () => {
    setShowErrors({
      [PIPELINE_DETAILS_REVIEW.NAME]: !isValidRequiredField(formState.value[PIPELINE_DETAILS_REVIEW.NAME]),
    });
    if (!formState.invalid) {
      dispatch(submitPipeline(formState.value));
    }
  };

  const nameError = showErrors[PIPELINE_DETAILS_REVIEW.NAME] ? t('Components_AddNePipelineModal_Validation_Error') : '';

  const handleFormState = (value, invalid) => {
    setFormState({
      ...formState,
      invalid,
      value,
    });
  };

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };
    setFormValue(newFormValue);

    const { Name, EngagementId, AdditionalComment, Id, ClientIds } = newFormValue;
    const formValues = {
      [PIPELINE_DETAILS_REVIEW.NAME]: (Name || '').trim(),
      [PIPELINE_DETAILS_REVIEW.ENGAGEMENT_ID]: (EngagementId || '').trim(),
      [PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT]: (AdditionalComment || '').trim(),
      [PIPELINE_DETAILS_REVIEW.ID]: (Id || '').trim(),
      [PIPELINE_DETAILS_REVIEW.CLIENTS]: ClientIds || [],
    };

    handleFormState(formValues, !isValidRequiredField(formValues[PIPELINE_DETAILS_REVIEW.NAME]));
  };

  useEffect(() => {
    if (formValueProp) {
      const initialPipelineInfo = {
        [PIPELINE_DETAILS_REVIEW.NAME]: formValueProp.pipelineName,
        [PIPELINE_DETAILS_REVIEW.CLIENTS]: formValueProp.clients,
        [PIPELINE_DETAILS_REVIEW.ID]: formValueProp.id,
      };
      setFormValue({
        ...PIPELINE_REVIEW_INITIAL_STATE,
        ...initialPipelineInfo,
        ...formValueProp,
      });
      handleFormState(initialPipelineInfo, false);
      setSelectedClients(formValueProp.clients.map(client => client.id));
    }
  }, [formValueProp]);

  useEffect(() => {
    setToggle(!!formValue[PIPELINE_DETAILS_REVIEW.CLIENTS].length);
  }, [formValue]);

  useEffect(() => {
    if (selectedClients) {
      setNewValue(PIPELINE_DETAILS_REVIEW.CLIENTS, selectedClients);
    }
  }, [selectedClients]);

  const onChangeToggle = () => {
    if (toggle) {
      setSelectedClients([]);
    }
    setToggle(!toggle);
  };

  const onClientSelect = (value, isChecked) => {
    if (isChecked) {
      setSelectedClients(selectedClients.filter(client => client !== value));
    } else {
      setSelectedClients(selectedClients.concat([value]));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      onClickOutside={handleOnClose}
      size={ModalSizes.SMALL}
      onPrimaryButtonClick={handleUpdateModalSubmit}
      onSecondaryButtonClick={handleOnClose}
      primaryButtonText={t('Pages_Content_Library_SubmitForReview')}
      secondaryButtonText={t('Close', 'General_')}
      dataInstance={`${COMPONENT_NAME}-SubmitCLPipeline`}
      disablePrimaryButton={isCLPipelineUpdating}
      disableSecondaryButton={isCLPipelineUpdating}
    >
      <Spinner spinning={isCLPipelineUpdating}>
        <Header titleText={t('Pages_Content_Library_SubmitForReview')} pb={3} />
        <Box pb={10}>
          <Input
            required
            label={t('Pages_Content_Library_Pipeline_Fields_Headers_Name')}
            value={formValue[PIPELINE_DETAILS_REVIEW.NAME] || ''}
            hint={nameError}
            intent={nameError ? Intent.ERROR : ''}
            onChange={e => setNewValue(PIPELINE_DETAILS_REVIEW.NAME, e.currentTarget.value)}
            placeholder={t('Pages_Content_Library_Pipeline_Fields_Headers_Name_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldName`}
          />
        </Box>
        <Box pb={10}>
          <Textarea
            value={formValue[PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT] || []}
            onChange={e => setNewValue(PIPELINE_DETAILS_REVIEW.ADDITIONAL_COMMENT, e.currentTarget.value)}
            label={t('Pages_Content_Library_Pipeline_Fields_Headers_AdditionalComment')}
            placeholder={t('Pages_Content_Library_Pipeline_Fields_Headers_AdditionalComment_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-FieldAdditionalComment`}
          />
        </Box>
        <Box pb={10}>
          <Flex alignItems='center'>
            <Text type={TextTypes.H4} fontWeight='m' mr={2}>
              {t('Pages_Content_Library_Pipeline_Fields_Headers_AllClients')}
            </Text>
            <Toggle value={toggle} onChange={onChangeToggle} dataInstance={`${COMPONENT_NAME}`} />
            <Text type={TextTypes.H4} fontWeight='m' ml={2}>
              {t('Pages_Content_Library_Pipeline_Fields_Headers_SpecificClients')}
            </Text>
          </Flex>
        </Box>
        {toggle && (
          <ClientTable
            onClientSelect={onClientSelect}
            selectedClients={selectedClients}
            dataInstance={`${COMPONENT_NAME}-clients`}
          />
        )}
      </Spinner>
    </Modal>
  );
};

export default PipelineSubmitFormModal;
