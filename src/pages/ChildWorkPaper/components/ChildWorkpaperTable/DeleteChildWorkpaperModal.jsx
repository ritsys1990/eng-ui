import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TextTypes, ModalSizes, Spinner, Modal, Box } from 'cortex-look-book';
import useTranslation from '../../../../hooks/useTranslation';
import { deleteChildWorkPaper, getChildWorkPapers } from '../../../../store/childWorkpapers/actions';
import { childWorkpaperSelectors } from '../../../../store/childWorkpapers/selectors';

const COMPONENT_NAME = 'DeleteChildWorkpaperModal';
const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_DeleteWorkpaperModalContent';

const DeleteChildWorkpaperModal = props => {
  const { isOpen, onClose, workpaper } = props;
  const { t } = useTranslation();
  const isDeleting = useSelector(childWorkpaperSelectors.selectIsDeletingChildWorkpaper);
  const dispatch = useDispatch();
  const parentWorkpaperId = workpaper?.parentWorkPaperId;
  const workpaperName = workpaper?.childWorkPaperName;
  const onPrimaryButtonClick = () => {
    dispatch(deleteChildWorkPaper(workpaper?.id, workpaper?.childWorkPaperId)).then(resp => {
      if (resp) {
        onClose();
        dispatch(getChildWorkPapers(parentWorkpaperId));
      }
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
      primaryButtonText={t(`${TRANSLATION_KEY}_PrimButtonText`)}
      secondaryButtonText={t(`${TRANSLATION_KEY}_SecButtonText`)}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isDeleting} label={t(`${TRANSLATION_KEY}_Spinner`)}>
        <Text type={TextTypes.H1} mb={25}>
          <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
        </Text>
        <Box>
          <Text type={TextTypes.BODY} mb={25}>
            {t(`${TRANSLATION_KEY}_Line2`)}
            &nbsp;&nbsp;
            <b>
              <Text ellipsisTooltip tooltipWrapperWidth='inherit' charLimit={32} fontWeight='m' forwardedAs='span'>
                {workpaperName}
              </Text>
            </b>
            &nbsp;&nbsp;
            {t(`${TRANSLATION_KEY}_Workpaper`)}
          </Text>
        </Box>
      </Spinner>
    </Modal>
  );
};

export default DeleteChildWorkpaperModal;
