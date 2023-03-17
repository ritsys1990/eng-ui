import React from 'react';
import { Modal, ModalSizes, Text, TextTypes, Icon, IconTypes, Flex } from 'cortex-look-book';
import { WpEditModalContent } from './WpEditModalContent';
import { WpDeleteModalContent } from './WpDeleteModalContent';
import { WpSubmitReviewModalContent } from './WpSubmitReviewModalContent';
import { WpReturnPreparerModalContent } from './WpReturnPreparerModalContent';
import { WpRevertProgressModalContent } from './WpRevertProgressModalContent';
import { WpCompleteModalContent } from './WpCompleteModalContent';
import { updateReviewStatusWithGetWorkpaperList } from '../../../../store/workpaper/actions';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COMPONENT_NAME } from './constants';
import { ContextMenuOptions } from '../../constants/ContextMenuOptions.const';
import { WpCopyModalContent } from './WpCopyModal';
import useTranslation from 'src/hooks/useTranslation';

export const WpActionModal = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { engagementId } = useParams();
  const { isOpen, onClose, size, action, workpaper } = props;
  const workpaperName = workpaper && workpaper.name;
  const workpaperId = workpaper && workpaper.id;
  const workpaperCloneStatus = workpaper && workpaper.workpaperWorkflowCloneStatus;

  const updateReviewStatusParams = {};
  updateReviewStatusParams[ContextMenuOptions.SUBMIT_REVIEW] = {
    reviewStatus: 'SubmittedForReview',
    actionUpdate: t('Pages_EngagementWorkpapers_SubmitReviewModalContent_SubmitReview'),
  };
  updateReviewStatusParams[ContextMenuOptions.RETURN_PREPARER] = {
    reviewStatus: 'InProgress',
    actionUpdate: t('Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Return'),
  };
  updateReviewStatusParams[ContextMenuOptions.REVERT_PROGRESS] = {
    reviewStatus: 'InProgress',
    actionUpdate: t('Pages_EngagementWorkpapers_RevertProgressModalContent_Title'),
  };
  updateReviewStatusParams[ContextMenuOptions.COMPLETE] = {
    reviewStatus: 'Completed',
    actionUpdate: t('Pages_EngagementWorkpapers_CompleteModalContent_Complete'),
  };

  const updateReviewStatus = () => {
    dispatch(
      updateReviewStatusWithGetWorkpaperList({
        paramsUpdate: {
          id: workpaper.id,
          reviewStatus: updateReviewStatusParams[action].reviewStatus,
          action: updateReviewStatusParams[action].actionUpdate,
          trifactaFlowId: workpaper.trifactaFlowId,
        },
        engagementId,
      })
    );
  };

  const actionsModalInfo = {};
  actionsModalInfo[ContextMenuOptions.EDIT] = <WpEditModalContent {...{ workpaper, onClose, engagementId }} />;
  actionsModalInfo[ContextMenuOptions.COPY] = <WpCopyModalContent {...{ workpaper, onClose }} />;
  actionsModalInfo[ContextMenuOptions.DELETE] = (
    <WpDeleteModalContent {...{ workpaperName, onClose, workpaperId, engagementId }} />
  );
  actionsModalInfo[ContextMenuOptions.SUBMIT_REVIEW] = (
    <WpSubmitReviewModalContent {...{ workpaperName, onClose, updateReviewStatus }} />
  );
  actionsModalInfo[ContextMenuOptions.RETURN_PREPARER] = (
    <WpReturnPreparerModalContent {...{ workpaperName, onClose, updateReviewStatus }} />
  );
  actionsModalInfo[ContextMenuOptions.REVERT_PROGRESS] = (
    <WpRevertProgressModalContent {...{ workpaperName, onClose, updateReviewStatus }} />
  );
  actionsModalInfo[ContextMenuOptions.COMPLETE] = (
    <WpCompleteModalContent {...{ workpaperName, onClose, updateReviewStatus }} />
  );

  const actionModalContent = actionsModalInfo[action];

  const renderModal = () => {
    return (
      <>
        <Modal isOpen={isOpen} onClose={() => onClose()} size={size || ModalSizes.SMALL} dataInstance={COMPONENT_NAME}>
          {actionModalContent}
        </Modal>
      </>
    );
  };

  const renderAlertModal = () => {
    return (
      <>
        <Modal isOpen={isOpen} onClose={() => onClose()} size={size || ModalSizes.SMALL} dataInstance={COMPONENT_NAME}>
          <Flex flexDirection='row' justifyContent='flex-left'>
            <Icon type={IconTypes.WARNING} height='32px' width='32px' color='yellow' mt={4} />
            &nbsp;
            <Text type={TextTypes.H3} ml={2} mt={7}>
              <b>{String(action).toUpperCase()}</b>{' '}
              {t('Pages_EngagementWorkpapers_WorkpaperTable_ContextMenu_Cloning_Status')}
            </Text>
          </Flex>
        </Modal>
      </>
    );
  };

  return (
    <>
      {action !== 'delete'
        ? [workpaperCloneStatus !== 'InProgress' ? renderModal() : renderAlertModal()]
        : renderModal()}
    </>
  );
};
