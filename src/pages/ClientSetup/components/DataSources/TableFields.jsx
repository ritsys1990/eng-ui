import React, { useEffect, useState } from 'react';
import { Flex, Box, Button, ButtonTypes, Text, Icon, IconTypes, Popover, ContextMenu } from 'cortex-look-book';
import { ComponentNames, TRANSLATION_KEY, SubscriptionStatus } from './constants';
import { getSubscriptionStatusText, getSubscriptionStatusCTAText } from './utils';
import useTranslation from 'src/hooks/useTranslation';

/**
 * This component shows all the subscriptions grouped.
 */
export const SubsStatusesField = ({ subscriptions, ...otherProps }) => {
  const { SUBS_STATUSES_FIELD: COMPONENT_NAME } = ComponentNames;
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);

  const onClickHandler = e => {
    // Needs revisit Table API, for now this workround is being tested.
    e?.currentTarget?.closest('tr')?.querySelector('td')?.firstChild?.click();
  };

  useEffect(() => {
    const subscriptionsStatuses = subscriptions
      ?.map(x => x.status)
      // We reduce to {status, count} structure in order to groupBy.
      .reduce((prev, current) => {
        const statusRow = prev.filter(x => x.status === current)[0];
        if (!statusRow) {
          return [...prev, { status: current, count: 1 }];
        }
        statusRow.count += 1;

        return prev;
      }, [])
      // Lets switch the status code to the localized display version.
      .map(x => ({ ...x, status: getSubscriptionStatusText(t, x.status) }))
      // Lets map to array of strings then join into a single string.
      .reduce((prev, current) => [...prev, `${current.status}: ${current.count}`], [])
      .join(', ');
    setStatus(subscriptionsStatuses);
  }, [subscriptions, t]);

  return (
    <Box dataInstance={COMPONENT_NAME} {...otherProps}>
      {status ? (
        <Button dataInstance={`${COMPONENT_NAME}-StatusButton`} type={ButtonTypes.LINK} onClick={onClickHandler}>
          {status}
        </Button>
      ) : (
        <Text dataInstance={`${COMPONENT_NAME}-EmptyState`}>{t(`${TRANSLATION_KEY}StatusFieldEmpty`)}</Text>
      )}
    </Box>
  );
};

/**
 * This component renders a single subscription status with indicator.
 */
export const SubsStatusField = ({ status, onCtaClick, ...otherProps }) => {
  const { SUBS_STATUS_FIELD: COMPONENT_NAME } = ComponentNames;
  const { t } = useTranslation();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (status) {
      let iconProps = {};
      let showCta = false;

      switch (status) {
        case SubscriptionStatus.SUBSCRIBED:
          iconProps = { type: IconTypes.SUCCESS, color: 'green' };
          break;
        case SubscriptionStatus.WAITING_APPROVAL:
          iconProps = { type: IconTypes.MINUS_CIRCLE, color: 'orange' };
          break;
        case SubscriptionStatus.REJECTED:
          iconProps = { type: IconTypes.MINUS_CIRCLE, color: 'red' };
          showCta = true;
          break;
        default:
          iconProps = { type: IconTypes.WARNING, color: 'gray' };
          break;
      }

      const statusText = getSubscriptionStatusText(t, status);
      const ctaText = getSubscriptionStatusCTAText(t, status);
      setInfo({ iconProps, statusText, showCta, ctaText });
    } else if (info) {
      // Making sure we clean it up
      setInfo(null);
    }
  }, [status, t]);

  return (
    info && (
      <Flex dataInstance={COMPONENT_NAME} {...otherProps}>
        <Icon size={20} {...info.iconProps} mr={2} />
        <Text>
          {info.statusText}
          {info.showCta && (
            <Button
              type={ButtonTypes.LINK}
              display='inline-block'
              ml={3}
              onClick={onCtaClick}
              dataInstance={`${COMPONENT_NAME}-Reconcile`}
            >
              {info.ctaText}
            </Button>
          )}
        </Text>
      </Flex>
    )
  );
};

export const CtaMenu = props => {
  const { anchorRef, onClose, onOptionClicked, options, ...otherProps } = props;

  return (
    <Popover
      type='default'
      isOpen={!!anchorRef}
      anchorRef={anchorRef}
      anchorOriginX='start'
      anchorOriginY='start'
      originX='end'
      originY='start'
      onClose={onClose}
      minWidth={200}
      padding={2}
      {...otherProps}
    >
      <ContextMenu options={options} onOptionClicked={onOptionClicked} />
    </Popover>
  );
};
