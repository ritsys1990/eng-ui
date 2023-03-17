import React from 'react';
import { Button, ButtonTypes, Flex, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_ReturnPreparerModalContent';

export const WpReturnPreparerModalContent = props => {
  const { t } = useTranslation();
  const { workpaperName, onClose, updateReviewStatus, action } = props;

  const onPrimaryButtonClick = () => {
    updateReviewStatus(action);
    onClose();
  };

  const onSecondaryButtonClick = () => {
    onClose();
  };

  return (
    <>
      <Text type={TextTypes.H1} mb={25}>
        <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
      </Text>

      <Text type={TextTypes.BODY} mb={5}>
        {`${t(`${TRANSLATION_KEY}_Line1`)} `}
        <b>"{workpaperName}"</b>
        {t(`${TRANSLATION_KEY}_To`)}
        <b>"{t(`${TRANSLATION_KEY}_ReturnPreparer`)}"</b>
        &nbsp;?
      </Text>

      <Text type={TextTypes.BODY} mb={25}>
        {t(`${TRANSLATION_KEY}_Line2`)}
        <b>"{t(`${TRANSLATION_KEY}_SubmitReview`)}"</b>
        {t(`${TRANSLATION_KEY}_To`)}
        <b>"{t(`${TRANSLATION_KEY}_InProgress`)}"</b>.
      </Text>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-Return-Secondary`}
        >
          {t(`${TRANSLATION_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-Return-Primary`}
        >
          {t(`${TRANSLATION_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </>
  );
};
