import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, ModalSizes, AlertHub, Spinner } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import CreateNewEngModal from './AddNewEngagement/CreateNewEngModal';
import { EngagementTypes } from '../constants/engagment.constants';
import { deleteGlobalError } from '../../../../../store/errors/actions';
import { errorsSelectors } from '../../../../../store/errors/selectors';
import { engagementSelectors } from '../../../../../store/engagement/selectors';

const COMPONENT_NAME = 'Client_Setup_Edit_Engagement';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Engagement_Add_Engagement';

const EditEngagementModal = ({ selectedEngagement, isOpen, updateEditShowEditModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const editEngagement = useRef();

  const addEngagmentErrors = useSelector(errorsSelectors.selectAddEngagementErrors);
  const isAddingEngagement = useSelector(engagementSelectors.selectIsAddingEngagement);

  const onErrorClose = errorKey => {
    dispatch(deleteGlobalError(errorKey));
  };

  const handleSubmit = () => {
    if (((editEngagement || {}).current || {}).submit) {
      editEngagement.current.submit();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={updateEditShowEditModal}
        onPrimaryButtonClick={handleSubmit}
        onSecondaryButtonClick={updateEditShowEditModal}
        primaryButtonText={t(`${TRANSLATION_KEY}_PrimaryCTA_Edit`)}
        secondaryButtonText={t(`${TRANSLATION_KEY}_SecondaryCTA`)}
        size={ModalSizes.MEDIUM}
        dataInstance={`${COMPONENT_NAME}`}
      >
        <AlertHub alerts={addEngagmentErrors} onClose={onErrorClose} dataInstance={`${COMPONENT_NAME}_Alert`} />
        <Spinner spinning={isAddingEngagement} dataInstance={`${COMPONENT_NAME}_Spinner`}>
          <CreateNewEngModal
            mode={EngagementTypes.EDIT}
            ref={editEngagement}
            closeModal={updateEditShowEditModal}
            openNewEngagementModal={updateEditShowEditModal}
            selectedEngagement={selectedEngagement}
            showBackButon={false}
            dataInstance={`${COMPONENT_NAME}_Create_Modal`}
          />
        </Spinner>
      </Modal>
    </>
  );
};

export default EditEngagementModal;
