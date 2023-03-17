import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalSizes } from 'cortex-look-book';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';
import AddFilterForm from './AddFilterForm';
import { COMPONENT_NAME } from './constants';
import { useSelector } from 'react-redux';
import { bundlesSelectors } from 'src/store/bundles/selectors';

const AddFilterModal = props => {
  const { isOpen, handleClose, selectedFilter, isEditMode, isChanged, setIsChanged } = props;
  const { t } = useTranslation();
  const isEditingSourceFilter = useSelector(bundlesSelectors.selectIsEditingSourceFilter);
  const isFetchingFieldContext = useSelector(bundlesSelectors.selectIsFetchingFieldContext);
  const IsCreatingSourceVersionFilter = useSelector(bundlesSelectors.selectIsCreatingSourceVersionFilter);

  const formRef = useRef();

  const handleSubmit = () => {
    if (((formRef || {}).current || {}).submit) {
      formRef.current.submit();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onPrimaryButtonClick={handleSubmit}
      disablePrimaryButton={
        (!isChanged && isEditMode) || IsCreatingSourceVersionFilter || isEditingSourceFilter || isFetchingFieldContext
      }
      onSecondaryButtonClick={handleClose}
      primaryButtonText={
        isEditMode
          ? t(`Pages_ContentLibrary_Filter_Table_Edit_Filter`)
          : t(`Pages_ContentLibrary_Filter_Table_Add_Filter`)
      }
      secondaryButtonText={t('Cancel', nameSpaces.TRANSLATE_NAMESPACE_GENERAL)}
      size={ModalSizes.MEDIUM}
      dataInstance={`${COMPONENT_NAME}-Add-Filter-Modal`}
    >
      <AddFilterForm
        ref={formRef}
        handleClose={handleClose}
        selectedFilter={selectedFilter}
        isEditMode={isEditMode}
        setIsChanged={setIsChanged}
        isChanged={isChanged}
        dataInstance={`${COMPONENT_NAME}-Add-Filter-Form`}
      />
    </Modal>
  );
};

AddFilterModal.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

AddFilterModal.defaultProps = {
  isOpen: false,
};

export default AddFilterModal;
