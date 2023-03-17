import React, { useEffect, useCallback } from 'react';
import { Link, Notification, Spinner, Text, TextTypes } from 'cortex-look-book';
import { useDispatch, useSelector } from 'react-redux';
import env from 'env';

import { ListBody, ListHeader, StyledHeaderNotificationList, StyledTabText } from './StyledHeaderNotificationList';
import { getAllHeader, getUnreadCount, markAsRead } from '../../store/notifications/actions';
import { notificationSelectors } from '../../store/notifications/selectors';
import useTranslation from 'src/hooks/useTranslation';

const NOTIFICATION_LIMIT = 5;
const COMPONENT_NAME = 'HeaderNotificationList';

const HeaderNotificationList = () => {
  const { t } = useTranslation();
  const notifications = useSelector(notificationSelectors.selectAllHeaderList)?.items;

  const isFetching = useSelector(notificationSelectors.selectFetchingAllHeader);
  const initialFetch = useSelector(notificationSelectors.selectAllHeaderFetched);

  const dispatch = useDispatch();

  const handleMarkAsRead = (id, isRead) => {
    if (!isRead) {
      dispatch(markAsRead([id])).then(() => {
        dispatch(getAllHeader(NOTIFICATION_LIMIT, 0));
        dispatch(getUnreadCount());
      });
    }
  };

  const renderNotificationsList = useCallback(() => {
    if (notifications.length > 0) {
      return notifications.map((el, index) => (
        <Notification
          key={el.id}
          creationDate={el.creationDate}
          description={el.text}
          isRead={el.isRead}
          title={el.title}
          type={el.type}
          onClick={() => {
            handleMarkAsRead(el.id, el.isRead);
          }}
          dataInstance={`${COMPONENT_NAME}-${index}`}
        />
      ));
    } else if (initialFetch) {
      return (
        <Text forwardedAs='p' type={TextTypes.H4} mt={3} textAlign='center' dataInstance={`${COMPONENT_NAME}_Text`}>
          {t('Components_HeaderNotificationList_NoMessages')}
        </Text>
      );
    }

    return null;
  }, [notifications, t, initialFetch]);

  useEffect(() => {
    dispatch(getAllHeader(NOTIFICATION_LIMIT, 0));
  }, [dispatch]);

  return (
    <StyledHeaderNotificationList dataInstance={COMPONENT_NAME}>
      <ListHeader justifyContent='space-between' alignItems='center'>
        <StyledTabText type={TextTypes.BODY} fontWeight='l'>
          {t('Components_HeaderNotificationList_Recent')}
        </StyledTabText>
        <Link external fontSize='s' fontWeight='l' to={`${env.EXTRACTIONUI_URL}/notifications`}>
          {t('Components_HeaderNotificationList_GoToAll')}
        </Link>
      </ListHeader>
      <Spinner spinning={isFetching}>
        <ListBody>{renderNotificationsList()}</ListBody>
      </Spinner>
    </StyledHeaderNotificationList>
  );
};

export default HeaderNotificationList;
