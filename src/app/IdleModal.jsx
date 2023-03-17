import React, { useEffect, useState } from 'react';
import { CountDown, Flex, Modal, ModalSizes, Text, TextTypes, useInterval } from 'cortex-look-book';
import { throttle } from 'lodash';
import env from 'env';
import { getValue, saveValue } from '../utils/localStorageHelper';
import useTranslation from 'src/hooks/useTranslation';
import { logoutWrapper } from '../utils/logoutHelper';

// Event types that dertermine user activity.
const EVENTS = ['mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
// To avoid unnecesary processing, we trottle the event handler.
const EVENTS_TROTTLE = 1000;
// Defines when the session should be marked as idle.
const IDLE_TIMEOUT = (env.APP_IDLE_TIMEOUT || 15) * 60 * 1000;
// The grace time given to the user to activate it's session.
const IDLE_COUNT_DOWN = 5 * 60 * 1000;
// How often the system will check for idle state.
const CHECK_FREQ = 5000;

const IdleModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [deadline, setDeadline] = useState(null);

  useEffect(() => {
    saveValue('lastAction', new Date().getTime());
  }, []);

  const handleContinue = () => {
    setIsOpen(false);
    setDeadline(null);
  };

  const actionHandler = throttle(() => {
    if (!deadline) {
      saveValue('lastAction', new Date().getTime());
    }
  }, EVENTS_TROTTLE);

  const onTimerTick = () => {
    const now = new Date().getTime();
    const idleWhen = parseInt(getValue('lastAction'), 10) + IDLE_TIMEOUT;
    if (!isOpen && idleWhen < now) {
      setIsOpen(true);
      setDeadline(idleWhen + IDLE_COUNT_DOWN);
    }
    if (idleWhen > now) {
      handleContinue();
    }
  };

  useInterval(onTimerTick, CHECK_FREQ);

  useEffect(() => {
    EVENTS.forEach(event => {
      window.addEventListener(event, actionHandler);
    });

    return () => {
      EVENTS.forEach(event => {
        window.removeEventListener(event, actionHandler);
      });
    };
  });

  const handleCountDownEnd = () => {
    logoutWrapper();
  };

  return (
    <Modal
      isOpen={isOpen}
      size={ModalSizes.SMALL}
      primaryButtonText={t('Components_IdleModal_PrimaryBtnText')}
      onPrimaryButtonClick={handleContinue}
    >
      <Text type={TextTypes.H2} fontWight='l'>
        {t('Components_IdleModal_Title')}
      </Text>
      <Text type={TextTypes.BODY} mt='6'>
        {t('Components_IdleModal_Body')}
      </Text>
      <Flex justifyContent='center'>
        <CountDown deadline={deadline} onEnd={handleCountDownEnd} width='260px' my='4' />
      </Flex>
    </Modal>
  );
};

export default IdleModal;
