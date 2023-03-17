import { Button, ButtonTypes, Text, TextTypes } from 'cortex-look-book';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from '../../../../../hooks/useTranslation';
import { updateClientSetupStepStatus } from '../../../../../store/client/actions';
import { updateIsReconcileModalOpen } from '../../../../../store/engagement/actions';
import { engagementSelectors } from '../../../../../store/engagement/selectors';

const COMPONENT_NAME = 'EngagementSeeDetails';

const SeeMatDetails = () => {
  const areEngagementsReconciled = useSelector(engagementSelectors.selectAreEngagementsReconciled);
  const engagementList = useSelector(engagementSelectors.selectClientEngagementList);
  const areEngagementsSynchedToOmnia = useSelector(engagementSelectors.selectAreEngagementsSynchedToOmnia);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onReconcileClick = () => {
    dispatch(updateIsReconcileModalOpen(true));
  };

  useEffect(() => {
    const hasEngagements = engagementList.length > 0;
    const areAllEngagementsConnected = engagementList.every(
      eng => eng.efT_EXT_EngagementLink && eng.efT_INT_EngagementLink
    );
    const isStepComplete =
      hasEngagements && areEngagementsReconciled && areAllEngagementsConnected && areEngagementsSynchedToOmnia;
    dispatch(updateClientSetupStepStatus(3, isStepComplete));
  }, [dispatch, engagementList, areEngagementsReconciled, areEngagementsSynchedToOmnia]);

  return engagementList.length && areEngagementsReconciled ? (
    <Button type={ButtonTypes.LINK} iconWidth={20} onClick={onReconcileClick} dataInstance={`${COMPONENT_NAME}`}>
      <Text type={TextTypes.H3}>{t('Pages_Client_Setup_Step3_See_Detail')}</Text>
    </Button>
  ) : null;
};

export default SeeMatDetails;
