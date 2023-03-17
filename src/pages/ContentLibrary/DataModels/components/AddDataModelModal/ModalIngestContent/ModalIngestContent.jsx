import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Spinner, Intent, Select, SelectTypes, AlertHub } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from '../../../../../../hooks/useTranslation';
import { contentLibraryDMSelectors } from '../../../../../../store/contentLibrary/datamodels/selectors';
import { errorsSelectors } from '../../../../../../store/errors/selectors';
import { deleteDMFieldError } from '../../../../../../store/errors/actions';
import { DMFieldContainer } from '../../../DataModelDetail/components/AddDMFieldModal/DMFieldModal.styled';
import PropTypes from 'prop-types';
import { dataModelDetails } from '../../../constants/constants';
import { Header } from '../../../../../../components/InputUploaderModal/components/Header/Header';
import {
  getEnvironments,
  getPublishedDatamodelsByEnv,
} from '../../../../../../store/contentLibrary/datamodels/actions';

const COMPONENT_NAME = 'MODAL_INGEST_CONTENT';
const loadingFallback = 'Loading...';

const ModalIngestContent = forwardRef((props, ref) => {
  const { formValue, formState, handleChanges, handleFormState, handlePrimaryButtonClick } = props;
  const { FROM_ENVIRONMENT, DM_NAME } = dataModelDetails;
  const dispatch = useDispatch();
  const selectDMFieldErrors = useSelector(errorsSelectors.selectDMFieldErrors);
  const allEnvironments = useSelector(contentLibraryDMSelectors.allEnvironments);
  const isFetchingEnvironments = useSelector(contentLibraryDMSelectors.isFetchingEnvironments);
  const environmentContent = useSelector(contentLibraryDMSelectors.environmentContent);
  const isFetchingEnvContent = useSelector(contentLibraryDMSelectors.isFetchingEnvContent);
  const isIngestingDataModel = useSelector(contentLibraryDMSelectors.isIngestingDataModel);
  const [titleText, setTitleText] = useState('');
  const { t } = useTranslation();

  const isValidRequiredField = value => !!(value && value.length);

  const setNewValue = (key, newValue) => {
    const newFormValue = { ...formValue, [key]: newValue };
    handleChanges(newFormValue);

    const { fromEnvironment, dmName } = newFormValue;
    const formValues = {
      [FROM_ENVIRONMENT]: ((fromEnvironment && fromEnvironment.length > 0 && fromEnvironment[0].name) || '').trim(),
      [DM_NAME]: ((dmName && dmName.length > 0 && dmName[0].nameTech) || '').trim(),
    };
    if (key === FROM_ENVIRONMENT && formValues[FROM_ENVIRONMENT] !== '') {
      dispatch(getPublishedDatamodelsByEnv(formValues[FROM_ENVIRONMENT]));
    }

    handleFormState(
      formValues,
      !isValidRequiredField(formValues[FROM_ENVIRONMENT]),
      !isValidRequiredField(formValues[DM_NAME])
    );
  };

  // Consider Linking environments and published models to data source, add validations, process
  // getEnvironments,
  // getPublishedDatamodelsByEnv,

  //  getEnvironments
  useEffect(() => {
    dispatch(getEnvironments());
  }, [dispatch]);

  useImperativeHandle(ref, () => ({
    submit() {
      handlePrimaryButtonClick();
    },
  }));

  const showErrors = {
    [FROM_ENVIRONMENT]: !isValidRequiredField(formState.value[FROM_ENVIRONMENT]) && formState.submitted,
    [DM_NAME]: !isValidRequiredField(formState.value[DM_NAME]) && formState.submitted,
  };

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const getFieldModal = () => {
    const envError = showErrors[FROM_ENVIRONMENT] ? t('Components_Modal_Ingest_Content_Env_Validation_Error') : '';
    const dmNameError = showErrors[DM_NAME] ? t('Components_Modal_Ingest_Content_DMName_Validation_Error') : '';
    let ingestingLabel = t('Components_Modal_Ingest_Content_DM_Ingesting') || loadingFallback;
    const environmentsLabel = t('Components_Modal_Ingest_Content_DM_Environments_Loading') || loadingFallback;
    const environmentContentsLabel =
      t('Components_Modal_Ingest_Content_DM_Environment_Contents_Loading') || loadingFallback;
    ingestingLabel = isFetchingEnvironments ? environmentsLabel : ingestingLabel;
    ingestingLabel = isFetchingEnvContent ? environmentContentsLabel : ingestingLabel;

    return (
      <Spinner spinning={isFetchingEnvironments || isFetchingEnvContent || isIngestingDataModel} label={ingestingLabel}>
        <DMFieldContainer>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_Modal_Ingest_Content_From_Environment_Label')}
            hint={showErrors[DM_NAME] ? t('Components_Modal_Ingest_Content_Env_Validation_Error') : ''}
            intent={envError ? Intent.ERROR : ''}
            options={allEnvironments}
            optionValueKey='name'
            optionTextKey='name'
            filtering
            value={formValue[FROM_ENVIRONMENT] || []}
            onChange={e =>
              setNewValue(
                FROM_ENVIRONMENT,
                Object.keys(e).map(key => e[key])
              )
            }
            emptyMessage={t('Components_Modal_Ingest_Content_Environment_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-env`}
            disabled={allEnvironments.length === 0}
          />
        </DMFieldContainer>
        <DMFieldContainer>
          <Select
            type={SelectTypes.SINGLE}
            label={t('Components_Modal_Ingest_Content_DMName_Label')}
            hint={showErrors[DM_NAME] ? t('Components_Modal_Ingest_Content_DMName_Validation_Error') : ''}
            intent={dmNameError ? Intent.ERROR : ''}
            options={environmentContent}
            filtering
            value={formValue[DM_NAME] || []}
            optionValueKey='nameTech'
            optionTextKey='nameTech'
            onChange={e =>
              setNewValue(
                DM_NAME,
                Object.keys(e).map(key => e[key])
              )
            }
            emptyMessage={t('Components_Modal_Ingest_Content_DMName_Placeholder')}
            dataInstance={`${COMPONENT_NAME}-dmmodel`}
            disabled={
              !(formValue[FROM_ENVIRONMENT] && formValue[FROM_ENVIRONMENT].length > 0) ||
              environmentContent.length === 0
            }
          />
        </DMFieldContainer>
      </Spinner>
    );
  };

  const onErrorClose = errorKey => {
    dispatch(deleteDMFieldError(errorKey));
  };

  useEffect(() => {
    setTitleText(t('Components_ModalIngestContent_IngestDM'));
  });

  return (
    <>
      <Header titleText={titleText} pb={3} />
      <AlertHub alerts={selectDMFieldErrors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}-AlertHub`} />
      {getFieldModal()}
    </>
  );
});

ModalIngestContent.propTypes = {
  formState: PropTypes.shape({}).isRequired,
  formValue: PropTypes.shape({}).isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleFormState: PropTypes.func.isRequired,
};

export default ModalIngestContent;
