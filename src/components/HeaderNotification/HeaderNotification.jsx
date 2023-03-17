import React, { useEffect, useRef, useState } from 'react';
import { Badge, ButtonTypes, IconTypes, Popover, PopoverOrigin, useInterval } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import { StyledNotificationsButton } from './StyledHeaderNotification';
import HeaderNotificationList from '../HeaderNotificationList/HeaderNotificationList';
import { getAllHeader, getUnreadCount } from '../../store/notifications/actions';
import { notificationSelectors } from '../../store/notifications/selectors';

const COMPONENT_NAME = 'HeaderNotification';

const HeaderNotification = () => {
  const REFRESH_INTERVAL = 60 * 1000; // 1 minute
  const NOTIFICATION_LIMIT = 5;
  const MAX_NOTIFICATIONS_BADGE = 99;

  const containerRef = useRef();

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useSelector(notificationSelectors.selectUnreadCounts);
  const isFetching = useSelector(notificationSelectors.selectIsFetchingUnreadCount);

  const refreshUnreadCount = async () => {
    dispatch(getUnreadCount()).then(() => {
      if (isOpen) {
        dispatch(getAllHeader(NOTIFICATION_LIMIT, 0));
      }
    });
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handlePopoverOnClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    refreshUnreadCount();
  }, []);

  useInterval(() => {
    if (!isFetching) {
      refreshUnreadCount();
    }
  }, REFRESH_INTERVAL);

  return (
    <>
      <div ref={containerRef}>
        <StyledNotificationsButton
          type={ButtonTypes.FLAT}
          icon={IconTypes.NOTIFICATIONS}
          iconWidth={20}
          onClick={handleButtonClick}
          dataInstance={COMPONENT_NAME}
        />
      </div>

      {unreadCount > 0 ? (
        <Badge
          cursor='pointer'
          onClick={handleButtonClick}
          value={unreadCount > MAX_NOTIFICATIONS_BADGE ? '99+' : unreadCount}
          dataInstance={`${COMPONENT_NAME}_Badge`}
        />
      ) : null}

      <Popover
        isOpen={isOpen}
        anchorRef={containerRef}
        anchorOriginX={PopoverOrigin.END}
        anchorOriginY={PopoverOrigin.END}
        originX={PopoverOrigin.END}
        originY={PopoverOrigin.START}
        onClose={handlePopoverOnClose}
        mt={7}
        dataInstance={`${COMPONENT_NAME}_Popover`}
      >
        <HeaderNotificationList />
      </Popover>
    </>
  );
};

export default HeaderNotification;
