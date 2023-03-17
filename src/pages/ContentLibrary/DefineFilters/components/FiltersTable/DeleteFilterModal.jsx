import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Modal, ModalSizes, Text, TextTypes } from 'cortex-look-book';
import useTranslation, { nameSpaces } from '../../../../../hooks/useTranslation';
import { COMPONENT_NAME } from './constants';
import { deleteSourceVersionFilter } from '../../../../../store/bundles/actions';
import { bundlesSelectors } from 'src/store/bundles/selectors';

const DeleteFilterModal = props => {
  const { isOpen, handleClose, sourceVersionId, selectedFilter } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bundleNameDetails = useSelector(bundlesSelectors.selectBundleNameDetails);

  const handleSubmit = () => {
    dispatch(deleteSourceVersionFilter(bundleNameDetails?.bundleId, sourceVersionId, selectedFilter.id));
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      onSecondaryButtonClick={handleClose}
      primaryButtonText={t('YES', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.SMALL}
      dataInstance={`${COMPONENT_NAME}_Filter_Delete`}
    >
      <Box mb={10}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          {t('Pages_Client_Setup_Step4_Delete_Filter_Delete_Title')}
        </Text>
        <Text mb={20}>
          {t('Pages_Client_Setup_Step4_Confirm_Filter_Delete').replace('{filtername}', `${selectedFilter.name}`)}
        </Text>
      </Box>
    </Modal>
  );
};

DeleteFilterModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

DeleteFilterModal.defaultProps = {
  isOpen: false,
};

export default DeleteFilterModal;
