import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalSizes } from 'cortex-look-book';
import PropTypes from 'prop-types';
import {
  NEW_DM_TYPES,
  NEW_DM_PAGES,
  DM_FORM_STATE,
  DM_INITIAL_STATE,
  dataModelDetails,
} from '../../constants/constants';
import AddDataModelOptions from './AddDataModelOptions/AddDataModelOptions';
import IngestDataModelRenameOptions from './IngestDataModelRename/IngestDataModelRenameOptions';
import CreateNewDataModel from './CreateNewDataModel/CreateNewDataModel';
import ModalIngestContent from './ModalIngestContent/ModalIngestContent';
import { updateDataModel, ingestDataModel } from '../../../../../store/contentLibrary/datamodels/actions';
import UploadDataModel from './UploadDataModel/UploadDataModel';
import { bundlesSelectors } from '../../../../../store/bundles/selectors';
import { contentLibraryDMSelectors } from '../../../../../store/contentLibrary/datamodels/selectors';
import { commonDatamodelSelectors } from '../../../../../store/contentLibrary/commonDataModels/selectors';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../../../../hooks/useTranslation';

const COMPONENT_NAME = 'CL_DM_ADD_DM_MODAL';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddDataModelModal = props => {
  const { isOpen, handleClose, isAddDM, selectedDM } = props;
  const [selectedValue, setSelectedValue] = useState(NEW_DM_TYPES.CREATE);
  const [selectedRenameOptionValue, setSelectedRenameOptionValue] = useState('');
  const [dmRenameValue, setDmRenameValue] = useState('');
  const [dmValue, setDMValue] = useState(DM_INITIAL_STATE);
  const [dmFormState, setDMFormState] = useState(DM_FORM_STATE);
  const [current, setCurrent] = useState(0);
  const newDMRef = useRef();
  const uploadDMRef = useRef();
  const dispatch = useDispatch();
  const selectTags = useSelector(bundlesSelectors.selectTagsPublishedList);
  const isIngestingDataModel = useSelector(contentLibraryDMSelectors.isIngestingDataModel);
  const showRenamePopoup = useSelector(contentLibraryDMSelectors.showRenamePopoup);
  const cdmsMap = useSelector(commonDatamodelSelectors.cdmsMap);
  const { t } = useTranslation();

  const handleFormState = (value, invalid) =>
    setDMFormState({
      ...dmFormState,
      invalid,
      value,
    });

  const handleAddNewDM = () => {
    if (((newDMRef || {}).current || {}).submit) {
      newDMRef.current.submit();
    }
  };

  const handleIngestDM = () => {
    const { FROM_ENVIRONMENT, DM_NAME } = dataModelDetails;
    const envModel =
      dmValue && dmValue[FROM_ENVIRONMENT] && dmValue[FROM_ENVIRONMENT].length > 0 && dmValue[FROM_ENVIRONMENT][0];
    const dataModel = dmValue && dmValue[DM_NAME] && dmValue[DM_NAME].length > 0 && dmValue[DM_NAME][0];
    const sameNewName = dataModel?.nameTech;
    const ingestDataModelObj = {
      datamodelId: dataModel?.id,
      dataModelName: showRenamePopoup && selectedRenameOptionValue === 'newName' ? dmRenameValue : sameNewName,
      pullFromSource: envModel?.name,
      publishstate: 'published',
    };
    if (showRenamePopoup) {
      ingestDataModelObj.isDataModelRenamed = selectedRenameOptionValue !== 'newName';
    }

    dispatch(ingestDataModel(ingestDataModelObj)).then(resp => {
      if (resp.isPop) {
        setCurrent(4);
      } else {
        setDmRenameValue('');
        handleClose();
      }
    });
  };

  const handleUploadDM = () => {
    if (((uploadDMRef || {}).current || {}).submit) {
      uploadDMRef.current.submit();
    }
  };

  const handlePrimaryButtonClick = () => {
    if (dmFormState.invalid) {
      setDMFormState({ ...dmFormState, submitted: true });

      return;
    }
    const dmTObeUpdated = dmFormState.value;
    if (!isAddDM && selectedDM?.id) {
      dmTObeUpdated.id = selectedDM.id;
    }
    const cdmId = dmTObeUpdated?.cdmId?.length > 0 && dmTObeUpdated?.cdmId[0]?.id ? dmTObeUpdated.cdmId[0].id : null;
    dmTObeUpdated.cdmId = cdmId;

    // Updating tableAlias value if new coma seperated Table Alias are added
    if (dmFormState.value && dmFormState.value.textAliases !== '') {
      const aliases = [...dmFormState.value.tableAlias];
      const enteredAliases = dmFormState.value.textAliases?.split(',');
      enteredAliases?.forEach(item => {
        const trimmedValue = item.trimStart().trimEnd();
        if (trimmedValue !== '') aliases.push(trimmedValue);
      });
      dmTObeUpdated.tableAlias = aliases;
      const value = {
        ...dmFormState.value,

        textAliases: '',
      };

      setDMFormState({ ...dmFormState, value });
    }

    const value = {
      ...dmValue,
      textAliases: '',
      tableAlias: [...dmTObeUpdated.tableAlias],
    };
    setDMValue(value);

    dispatch(updateDataModel(dmTObeUpdated)).then(res => {
      if (res) {
        handleClose();
      }
    });
  };

  const views = [
    <AddDataModelOptions
      value={selectedValue}
      onSelected={setSelectedValue}
      dataInstance={`${COMPONENT_NAME}-AddDataModelOptions`}
    />,
    <CreateNewDataModel
      ref={newDMRef}
      selectedDM={selectedDM}
      handleClose={handleClose}
      formValue={dmValue}
      formState={dmFormState}
      handleFormState={handleFormState}
      handleChanges={newValue => setDMValue(newValue)}
      dataInstance={`${COMPONENT_NAME}-CreateNewDataModel`}
      isAddDM={isAddDM}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
    />,
    <UploadDataModel
      ref={uploadDMRef}
      selectedDM={selectedDM}
      handleClose={handleClose}
      dataInstance={`${COMPONENT_NAME}-UploadDataModel`}
      isAddDM={isAddDM}
    />,
    <ModalIngestContent
      ref={newDMRef}
      selectedDM={selectedDM}
      handleClose={handleClose}
      formValue={dmValue}
      formState={dmFormState}
      handleFormState={handleFormState}
      handleChanges={newValue => setDMValue(newValue)}
      handlePrimaryButtonClick={handlePrimaryButtonClick}
      dataInstance={`${COMPONENT_NAME}-ModalIngestContent`}
    />,
    <IngestDataModelRenameOptions
      value={selectedRenameOptionValue}
      onSelected={setSelectedRenameOptionValue}
      dmRenameValue={dmRenameValue}
      setDmRenameValue={setDmRenameValue}
      dataInstance={`${COMPONENT_NAME}-IngestDataModelRenameOptions`}
    />,
  ];

  const handleSubmit = () => {
    switch (current) {
      case 0:
        setCurrent(NEW_DM_PAGES[selectedValue]);
        break;
      case 1:
        handleAddNewDM();
        break;
      case 2:
        handleUploadDM();
        break;
      case 3:
        handleIngestDM();
        break;
      case 4:
        handleIngestDM();
        break;
      default:
        break;
    }
  };

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

  const getFormValues = () => {
    setCurrent(1);
    const tags = selectTags?.items;
    const selectedTags = getTagsSelected(selectedDM?.tagIds, tags);
    const cdmName = selectedDM?.cdmId && cdmsMap.get(selectedDM.cdmId) ? cdmsMap.get(selectedDM.cdmId) : '';
    const value = {
      ...selectedDM,
      tagIds: selectedTags || [],
      cdmId: cdmName ? [{ id: selectedDM.cdmId, name: cdmName }] : [],
      tableAlias: selectedDM?.tableAlias || [],
      textAliases: '',
    };
    setDMValue(value);
    setDMFormState({
      value,
      invalid: 'initial',
      submitted: false,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedValue(NEW_DM_TYPES.CREATE);
      setDmRenameValue('');
      setDMValue(DM_INITIAL_STATE);
    } else {
      getFormValues();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isAddDM) {
      setCurrent(0);
      setDMFormState(DM_FORM_STATE);
    } else {
      getFormValues();
    }
  }, [isAddDM, selectedDM]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={isAddDM ? selectedValue : t('Componenet_AddDataModelModal_PrimaryText_Edit')}
      secondaryButtonText={t('Close', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.MEDIUM}
      dataInstance={`${COMPONENT_NAME}-Modal`}
      disablePrimaryButton={
        (!isAddDM && dmFormState.invalid === 'initial') ||
        isIngestingDataModel ||
        (showRenamePopoup && selectedRenameOptionValue === '') ||
        (showRenamePopoup &&
          selectedRenameOptionValue === 'newName' &&
          (dmRenameValue === '' || dmRenameValue?.includes('.')))
      }
    >
      {views[current]}
    </Modal>
  );
};

export default AddDataModelModal;

AddDataModelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
