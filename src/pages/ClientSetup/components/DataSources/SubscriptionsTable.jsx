import React, { useCallback, useEffect, useState } from 'react';
import { Box, Table, Flex, Button, ButtonTypes, IconTypes } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY, SubscriptionStatus, SubscriptionOptions } from './constants';
import { SubsStatusField, CtaMenu } from './TableFields';
import useTranslation from 'src/hooks/useTranslation';
import SubscriptionModal from './SubscriptionModal';
import useCheckAuth from '../../../../hooks/useCheckAuth';
import { Actions, checkPermissions, Permissions } from '../../../../utils/permissionsHelper';
import RejectionReasonModal from './RejectionReasonModal';

const { SUBS_TABLE: COMPONENT_NAME } = ComponentNames;

export const renderStatus = (status, subscription, onCtaClick) => (
  <SubsStatusField status={status} onClick={() => onCtaClick(subscription)} />
);

export const renderCTA = (subscription, onClick, hasPermissions = false) => {
  const { status } = subscription;
  if (status !== SubscriptionStatus.WAITING_APPROVAL || !hasPermissions) {
    return null;
  }

  return (
    <Flex justifyContent='flex-end' cursor='pointer'>
      <Button
        p={2}
        type={ButtonTypes.FLAT}
        icon={IconTypes.ELLIPSIS_Y}
        iconWidth={18}
        dataInstance={`${COMPONENT_NAME}-CtaButton`}
        onClick={e => onClick(e, subscription)}
      />
    </Flex>
  );
};

const SubscriptionsTable = ({ subscriptions, dataSource, ...otherProps }) => {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState([]);
  const [ctaRef, setCtaRef] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuOptions, setMenuOptions] = useState([]);
  const [modalAction, setModalAction] = useState(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const { permissions } = useCheckAuth({ useClientPermissions: true });

  const openRejectionModal = useCallback(subscription => {
    if (subscription.status === SubscriptionStatus.REJECTED) {
      setSelectedRow(subscription);
      setIsRejectionModalOpen(true);
    }
  }, []);

  const closeRejectionModal = useCallback(() => {
    setSelectedRow(null);
    setIsRejectionModalOpen(false);
  }, []);

  const ctaClickHandler = useCallback((e, subscription) => {
    setSelectedRow(subscription);
    setCtaRef({ current: e.currentTarget });
  }, []);

  const ctaMenuCloseHandler = useCallback(() => {
    setCtaRef(null);
  }, []);

  const modalCloseHandler = useCallback(() => {
    setIsSubscriptionModalOpen(false);
  }, []);

  const modalDidCloseHandler = useCallback(() => {
    setSelectedRow(null);
    setModalAction(null);
  }, []);

  const ctaOptionHandler = useCallback(
    option => {
      setModalAction(option.id);
      setIsSubscriptionModalOpen(true);
      setCtaRef(null);
    },
    [t]
  );

  useEffect(() => {
    setHeaders([
      { key: 'engagementName', title: t(`${TRANSLATION_KEY}SubsTableHeader1`), width: '30%' },
      { key: 'sentBy', title: t(`${TRANSLATION_KEY}SubsTableHeader2`), width: '30%' },
      {
        key: 'status',
        title: t(`${TRANSLATION_KEY}SubsTableHeader4`),
        render: (status, row) => renderStatus(status, row, openRejectionModal),
        width: '30%',
      },
      {
        key: '#cta',
        title: '',
        render: (_, row) => renderCTA(row, ctaClickHandler, menuOptions.length > 0),
        width: '10%',
      },
    ]);
  }, [t, menuOptions, ctaClickHandler, openRejectionModal]);

  useEffect(() => {
    const options = [];

    if (checkPermissions(permissions, Permissions.DATA_SOURCE_SUBSCRIPTION, Actions.APPROVE)) {
      options.push({ id: SubscriptionOptions.APPROVE, text: t(`${TRANSLATION_KEY}Subscription_Options_Approve`) });
      options.push({ id: SubscriptionOptions.REJECT, text: t(`${TRANSLATION_KEY}Subscription_Options_Reject`) });
    }

    setMenuOptions(options);
  }, [permissions, t]);

  return (
    <Box>
      <Table {...otherProps} dataInstance={COMPONENT_NAME} headers={headers} rows={subscriptions} />
      <CtaMenu
        anchorRef={ctaRef}
        onClose={ctaMenuCloseHandler}
        options={menuOptions}
        onOptionClicked={ctaOptionHandler}
      />
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        action={modalAction}
        subscription={selectedRow}
        onClose={modalCloseHandler}
        onDidClose={modalDidCloseHandler}
        dataSource={dataSource}
        dataInstance={COMPONENT_NAME}
      />
      <RejectionReasonModal
        isOpen={isRejectionModalOpen}
        onClose={closeRejectionModal}
        subscription={selectedRow}
        dataInstance={COMPONENT_NAME}
      />
    </Box>
  );
};

export default SubscriptionsTable;
