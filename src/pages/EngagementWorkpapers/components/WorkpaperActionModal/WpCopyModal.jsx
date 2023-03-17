import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonTypes, Flex, Spinner, Text, TextTypes } from 'cortex-look-book';

import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { copyWorkpaper } from '../../../../store/workpaper/actions';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_CopyWorkpaperModalContent';
const COMPONENT_NAME = 'CopyWorkpaper';

export const WpCopyModalContent = props => {
  const { t } = useTranslation();
  const { workpaper, onClose } = props;

  const isCopying = useSelector(workpaperSelectors.selectIsCopyingWorkpaper);
  const dispatch = useDispatch();

  const onPrimaryButtonClick = () => {
    dispatch(copyWorkpaper(workpaper.id)).then(() => {
      onClose();
    });
  };

  const onSecondaryButtonClick = () => {
    onClose();
  };

  return (
    <Spinner spinning={isCopying} label={t(`${TRANSLATION_KEY}_Spinner`)}>
      <Text type={TextTypes.H1} mb={25}>
        <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
      </Text>

      <Text type={TextTypes.BODY} mb={20}>
        {t(`${TRANSLATION_KEY}_Line`)}
        <b>"{workpaper?.name}"</b>
        &nbsp;
        {t(`${TRANSLATION_KEY}_QuestionMark`)}
      </Text>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-Secondary`}
        >
          {t(`${TRANSLATION_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-Primary`}
        >
          {t(`${TRANSLATION_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </Spinner>
  );
};
