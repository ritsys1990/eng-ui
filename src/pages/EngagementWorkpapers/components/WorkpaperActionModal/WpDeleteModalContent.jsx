import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonTypes, Flex, Text, TextTypes, Spinner } from 'cortex-look-book';
import { COMPONENT_NAME } from './constants';
import { deleteWorkpaperWithGetWorkpaperList, getWorkpapersList } from '../../../../store/workpaper/actions';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import useTranslation from 'src/hooks/useTranslation';

const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_DeleteWorkpaperModalContent';

export const WpDeleteModalContent = props => {
  const { workpaperName, onClose, workpaperId, engagementId } = props;
  const { t } = useTranslation();
  const isDeleting = useSelector(workpaperSelectors.selectIsDeletingWorkpaper);
  const dispatch = useDispatch();

  const onPrimaryButtonClick = () => {
    dispatch(deleteWorkpaperWithGetWorkpaperList({ workpaperId })).then(async () => {
      onClose();
      await dispatch(getWorkpapersList(`?engagementId=${engagementId}`));
    });
  };

  const onSecondaryButtonClick = () => {
    onClose();
  };

  return (
    <Spinner spinning={isDeleting} label={t(`${TRANSLATION_KEY}_Spinner`)}>
      <Text type={TextTypes.H1} mb={25}>
        <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
      </Text>

      <Text type={TextTypes.BODY} mb={20}>
        {t(`${TRANSLATION_KEY}_Line1`)}
      </Text>
      <Text type={TextTypes.BODY} mb={25}>
        {t(`${TRANSLATION_KEY}_Line2`)}
        <b>"{workpaperName}"</b>
        &nbsp;
        {t(`${TRANSLATION_KEY}_Workpaper`)}
      </Text>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-DeleteContent-Secondary`}
        >
          {t(`${TRANSLATION_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-DeleteContent-Primary`}
        >
          {t(`${TRANSLATION_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </Spinner>
  );
};
