import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ComponentNames, TRANSLATION_KEY, DatabaseTypes } from './constants';
import { Modal, Spinner, Input, Select, SelectTypes, Text, TextTypes, Intent, ModalSizes } from 'cortex-look-book';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { configureDataSourceExtractionScript } from '../../../../store/engagement/actions';
import { clientSelectors } from '../../../../store/client/selectors';
import { getClientDSConnections } from '../../../../store/client/actions';

const { EXTRACTION_SCRIPT_MODAL: COMPONENT_NAME } = ComponentNames;

const getDatabaseOptions = t => {
  return [
    {
      id: DatabaseTypes.ORACLE,
      name: t(`${TRANSLATION_KEY}ExtrDBM_Oracle`),
    },
    {
      id: DatabaseTypes.MSSQL,
      name: t(`${TRANSLATION_KEY}ExtrDBM_MSSQL`),
    },
    {
      id: DatabaseTypes.SAP,
      name: t(`${TRANSLATION_KEY}ExtrDBM_SAP`),
    },
  ];
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ExtractionScriptModal = ({ dataSourceId, extractionScriptData, isOpen, handleClose, isEdit }) => {
  const [schemaName, setSchemaName] = useState('');
  const [databaseType, setDatabaseType] = useState([]);
  const [databaseOptions, setDatabaseOptions] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const client = useSelector(clientSelectors.selectClient);
  const isConfiguringDataSourceExtractionScript = useSelector(
    engagementSelectors.selectIsConfiguringDataSourceExtractionScript
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const validateForm = () => {
    const errors = {};

    if (schemaName.length === 0) {
      errors.schemaName = t(`${TRANSLATION_KEY}ExtrForm_NameError`);
    }

    if (databaseType.length === 0) {
      errors.databaseType = t(`${TRANSLATION_KEY}ExtrForm_DatabaseError`);
    }

    return errors;
  };

  const doesFormHaveErrors = value => Object.values(value).some(x => x !== null && x !== '');

  const handlePrimaryButtonClick = () => {
    const err = validateForm();
    if (doesFormHaveErrors(err)) {
      setShowErrors(true);
    } else {
      dispatch(configureDataSourceExtractionScript(dataSourceId, schemaName, databaseType[0]?.id)).then(() => {
        dispatch(getClientDSConnections(client?.id));
        handleClose();
      });
    }
  };

  useEffect(() => {
    const options = getDatabaseOptions(t);

    setDatabaseOptions(options);

    if (isEdit) {
      const defaultOption = options.find(option => option.id === extractionScriptData?.databaseType) || options[0];
      setSchemaName(extractionScriptData?.schemaName || '');
      setDatabaseType([defaultOption]);
    } else {
      setDatabaseType([options[0]]);
      setSchemaName('');
    }
  }, [t, extractionScriptData, isEdit, isOpen]);

  const errors = showErrors ? validateForm() : {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={ModalSizes.MEDIUM}
      primaryButtonText={t(`${TRANSLATION_KEY}ExtrForm_PrimaryButton`)}
      onPrimaryButtonClick={handlePrimaryButtonClick}
      disablePrimaryButton={isConfiguringDataSourceExtractionScript}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onSecondaryButtonClick={handleClose}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isConfiguringDataSourceExtractionScript}>
        <Text type={TextTypes.H2} fontWeight='l' mb={8}>
          {t(`${TRANSLATION_KEY}ExtrForm_Title`)}
        </Text>
        <Input
          label={t(`${TRANSLATION_KEY}ExtrForm_SchemaName`)}
          value={schemaName}
          onChange={e => setSchemaName(e.target.value)}
          placeholder={t(`${TRANSLATION_KEY}ExtrForm_SchemaName_Placeholder`)}
          dataInstance={`${COMPONENT_NAME}-SchemaName`}
          hint={errors?.schemaName}
          intent={errors?.schemaName ? Intent.ERROR : null}
          mb={9}
        />
        <Select
          type={SelectTypes.SINGLE}
          label={t(`${TRANSLATION_KEY}ExtrForm_DatabaseType`)}
          options={databaseOptions}
          value={databaseType}
          onChange={value => setDatabaseType(value)}
          optionValueKey='id'
          optionTextKey='name'
          hint={errors?.databaseType}
          intent={errors?.databaseType ? Intent.ERROR : null}
          customRenderSelected={(option, index) => (
            <Text key={index} type={TextTypes.BODY} color='black'>
              {option.name}
            </Text>
          )}
          dataInstance={`${COMPONENT_NAME}-DatabaseType`}
          mb={12}
        />
      </Spinner>
    </Modal>
  );
};

ExtractionScriptModal.propTypes = {
  /**
   * Id of the datasource of the extraction script
   */
  dataSourceId: PropTypes.string.isRequired,

  /**
   * Whether the modal is open or not
   */
  isOpen: PropTypes.bool.isRequired,

  /**
   * Callback that should set the value of isOpen to false
   */
  handleClose: PropTypes.func.isRequired,

  /**
   * Whether the user is performing an edit action
   */
  isEdit: PropTypes.bool,

  /**
   * Data of the currently existing extraction script
   */
  extractionScriptData: PropTypes.object,
};

ExtractionScriptModal.defaultProps = {
  isEdit: false,
  extractionScriptData: null,
};

export default ExtractionScriptModal;
