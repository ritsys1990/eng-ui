import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Flex,
  Input,
  Intent,
  Modal,
  ModalSizes,
  Select,
  SelectTypes,
  Text,
  TextTypes,
} from 'cortex-look-book';
import { useDispatch } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME, FormErrorModel } from '../constants/constants';
import { createSubOrg, updateSubOrg } from '../../../../../store/client/actions';
import { getErrors } from '../utils/utils';

// eslint-disable-next-line sonarjs/cognitive-complexity
const CreateEditSubOrgModal = props => {
  const { t } = useTranslation();
  const { client, isOpen, handleClose, isCreating, selectedRow } = props;
  const [subOrgName, setSubOrgName] = useState('');
  const [entityRows, setEntityRows] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const [entities, setEntities] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const clientEntities = client?.entities;
    const currentEntities = clientEntities?.filter(entity => entity.subOrgId === null);
    setEntities(currentEntities);
  }, [client]);

  useEffect(() => {
    if (!isCreating) {
      const clientEntities = client?.entities;
      setSubOrgName(selectedRow?.name);
      setEntityRows(clientEntities?.filter(entity => entity.subOrgId === selectedRow.id) || []);
    } else {
      setSubOrgName('');
      setEntityRows([]);
      setIsAlert(entities?.length === 0);
    }
    setShowErrors(false);
  }, [selectedRow, client, entities, isCreating]);

  useEffect(() => {
    if (selectedRow) {
      const clientEntities = client?.entities;
      setEntityRows(clientEntities?.filter(entity => entity.subOrgId === selectedRow.id) || []);
    }
  }, [selectedRow, client]);

  const clearEntities = () => {
    handleClose();
  };

  const hasErrors = () => {
    const errors = getErrors(t, FormErrorModel, subOrgName, entityRows);
    if (errors.subOrgName || errors.entityRows) {
      return errors;
    }

    return null;
  };

  const handleEntityChange = e => {
    setSubOrgName(e.target.value);
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }
    const entityIds = entityRows?.map(entity => entity.id) || [];
    if (isCreating) {
      dispatch(createSubOrg(subOrgName, entityIds, client?.id));
    } else {
      dispatch(updateSubOrg(client?.id, selectedRow?.id, subOrgName, entityIds));
    }
    setShowErrors(false);
    setSubOrgName('');
    setEntityRows([]);
    handleClose();
  };

  const handleSelectChange = value => {
    setEntityRows(value);
  };

  const errors = showErrors ? getErrors(t, FormErrorModel, subOrgName, entityRows) : { ...FormErrorModel };

  const onClose = () => {
    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={clearEntities}
      onPrimaryButtonClick={handleSubmit}
      disablePrimaryButton={isAlert && isCreating}
      onSecondaryButtonClick={clearEntities}
      primaryButtonText={
        isCreating ? t('Pages_Client_Setup_Step4_Add_SubOrg_Title') : t('Pages_Client_Setup_Step4_Edit_Suborg_Button')
      }
      secondaryButtonText={t('Pages_Client_Setup_Step4_Link_To_Org_Secondary_Button')}
      size={ModalSizes.MEDIUM}
      dataInstance={`${COMPONENT_NAME}_SubOrg_Create_Edit`}
    >
      <Box mb={10}>
        {isAlert && isCreating && (
          <Alert onClose={onClose} type='error' message={t('Pages_Client_Setup_Step4_Sub_Org_No_Entities_Available')} />
        )}
        <Text type={TextTypes.H2} fontWeight='l' mb={9}>
          {isCreating
            ? t('Pages_Client_Setup_Step4_Add_SubOrg_Title')
            : t('Pages_Client_Setup_Step4_Edit_Suborg_Title')}
        </Text>
        <Box mb={25}>
          <Input
            required
            label={t('Pages_Client_Setup_Step4_Sub_Org_Label')}
            value={subOrgName}
            onChange={handleEntityChange}
            placeholder={t('Pages_Client_Setup_Step4_Sub_Org_Placeholder')}
            dataInstance={`${COMPONENT_NAME}_SubOrg_Name`}
            hint={errors.subOrgName}
            intent={errors.subOrgName ? Intent.ERROR : null}
          />
        </Box>
        <Box mb={25}>
          <Flex justifyContent='space-between'>
            <Box width='100%'>
              <Select
                required
                label={t('Pages_Client_Setup_Step4_Sub_Org_Entities')}
                type={SelectTypes.MULTIPLE}
                value={entityRows}
                options={entities}
                onChange={handleSelectChange}
                inputChangeDebounce={400}
                dataInstance={`${COMPONENT_NAME}_SubOrg_Entity`}
                placeholder={t('Pages_Client_Setup_Step4_Sub_Org_Entity_Select')}
                emptyMessage={t('Pages_Client_Setup_Step4_Sub_Org_Entity_Empty_Message')}
                optionValueKey='id'
                optionTextKey='name'
                hint={errors.entityRows}
                intent={errors.entityRows ? Intent.ERROR : null}
              />
            </Box>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};

CreateEditSubOrgModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

CreateEditSubOrgModal.defaultProps = {
  isOpen: false,
};

export default CreateEditSubOrgModal;
