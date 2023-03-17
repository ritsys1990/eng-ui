import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Icon,
  Modal,
  ModalSizes,
  Flex,
  Box,
  Text,
  TextTypes,
  Intent,
  Select,
  SelectTypes,
  Input,
  Radio,
  IconTypes,
  Tooltip,
  TooltipPosition,
  Alert,
  Spinner,
} from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY as BASE_TRANSLATION_KEY, DataSourceTypes, TransferModes } from './constants';
import useTranslation from '../../../../hooks/useTranslation';
import { clientSelectors } from '../../../../store/client/selectors';
import { bundlesSelectors } from '../../../../store/bundles/selectors';
import {
  addDataSource,
  addDataSourceReset,
  getClientDSConnections,
  updateDataSource,
} from '../../../../store/client/actions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTags, getSourceSystems } from '../../../../store/bundles/actions';
import { cloneDeep } from 'lodash';

const { MANAGE_DATASOURCE: COMPONENT_NAME } = ComponentNames;
const TRANSLATION_KEY = `${BASE_TRANSLATION_KEY}Manager_`;

const InitFormState = {
  name: { value: '', error: null, required: true },
  type: { value: DataSourceTypes.CLIENT_SOURCE, error: null, required: true },
  transferMode: { value: TransferModes.SECURE_AGENT, error: null, required: true },
  sourceType: { value: [], error: null, required: true },
  sourceVersion: { value: [], error: null, required: true },
  entities: { value: [], error: null, required: true },
  modules: { value: [], error: null, required: false },
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const DataSourceManagerModal = ({ isOpen, onClose, onDidClose, dataSource }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const client = useSelector(clientSelectors.selectClient);
  // Lists
  const [types, setTypes] = useState(null);
  const [transferModes, setTransferModes] = useState(null);
  const [formState, setFormState] = useState(cloneDeep(InitFormState));
  const sourceSystems = useSelector(bundlesSelectors.selectSourceSystems);
  const isFetchingSourceSystems = useSelector(bundlesSelectors.selectIsFetchingSourceSystems);
  const isFetchingTags = useSelector(bundlesSelectors.selectFetchingTags);
  const tagList = useSelector(bundlesSelectors.selectTagsList)?.items;
  const [sourceSystemList, setSourceSystemList] = useState([]);
  const [sourceVersionList, setSourceVersionList] = useState([]);
  const [entityList, setEntityList] = useState([]);
  // Actions
  const isSavingDataSource = useSelector(clientSelectors.selectIsSavingDataSource);
  const saveDataSourceError = useSelector(clientSelectors.selectSaveDataSourceError);

  useEffect(() => {
    dispatch(fetchAllTags());
    dispatch(getSourceSystems());

    return () => {
      dispatch(addDataSourceReset());
    };
  }, []);

  useEffect(() => {
    setTypes([
      {
        id: DataSourceTypes.CLIENT_SOURCE,
        name: t(`${TRANSLATION_KEY}Types_ClientSource_Name`),
        description: t(`${TRANSLATION_KEY}Types_ClientSource_Desc`),
      },
      {
        id: DataSourceTypes.CLIENT_SCRIPT,
        name: t(`${TRANSLATION_KEY}Types_ClientScript_Name`),
        description: t(`${TRANSLATION_KEY}Types_ClientScript_Desc`),
      },
      {
        id: DataSourceTypes.CLIENT_FS,
        name: t(`${TRANSLATION_KEY}Types_ClientFS_Name`),
        description: t(`${TRANSLATION_KEY}Types_ClientFS_Desc`),
      },
      {
        id: DataSourceTypes.THIRD_PARTY,
        name: t(`${TRANSLATION_KEY}Types_ThirdParty_Name`),
        description: t(`${TRANSLATION_KEY}Types_ThirdParty_Desc`),
      },
    ]);

    setTransferModes([
      {
        id: TransferModes.SECURE_AGENT,
        name: t(`${TRANSLATION_KEY}TransferModes_SecureAgent_Name`),
        description: t(`${TRANSLATION_KEY}TransferModes_SecureAgent_Desc`),
      },
      {
        id: TransferModes.MANUAL,
        name: t(`${TRANSLATION_KEY}TransferModes_Manual_Name`),
        description: t(`${TRANSLATION_KEY}TransferModes_Manual_Desc`),
      },
    ]);
  }, [t]);

  useEffect(() => {
    const list = sourceSystems?.items?.filter(x => x.versions?.length > 0);
    setSourceSystemList(list);
  }, [sourceSystems, setSourceSystemList]);

  useEffect(() => {
    const list = client?.entities?.filter(entity => entity.subOrgId);
    setEntityList(list);
  }, [client, setEntityList]);

  useEffect(() => {
    if (formState.sourceVersion.hidden) {
      return;
    }
    const newState = { ...formState, sourceVersion: { ...InitFormState.sourceVersion } };
    setSourceVersionList(formState.sourceType.value?.[0]?.versions);
    setFormState(newState);
  }, [formState.sourceType]);

  const updateFieldState = useCallback(
    (key, value) => {
      const newState = { ...formState, [key]: { ...formState[key], value, error: null } };
      setFormState(newState);
    },
    [formState, setFormState]
  );

  const getTagsSelected = (selectedTagIds, tags) => {
    const arr = [];

    if (selectedTagIds && selectedTagIds.length && tags && tags.length) {
      tags.forEach(item => {
        const foundSelectedTags = item.tags.filter(tag => selectedTagIds.indexOf(tag.id) !== -1);

        arr.push(...foundSelectedTags);
      });
    }

    return arr;
  };

  const updateDisplayedFields = (dataSourceType, currentFormState) => {
    const newFormState = { ...currentFormState };

    switch (dataSourceType) {
      case DataSourceTypes.CLIENT_FS:
        newFormState.sourceType = { ...InitFormState.sourceType, required: false };
        newFormState.sourceVersion = { ...InitFormState.sourceVersion, hidden: true };
        newFormState.modules = { ...InitFormState.modules, hidden: true };
        break;
      case DataSourceTypes.THIRD_PARTY:
        newFormState.sourceType = { ...InitFormState.sourceType };
        newFormState.sourceVersion = { ...InitFormState.sourceVersion };
        newFormState.modules = { ...InitFormState.modules, hidden: true };
        break;
      case DataSourceTypes.CLIENT_SCRIPT:
        newFormState.transferMode.value = TransferModes.MANUAL;
      /* falls through */
      default:
        if (formState.sourceType.hidden || !formState.sourceType.required) {
          newFormState.sourceType = { ...InitFormState.sourceType };
        }
        if (formState.sourceVersion.hidden) {
          newFormState.sourceVersion = { ...InitFormState.sourceVersion };
        }
        if (formState.modules.hidden) {
          newFormState.modules = { ...InitFormState.modules };
        }
    }

    return newFormState;
  };

  useEffect(() => {
    if (dataSource && sourceSystemList?.length > 0) {
      const newFormState = updateDisplayedFields(dataSource.type, formState);
      newFormState.name.value = dataSource.name;
      newFormState.type.value = dataSource.type;
      newFormState.transferMode.value = dataSource.fileTransferMode;
      const sourceType = sourceSystemList?.filter(source => source.name === dataSource.sourceName);
      newFormState.sourceType.value = sourceType;
      newFormState.sourceVersion.value = sourceType[0]?.versions?.filter(version => version.id === dataSource.sourceId);
      newFormState.entities.value = dataSource.entities;
      newFormState.modules.value = getTagsSelected(dataSource.moduleIds, tagList);
      setFormState(newFormState);
    }
  }, [dataSource, sourceSystemList]);

  useEffect(() => {
    const newFormState = updateDisplayedFields(formState?.type?.value, formState);

    setFormState(newFormState);
  }, [formState.type]);

  const saveDataSourceCallback = useCallback(
    response => {
      if (response) {
        dispatch(getClientDSConnections(client.id));
        onClose?.();
      }
    },
    [dispatch, onClose]
  );

  const handleSubmit = useCallback(async () => {
    const newState = { ...formState };
    let isValid = true;
    Object.keys(newState).forEach(key => {
      const field = newState[key];
      if (field.hidden) {
        return;
      }
      const isRequired = field.required && !field.hidden;
      field.error = (!isRequired || field.value?.length > 0) > 0 ? null : t(`${TRANSLATION_KEY}Validation_Required`);
      isValid = isValid ? !field.error : isValid;
    });
    setFormState(newState);
    if (!isValid) {
      return;
    }

    const payload = {
      clientId: client.id,
      entityIds: formState.entities.value?.map(x => x.id),
      fileTransferMode: formState.transferMode.value,
      moduleIds: formState.modules.value?.map(x => x.id),
      name: formState.name.value,
      sourceId: formState.sourceVersion.value[0]?.id || null,
      type: formState.type.value,
    };

    if (!dataSource) {
      // Add mode
      dispatch(addDataSource(payload)).then(saveDataSourceCallback);
    } else {
      // Update mode
      dispatch(updateDataSource({ ...payload, id: dataSource.id })).then(saveDataSourceCallback);
    }
  }, [formState, setFormState, onClose, t]);

  const availableTransferModes = useMemo(
    () =>
      transferModes?.filter(
        x => !(x.id === TransferModes.SECURE_AGENT && formState.type.value === DataSourceTypes.CLIENT_SCRIPT)
      ),
    [formState.type, transferModes]
  );

  const handleNameChange = useCallback(e => updateFieldState('name', e.target.value), [updateFieldState]);

  const handleTypeChange = useCallback(value => updateFieldState('type', value), [updateFieldState]);

  const handleTransferModeChange = useCallback(value => updateFieldState('transferMode', value), [updateFieldState]);

  const handleSourceTypeChange = useCallback(value => updateFieldState('sourceType', value), [updateFieldState]);

  const handleSourceVersionChange = useCallback(value => updateFieldState('sourceVersion', value), [updateFieldState]);

  const handleEntitiesChange = useCallback(value => updateFieldState('entities', value), [updateFieldState]);

  const handleModulesChange = useCallback(value => updateFieldState('modules', value), [updateFieldState]);

  const handleCloseAlert = useCallback(() => dispatch(addDataSourceReset()));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dataInstance={COMPONENT_NAME}
      onRemoveFromDom={onDidClose}
      size={ModalSizes.MEDIUM}
      primaryButtonText={dataSource ? t(`${TRANSLATION_KEY}EditButton`) : t(`${TRANSLATION_KEY}AddButton`)}
      secondaryButtonText={t(`${TRANSLATION_KEY}CancelButton`)}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={onClose}
      disablePrimaryButton={isSavingDataSource}
      disableSecondaryButton={isSavingDataSource}
    >
      <Spinner width='100%' mb={10} spinning={isSavingDataSource}>
        <Box mb={8}>
          <Text type={TextTypes.H2} fontWeight='l'>
            {dataSource ? t(`${TRANSLATION_KEY}EditTitle`) : t(`${TRANSLATION_KEY}AddTitle`)}
          </Text>
        </Box>
        {saveDataSourceError && (
          <Alert
            type='error'
            message={`${t(`${TRANSLATION_KEY}SaveError`)}.\n${saveDataSourceError?.message}`}
            onClose={handleCloseAlert}
            mb={8}
          />
        )}

        <Input
          required={formState.name.required}
          label={t(`${TRANSLATION_KEY}NameField_Label`)}
          value={formState.name.value}
          hint={formState.name.error}
          intent={formState.name.error ? Intent.ERROR : null}
          onChange={handleNameChange}
          placeholder={t(`${TRANSLATION_KEY}NameField_Placeholder`)}
          dataInstance={`${COMPONENT_NAME}-NameField`}
          mb={8}
        />

        <Flex mb={5}>
          <Box flex={1} dataInstance={`${COMPONENT_NAME}-TypesField`}>
            <Text type={TextTypes.H4} fontWeight='m' mb={1}>
              {formState.type.required && (
                <Text color='red' display='inline-block' mr={3}>
                  *
                </Text>
              )}
              {t(`${TRANSLATION_KEY}TypesField_Label`)}
            </Text>
            {types?.map(x => (
              <Flex key={x.id}>
                <Radio
                  name='type'
                  label={x.name}
                  value={x.id}
                  mb={3}
                  radioSize={16}
                  fontSize={14}
                  pr={2}
                  checked={formState.type.value === x.id}
                  onOptionSelected={handleTypeChange}
                />
                <Tooltip
                  direction={TooltipPosition.RIGHT}
                  showOnHover
                  tooltipContent={x.description}
                  dataInstance={`${COMPONENT_NAME}-TypeTooltip`}
                  tooltipWrapperHeight='18px'
                  tooltipWrapperWidth='18px'
                >
                  <Icon type={IconTypes.INFO} width={18} color='blue4' />
                </Tooltip>
              </Flex>
            ))}
          </Box>
          <Box flex={1} dataInstance={`${COMPONENT_NAME}-TransferModesField`}>
            <Text type={TextTypes.H4} fontWeight='m' mb={1}>
              <Text color='red' display='inline-block' mr={3}>
                *
              </Text>
              {t(`${TRANSLATION_KEY}TransferModesField_Label`)}
            </Text>
            {availableTransferModes?.map(x => (
              <Flex key={x.id}>
                <Radio
                  name='transferMode'
                  label={x.name}
                  value={x.id}
                  mb={3}
                  radioSize={16}
                  fontSize={14}
                  pr={2}
                  checked={formState.transferMode.value === x.id}
                  onOptionSelected={handleTransferModeChange}
                />
                <Tooltip
                  direction={TooltipPosition.RIGHT}
                  showOnHover
                  tooltipContent={x.description}
                  dataInstance={`${COMPONENT_NAME}-TypeTooltip`}
                  tooltipWrapperHeight='18px'
                  tooltipWrapperWidth='18px'
                >
                  <Icon type={IconTypes.INFO} width={18} color='blue4' />
                </Tooltip>
              </Flex>
            ))}
          </Box>
        </Flex>

        {!formState.sourceType.hidden && (
          <Select
            disabled={formState.sourceVersion.hidden}
            required={formState.sourceType.required && !formState.sourceVersion.hidden}
            type={SelectTypes.SINGLE}
            label={t(`${TRANSLATION_KEY}SourceTypeField_Label`)}
            hint={formState.sourceType.error}
            intent={formState.sourceType.error ? Intent.ERROR : null}
            options={sourceSystemList || []}
            filtering
            value={formState.sourceType.value}
            onChange={handleSourceTypeChange}
            loading={isFetchingSourceSystems}
            placeholder={
              formState.sourceVersion.hidden
                ? t(`${TRANSLATION_KEY}SourceTypeField_Disabled`)
                : t(`${TRANSLATION_KEY}SourceTypeField_Placeholder`)
            }
            optionValueKey='id'
            optionTextKey='name'
            dataInstance={t(`${COMPONENT_NAME}-SourceTypeField`)}
            mb={8}
            emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
          />
        )}

        {!formState.sourceVersion.hidden && (
          <Select
            required
            type={SelectTypes.SINGLE}
            label={t(`${TRANSLATION_KEY}SourceVersionField_Label`)}
            hint={formState.sourceVersion.error}
            intent={formState.sourceVersion.error ? Intent.ERROR : null}
            options={sourceVersionList || []}
            filtering
            value={formState.sourceVersion.value}
            onChange={handleSourceVersionChange}
            loading={isFetchingSourceSystems}
            placeholder={t(`${TRANSLATION_KEY}SourceVersionField_Placeholder`)}
            optionValueKey='id'
            optionTextKey='versionName'
            dataInstance={`${COMPONENT_NAME}-SourceVersionField`}
            mb={8}
            emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
          />
        )}

        {!formState.entities.hidden && (
          <Select
            required
            type={SelectTypes.MULTIPLE}
            label={t(`${TRANSLATION_KEY}EntitiesField_Label`)}
            hint={formState.entities.error}
            intent={formState.entities.error ? Intent.ERROR : null}
            options={entityList || []}
            filtering
            value={formState.entities.value}
            onChange={handleEntitiesChange}
            loading={false}
            placeholder={t(`${TRANSLATION_KEY}EntitiesField_Placeholder`)}
            optionValueKey='id'
            optionTextKey='name'
            dataInstance={`${COMPONENT_NAME}-EntitiesField`}
            mb={8}
            emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
          />
        )}

        {!formState.modules.hidden && (
          <Select
            required={formState.modules.required}
            type={SelectTypes.MULTIPLE}
            label={t(`${TRANSLATION_KEY}ModulesField_Label`)}
            intent={formState.modules.error ? Intent.ERROR : null}
            options={tagList || []}
            filtering
            value={formState.modules.value}
            onChange={handleModulesChange}
            loading={isFetchingTags}
            placeholder={t(`${TRANSLATION_KEY}ModulesField_Placeholder`)}
            optionValueKey='id'
            optionTextKey='name'
            childrenListKey='tags'
            dataInstance={`${COMPONENT_NAME}-ModulesField`}
            mb={8}
            hint={formState.modules.error}
            emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
          />
        )}
      </Spinner>
    </Modal>
  );
};

const DataSourceManager = ({ isOpen, onDidClose, ...otherProps }) => {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen, setShouldRender]);

  const onDidCloseHandler = useCallback(() => {
    setShouldRender(false);
    if (onDidClose) {
      onDidClose();
    }
  }, [setShouldRender]);

  return shouldRender ? <DataSourceManagerModal {...{ ...otherProps, isOpen, onDidClose: onDidCloseHandler }} /> : null;
};
export default DataSourceManager;
