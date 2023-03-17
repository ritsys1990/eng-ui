import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, Intent, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME, FormErrorModel } from '../constants/constants';
import { getErrors } from '../utils/utils';

const LinkToOrgModal = props => {
  const { isOpen, handleClose, handleLinkToOrg, client } = props;
  const { t } = useTranslation();
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    setIsModelOpen(isOpen);
  }, [isOpen]);

  const hasErrors = () => {
    const errors = getErrors(t, FormErrorModel, null, [], orgName);

    return errors.orgName;
  };

  const handleOrgChange = e => {
    setOrgName(e.target.value);
  };

  const handleSubmit = () => {
    setShowErrors(true);
    if (hasErrors()) {
      return;
    }
    handleLinkToOrg(orgName, client?.id);
    setIsModelOpen(false);
    setOrgName('');
    setShowErrors(false);
  };

  const errors = showErrors ? getErrors(t, FormErrorModel, null, [], orgName) : { ...FormErrorModel };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('Pages_Client_Setup_Step4_Link_To_Org_Primary_Button')}
      secondaryButtonText={t('Pages_Client_Setup_Step4_Link_To_Org_Secondary_Button')}
      size={ModalSizes.SMALL}
      dataInstance={COMPONENT_NAME}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step4_Link_To_Org_Title')}
        </Text>

        <Input
          label={t('Pages_Client_Setup_Step4_Link_To_Org')}
          value={orgName}
          placeholder={t('Pages_Client_Setup_Step4__Link_To_Org_Placeholder')}
          dataInstance={`${COMPONENT_NAME}_orgName`}
          onChange={handleOrgChange}
          hint={errors.orgName}
          intent={errors.orgName ? Intent.ERROR : null}
        />
      </Box>
    </Modal>
  );
};

LinkToOrgModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

LinkToOrgModal.defaultProps = {
  isOpen: false,
};

export default LinkToOrgModal;
