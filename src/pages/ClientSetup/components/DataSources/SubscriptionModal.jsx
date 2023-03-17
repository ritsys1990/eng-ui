import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ModalSizes, Box, Text, TextTypes, Textarea, Spinner, AlertTypes } from 'cortex-look-book';
import { TRANSLATION_KEY, SubscriptionOptions } from './constants';
import useTranslation from 'src/hooks/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { approveDataSourceSubscription, rejectDataSourceSubscription } from '../../../../store/engagement/actions';
import { engagementSelectors } from '../../../../store/engagement/selectors';
import { clientSelectors } from '../../../../store/client/selectors';
import { getClientDataSources } from '../../../../store/client/actions';
import { addGlobalError } from '../../../../store/errors/actions';

const COMPONENT_NAME = 'SubscriptionModal';

export const SubscriptionModalInner = ({
  isOpen,
  onClose,
  onDidClose,
  action,
  subscription,
  dataSource,
  ...otherProps
}) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  const client = useSelector(clientSelectors.selectClient);
  const isApprovingDataSourceSubscription = useSelector(engagementSelectors.selectIsApprovingDataSourceSubscription);
  const isRejectingDataSourceSubscription = useSelector(engagementSelectors.selectIsRejectingDataSourceSubscription);
  const dispatch = useDispatch();

  const handleReasonChange = useCallback(e => {
    setReason(e.target.value);
  }, []);

  const onSubmit = () => {
    switch (action) {
      case SubscriptionOptions.APPROVE:
        dispatch(approveDataSourceSubscription(subscription?.id)).then(response => {
          if (response) {
            dispatch(
              addGlobalError({
                type: AlertTypes.SUCCESS,
                message: `${t('Components_ClientSetupDataSources_Approve_Message1')} ${dataSource?.name} ${t(
                  'Components_ClientSetupDataSources_Approve_Message2'
                )}`,
              })
            );
          }

          dispatch(getClientDataSources(client?.id));
          onClose();
        });
        break;
      case SubscriptionOptions.REJECT:
        dispatch(rejectDataSourceSubscription(subscription, reason)).then(() => {
          dispatch(getClientDataSources(client?.id));
          onClose();
        });
        break;
      default:
        break;
    }
  };

  const info = useMemo(() => {
    switch (action) {
      case SubscriptionOptions.APPROVE:
        return {
          title: t(`${TRANSLATION_KEY}SubscriptionModal_TitleApprove`),
          guidance: t(`${TRANSLATION_KEY}SubscriptionModal_GuidanceApprove`),
          cta: t(`${TRANSLATION_KEY}Subscription_Options_Approve`),
          showReason: false,
        };
      case SubscriptionOptions.REJECT:
        return {
          title: t(`${TRANSLATION_KEY}SubscriptionModal_TitleReject`),
          guidance: t(`${TRANSLATION_KEY}SubscriptionModal_GuidanceReject`),
          cta: t(`${TRANSLATION_KEY}Subscription_Options_Reject`),
          showReason: true,
        };
      default:
        return null;
    }
  }, [t, action]);

  return (
    <Modal
      {...otherProps}
      size={ModalSizes.MEDIUM}
      isOpen={isOpen}
      onClose={onClose}
      onRemoveFromDom={onDidClose}
      onPrimaryButtonClick={onSubmit}
      onSecondaryButtonClick={onClose}
      primaryButtonText={info?.cta}
      disablePrimaryButton={isApprovingDataSourceSubscription || isRejectingDataSourceSubscription}
      secondaryButtonText={t(`${TRANSLATION_KEY}SubscriptionModal_Cancel`)}
      dataInstance={COMPONENT_NAME}
    >
      <Spinner spinning={isApprovingDataSourceSubscription || isRejectingDataSourceSubscription}>
        <Box pb={10}>
          <Text type={TextTypes.H2} mb={8}>
            {info?.title}
          </Text>
          <Text type={TextTypes.BODY}>{info?.guidance}</Text>
          {info?.showReason && (
            <Box mt={8}>
              <Textarea
                label={t(`${TRANSLATION_KEY}SubscriptionModal_ReasonLabel`)}
                value={reason}
                onChange={handleReasonChange}
                dataInstance={COMPONENT_NAME}
              />
            </Box>
          )}
        </Box>
      </Spinner>
    </Modal>
  );
};

const SubscriptionModal = ({ isOpen, onDidClose, ...otherProps }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen, setShouldRender]);

  const onDidCloseHandler = useCallback(() => {
    setShouldRender(false);
    if (onDidClose) {
      onDidClose();
    }
  }, [setShouldRender]);

  return shouldRender ? (
    <SubscriptionModalInner
      dataInstance={COMPONENT_NAME}
      {...{ ...otherProps, isOpen, onDidClose: onDidCloseHandler }}
    />
  ) : null;
};

export default SubscriptionModal;
