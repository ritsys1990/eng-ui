import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateIsReconcileModalOpen } from '../../../../../store/engagement/actions';
import { engagementSelectors } from '../../../../../store/engagement/selectors';
import ClientReconcileModal from '../../ClientReconcileModal/ClientReconcileModal';

const COMPONENT_NAME = 'ReconcileModalWrapper';

const ReconcileModalWrapper = () => {
  const [shouldRenderReconcileModal, setShouldRenderReconcileModal] = useState(false);
  const areEngagementsReconciled = useSelector(engagementSelectors.selectAreEngagementsReconciled);
  const isReconcileModalOpen = useSelector(engagementSelectors.selectIsReconcileEngagementsModalOpen);

  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(updateIsReconcileModalOpen(false));
  };

  const onReconcileModalRemovedFromDom = () => {
    setShouldRenderReconcileModal(false);
  };

  useEffect(() => {
    if (isReconcileModalOpen) {
      setShouldRenderReconcileModal(true);
    }
  }, [isReconcileModalOpen]);

  return shouldRenderReconcileModal ? (
    <ClientReconcileModal
      isModalOpen={isReconcileModalOpen}
      isEngagementEditable={!areEngagementsReconciled}
      handleClose={onClose}
      dataInstance={COMPONENT_NAME}
      onRemoveFromDom={onReconcileModalRemovedFromDom}
    />
  ) : null;
};

export default ReconcileModalWrapper;
