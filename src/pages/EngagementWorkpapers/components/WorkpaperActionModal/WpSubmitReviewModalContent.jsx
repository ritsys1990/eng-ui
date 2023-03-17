import React from 'react';
import { Button, ButtonTypes, Flex, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants';
import { SUBMIT_REVIEW_TRANS_KEY } from '../../constants/SubmitReview.const';
import useTranslation from 'src/hooks/useTranslation';

export const WpSubmitReviewModalContent = props => {
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
        <b>{t(`${SUBMIT_REVIEW_TRANS_KEY}_Title`)}</b>
      </Text>

      <Text type={TextTypes.BODY} mb={10}>
        {`${t(`${SUBMIT_REVIEW_TRANS_KEY}_Line1`)} `}
        <b>"{workpaperName}"</b>
        {t(`${SUBMIT_REVIEW_TRANS_KEY}_To`)}
        <b>"{t(`${SUBMIT_REVIEW_TRANS_KEY}_SubmitReview`)}"</b>
        &nbsp;?
      </Text>

      <Text type={TextTypes.BODY} mb={25}>
        {t(`${SUBMIT_REVIEW_TRANS_KEY}_Line2`)}
        <b> "{t(`${SUBMIT_REVIEW_TRANS_KEY}_InProgress`)}"</b>
        {t(`${SUBMIT_REVIEW_TRANS_KEY}_To`)}
        <b>"{t(`${SUBMIT_REVIEW_TRANS_KEY}_SubmitReview`)}"</b>.
      </Text>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-Submit-Secondary`}
        >
          {t(`${SUBMIT_REVIEW_TRANS_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-Submit-Primary`}
        >
          {t(`${SUBMIT_REVIEW_TRANS_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </>
  );
};
