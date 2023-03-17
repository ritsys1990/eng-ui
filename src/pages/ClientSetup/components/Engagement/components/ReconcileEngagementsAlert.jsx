import { AlertDialog, Button, ButtonTypes, Intent, Text } from 'cortex-look-book';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import { updateIsReconcileModalOpen } from '../../../../../store/engagement/actions';
import { engagementSelectors } from '../../../../../store/engagement/selectors';

const COMPONENT_NAME = 'ReconcileEngagementsAlert';

const ReconcileEngagementsAlert = () => {
  const areEngagementsReconciled = useSelector(engagementSelectors.selectAreEngagementsReconciled);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onReconcileClick = () => {
    dispatch(updateIsReconcileModalOpen(true));
  };

  return !areEngagementsReconciled ? (
    <AlertDialog
      type={Intent.INFO}
      title={t('Pages_Client_Setup_Step3_ReconcileTitle')}
      mb={8}
      dataInstance={COMPONENT_NAME}
    >
      <Text>
        {t('Pages_Client_Setup_Step3_ReconcileText')}
        <Button
          type={ButtonTypes.LINK}
          display='inline-block'
          ml={3}
          onClick={onReconcileClick}
          dataInstance={`${COMPONENT_NAME}-Reconcile`}
        >
          {t('Pages_Client_Setup_Step3_ReconcileButton')}
        </Button>
      </Text>
    </AlertDialog>
  ) : null;
};

export default ReconcileEngagementsAlert;
