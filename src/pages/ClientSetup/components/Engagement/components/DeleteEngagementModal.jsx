import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TextTypes, ModalSizes, Spinner, Modal } from 'cortex-look-book';
import useTranslation from '../../../../../hooks/useTranslation';
import { deleteEngagement } from '../../../../../store/engagement/actions';
import { engagementSelectors } from '../../../../../store/engagement/selectors';

const COMPONENT_NAME = 'DeleteEngagementModal';
const TRANSLATION_KEY = 'Pages_Client_Setup_Step3_Delete_Engagement';

const DeleteEngagementModal = props => {
  const { isOpen, onClose, selectedEngagement } = props;
  const { t } = useTranslation();
  const isDeleting = useSelector(engagementSelectors.selectIsDeletingEngagement);
  const dispatch = useDispatch();

  const onPrimaryButtonClick = () => {
    dispatch(deleteEngagement(selectedEngagement?.id, selectedEngagement?.clientId)).then(() => {
      onClose();
    });
  };

  const onSecondaryButtonClick = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={ModalSizes.SMALL}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      disablePrimaryButton={isDeleting}
      disableSecondaryButton={isDeleting}
      primaryButtonText={t(`${TRANSLATION_KEY}_PrimaryButton`)}
      secondaryButtonText={t(`${TRANSLATION_KEY}_SecondaryButton`)}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isDeleting} label={t(`${TRANSLATION_KEY}_Spinner`)}>
        <Text type={TextTypes.H2} fontWeight='l' mb={25}>
          <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
        </Text>
        <Text mb={20}>{t(`${TRANSLATION_KEY}_Text`)}</Text>
      </Spinner>
    </Modal>
  );
};

export default DeleteEngagementModal;
