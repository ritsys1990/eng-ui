import React from 'react';
import { Button, ButtonTypes, Flex, Text, TextTypes } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_RevertProgressModalContent';

export const WpRevertProgressModalContent = props => {
  const { workpaperName, onClose, updateReviewStatus, action } = props;
  const { t } = useTranslation();

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

      <Text type={TextTypes.BODY} mb={10}>
        {`${t(`${TRANSLATION_KEY}_Line1`)} `}
        <b>"{workpaperName}"</b>
        {t(`${TRANSLATION_KEY}_To`)}
        <b>"{t(`${TRANSLATION_KEY}_RevertProgress`)}"</b>
        &nbsp;?
      </Text>

      <Text type={TextTypes.BODY} mb={25}>
        {t(`${TRANSLATION_KEY}_Line2`)}
        {t(`${TRANSLATION_KEY}_To`)}
        <b>"{t(`${TRANSLATION_KEY}_InProgress`)}"</b>.
      </Text>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-Revert-Secondary`}
        >
          {t(`${TRANSLATION_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-Revert-Primary`}
        >
          {t(`${TRANSLATION_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </>
  );
};
