import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  ButtonTypes,
  Flex,
  Input,
  Intent,
  Link,
  Select,
  SelectTypes,
  Text,
  Textarea,
  TextTypes,
} from 'cortex-look-book';
import {
  getWorkpaperLinks,
  getWorkpaperTags,
  updateWorkpaperWithGetWorkpaperList,
} from '../../../../store/workpaper/actions';
import { workpaperSelectors } from '../../../../store/workpaper/selectors';
import { COMPONENT_NAME } from './constants';
import { isNameEndsWithDotChar } from '../../../Engagement/utils/addWorkpaperHelper';
import useTranslation, { nameSpaces } from 'src/hooks/useTranslation';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const WpEditModalContent = props => {
  const dispatch = useDispatch();
  const { t, exists } = useTranslation();
  const { workpaper, onClose, engagementId } = props;
  const TRANSLATION_KEY = 'Pages_EngagementWorkpapers_EditWorkpaperModalContent';

  const tags = useSelector(workpaperSelectors.selectTags);
  const tagsLoading = useSelector(workpaperSelectors.selectTagsLoading);
  const links = useSelector(workpaperSelectors.selectLinkList);
  const linksLoading = useSelector(workpaperSelectors.selectFetchingLinkList);

  const [wpName, setWpName] = useState(workpaper.name);
  const [wpTags, setWpTags] = useState([]);
  const [wpLink, setWpLink] = useState([]);
  const [wpDescription, setWpDescription] = useState(workpaper.description);

  const initTagsSelected = () => {
    const arr = [];
    const selectedTagIds = workpaper && workpaper.tagIds;

    if (selectedTagIds && selectedTagIds.length && tags && tags.length) {
      tags.forEach(item => {
        const foundSelectedTags = item.tags
          .filter(tag => selectedTagIds.indexOf(tag.id) !== -1)
          .map(x => {
            return {
              ...x,
              newTagName: exists(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
                ? t(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
                : x.name,
            };
          });

        arr.push(...foundSelectedTags);
      });
    }

    return arr;
  };

  const tagOptions = tags.map(x => {
    return {
      newTagName: exists(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP)
        ? t(x.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP)
        : x.name,
      newTagsChildren: x.tags.map(c => {
        return {
          newTagName: exists(c.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
            ? t(c.name, nameSpaces.TRANSLATE_NAMESPACE_DROPDOWN_TAG)
            : c.name,
          ...c,
        };
      }),
      ...x,
    };
  });

  const initLinkSelected = () => {
    const arr = [];

    if (links && links.length) {
      arr.push(...links.filter(link => link.url === workpaper.url));
    }

    return arr;
  };

  useEffect(() => {
    dispatch(getWorkpaperTags());
    dispatch(getWorkpaperLinks());
  }, [dispatch]);

  useEffect(() => {
    if (!tagsLoading) {
      setWpTags(initTagsSelected());
    }
  }, [tagsLoading]);

  useEffect(() => {
    if (!linksLoading) {
      setWpLink(initLinkSelected());
    }
  }, [linksLoading]);

  const validateBeforeRequest = () => {
    const isNameValid = typeof wpName === 'string' && wpName.length && !isNameEndsWithDotChar(wpName);
    const isLinkValid = wpLink && wpLink.length;
    const isTagsValid = wpTags && wpTags.length;

    return isNameValid && isLinkValid && isTagsValid;
  };

  const onPrimaryButtonClick = () => {
    const isDataValid = validateBeforeRequest();
    if (isDataValid) {
      const wpTagIds = wpTags.map(tag => tag.id);
      const urlItem = (wpLink || [])[0];
      const wpUrl = urlItem ? urlItem.url : '';

      dispatch(
        updateWorkpaperWithGetWorkpaperList({
          paramsUpdate: {
            id: workpaper.id,
            name: wpName,
            description: wpDescription,
            tagIds: wpTagIds,
            url: wpUrl,
            engagementId,
          },
          engagementId,
        })
      );
      onClose();
    }
  };

  const onSecondaryButtonClick = () => {
    onClose();
  };

  const getWpNameHint = name => {
    return isNameEndsWithDotChar(name) ? t('Pages_EngagementWorkpapers_CheckWorkpaperNameContainsDotAtEnd') : null;
  };

  const getWpNameIntent = name => {
    return isNameEndsWithDotChar(name) ? Intent.ERROR : null;
  };

  return (
    <>
      <Text type={TextTypes.H1} mb={25}>
        <b>{t(`${TRANSLATION_KEY}_Title`)}</b>
      </Text>

      <Text type={TextTypes.BODY} mb={5}>
        {t(`${TRANSLATION_KEY}_Description`)}
        <Link
          to='https://techlib.deloitte.com/default.aspx?view=content&id=0901ff8181101609'
          external
          target='blank'
          dataInstance={COMPONENT_NAME}
        >
          {t(`${TRANSLATION_KEY}_DescriptionLink`)}
        </Link>
      </Text>

      <Box mb={20}>
        <Input
          value={wpName}
          onChange={({ target: { value } }) => setWpName(value)}
          required
          label={t(`${TRANSLATION_KEY}_InputNameLabel`)}
          placeholder={t(`${TRANSLATION_KEY}_InputNamePlaceholder`)}
          hint={wpName ? getWpNameHint(wpName) : t(`${TRANSLATION_KEY}_InputNameHint`)}
          intent={wpName ? getWpNameIntent(wpName) : Intent.ERROR}
          dataInstance={`${COMPONENT_NAME}-Edit`}
        />
      </Box>

      <Select
        mb={20}
        required
        type={SelectTypes.MULTIPLE}
        label={t(`${TRANSLATION_KEY}_SelectTagsLabel`)}
        hint={wpTags && wpTags.length ? '' : t(`${TRANSLATION_KEY}_SelectTagsHint`)}
        intent={wpTags && wpTags.length ? null : Intent.ERROR}
        options={tagOptions}
        value={wpTags}
        onChange={setWpTags}
        filtering
        loading={tagsLoading}
        emptyMessage={t(`${TRANSLATION_KEY}_SelectTagsEmpty`)}
        optionValueKey='id'
        optionTextKey='newTagName'
        childrenListKey='newTagsChildren'
        dataInstance={`${COMPONENT_NAME}-Tag`}
      />

      <Select
        mb={20}
        required
        label={t(`${TRANSLATION_KEY}_SelectLinkLabel`)}
        hint={wpLink && wpLink.length ? '' : t(`${TRANSLATION_KEY}_SelectLinkHint`)}
        intent={wpLink && wpLink.length ? null : Intent.ERROR}
        options={links}
        value={wpLink}
        filtering
        onChange={setWpLink}
        emptyMessage={t(`${TRANSLATION_KEY}_SelectLinkHint`)}
        optionValueKey='id'
        optionTextKey='name'
        dataInstance={`${COMPONENT_NAME}-Link`}
      />

      <Box mb={20}>
        <Textarea
          value={wpDescription}
          onChange={({ target: { value } }) => setWpDescription(value)}
          label={t(`${TRANSLATION_KEY}_AreaDescriptionLabel`)}
          placeholder={t(`${TRANSLATION_KEY}_AreaDescriptionPlaceholder`)}
          dataInstance={`${COMPONENT_NAME}-Description`}
        />
      </Box>

      <Flex alignItems='center' justifyContent='flex-end'>
        <Button
          type={ButtonTypes.SECONDARY}
          onClick={onSecondaryButtonClick}
          mr={3}
          dataInstance={`${COMPONENT_NAME}-Edit-Secondary`}
        >
          {t(`${TRANSLATION_KEY}_SecButtonText`)}
        </Button>

        <Button
          type={ButtonTypes.PRIMARY}
          onClick={onPrimaryButtonClick}
          mr={2}
          dataInstance={`${COMPONENT_NAME}-Edit-Primary`}
        >
          {t(`${TRANSLATION_KEY}_PrimButtonText`)}
        </Button>
      </Flex>
    </>
  );
};
