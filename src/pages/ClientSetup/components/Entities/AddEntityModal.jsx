import { Modal, Spinner, Box, Text, TextTypes, Select, Input, SelectTypes, ModalSizes, Intent } from 'cortex-look-book';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation, { nameSpaces } from '../../../../hooks/useTranslation';
import { addEntity, editEntity, getMatClientEntities, resetMatEntities } from '../../../../store/client/actions';
import { clientSelectors } from '../../../../store/client/selectors';
import {
  ADD_MODAL_COMPONENT_NAME as COMPONENT_NAME,
  ADD_MODAL_TRANSLATION_KEY as TRANSLATION_KEY,
} from './constants/constants';

// eslint-disable-next-line sonarjs/cognitive-complexity
const AddEntityModal = ({ isModalOpen, handleClose, onRemoveFromDom, isEditing, selectedEntity }) => {
  const [name, setName] = useState('');
  const [selectedMatEntity, setSelectedMatEntity] = useState([]);
  const [availableMatEntities, setAvailableMatEntities] = useState([]);
  const [isRepeatedName, setIsRepeatedName] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const client = useSelector(clientSelectors.selectClient);
  const matEntities = useSelector(clientSelectors.selectMatClientEntities);
  const isFetchingMatEntities = useSelector(clientSelectors.selectIsFetchingMatClientEntities);
  const isAddingEntity = useSelector(clientSelectors.selectIsAddingEntity);
  const isUpdatingEntity = useSelector(clientSelectors.selectIsEntitySaving);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleSelectChange = value => {
    setSelectedMatEntity(value);
  };

  const handleEntityNameChange = value => {
    if (!selectedEntity || (selectedEntity && name)) {
      setIsRepeatedName(!!client?.entities?.find(clientEntity => clientEntity.name === value));
    }
    setName(value);
  };

  const handleAddEntity = () => {
    const entity = {};
    if (selectedMatEntity?.[0]?.id) {
      entity.matEntityId = selectedMatEntity[0].id;
    } else {
      entity.name = name;
    }

    if (isEditing) {
      dispatch(editEntity(client.id, { id: selectedEntity.id, ...entity })).then(() => {
        handleClose();
      });
    } else {
      dispatch(addEntity(client.id, entity)).then(() => {
        handleClose();
      });
    }
  };

  useEffect(() => {
    if (client?.matClientId) {
      dispatch(getMatClientEntities(client.matClientId));
    }
  }, [dispatch, client]);

  useEffect(() => {
    return () => {
      dispatch(resetMatEntities());
    };
  }, [dispatch]);

  useEffect(() => {
    setAvailableMatEntities(
      matEntities.filter(entity => !client?.entities?.find(clientEntity => clientEntity.matEntityId === entity.id))
    );
  }, [client, matEntities]);

  useEffect(() => {
    setIsButtonDisabled(isAddingEntity || isUpdatingEntity || isRepeatedName || name.length === 0);
  }, [isAddingEntity, isUpdatingEntity, isRepeatedName, name]);

  useEffect(() => {
    if (selectedEntity && isEditing) {
      setSelectedMatEntity([selectedEntity]);
    }
  }, [selectedEntity, isEditing]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      dataInstance={COMPONENT_NAME}
      onRemoveFromDom={onRemoveFromDom}
      size={ModalSizes.MEDIUM}
      disablePrimaryButton={isButtonDisabled}
      disableSecondaryButton={isAddingEntity || isUpdatingEntity}
      primaryButtonText={t('Ok', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      onPrimaryButtonClick={handleAddEntity}
      onSecondaryButtonClick={handleClose}
    >
      <Spinner
        spinning={isAddingEntity || isUpdatingEntity}
        label={isEditing ? t(`${TRANSLATION_KEY}_Updating`) : t(`${TRANSLATION_KEY}_Adding`)}
      >
        <Box mb={9}>
          <Text type={TextTypes.H2} fontWeight='l'>
            {isEditing ? t(`${TRANSLATION_KEY}_Edit_Title`) : t(`${TRANSLATION_KEY}_Add_Title`)}
          </Text>
        </Box>
        <Box mb={9}>
          <Box mb={6}>
            <Select
              label={t(`${TRANSLATION_KEY}_NameDropdown`)}
              type={SelectTypes.AUTO_COMPLETE}
              options={availableMatEntities}
              value={selectedMatEntity}
              onChange={handleSelectChange}
              onInputChange={handleEntityNameChange}
              loading={isFetchingMatEntities}
              optionValueKey='id'
              optionTextKey='name'
              intent={isRepeatedName ? Intent.ERROR : ''}
              hint={isRepeatedName ? t(`${TRANSLATION_KEY}_RepeatedName`) : null}
              dataInstance={`${COMPONENT_NAME}-EntityName`}
              emptyMessage={t('Components_ClientSelect_Select_EmptyMessage')}
            />
          </Box>
          <Input
            label={t(`${TRANSLATION_KEY}_MatInput`)}
            disabled
            value={
              (isEditing ? selectedEntity.matEntityId : selectedMatEntity?.[0]?.id) || t(`${TRANSLATION_KEY}_MatInput`)
            }
            dataInstance={`${COMPONENT_NAME}-MatEntity`}
          />
        </Box>
      </Spinner>
    </Modal>
  );
};

AddEntityModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  onRemoveFromDom: PropTypes.func,
};

AddEntityModal.defaultProps = {
  isModalOpen: false,
  onRemoveFromDom: null,
};

export default AddEntityModal;
