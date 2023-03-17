import { useSelector } from 'react-redux';
import { settingsSelectors } from '../store/settings/selectors';
import fallback from '../languages/fallback.json';
import { useEffect, useState } from 'react';

const PLACEHOLDER_PATTERN = /[${}]/g;

export const nameSpaces = {
  TRANSLATE_NAMESPACE_ENGAGEMENT: 'Engagement_',
  TRANSLATE_NAMESPACE_GENERAL: 'General_',
  TRANSLATE_NAMESPACE_DROPDOWN_COUNTRY: 'Dropdown_Country_',
  TRANSLATE_NAMESPACE_DROPDOWN_TAG: 'Dropdown_Tag_',
  TRANSLATE_NAMESPACE_DROPDOWN_TAG_GROUP: 'Dropdown_TagGroup_',
};

export const getTranslation = content => {
  const sanitizeString = value => {
    // remove $ in keys that have {}, the BE is returning them this way, to avoid being translated in the portal
    return value.replace(PLACEHOLDER_PATTERN, '').trim();
  };

  const t = (key, namespace = nameSpaces.TRANSLATE_NAMESPACE_ENGAGEMENT) => {
    const newKey = `${namespace}${key}`;

    if (content && content[newKey]) {
      return sanitizeString(content[newKey]);
    } else if (fallback && fallback[newKey]) {
      return sanitizeString(fallback[newKey]);
    }

    return newKey;
  };

  const exists = (key, namespace = nameSpaces.TRANSLATE_NAMESPACE_ENGAGEMENT) => {
    const newKey = `${namespace}${key}`;
    const translation = t(key, namespace);

    return newKey !== translation;
  };

  return { t, exists };
};

const useTranslation = () => {
  const content = useSelector(settingsSelectors.selectLocalization);
  const [translation, setTranslation] = useState(getTranslation(content));

  useEffect(() => {
    setTranslation(getTranslation(content));
  }, [content]);

  return translation;
};

export default useTranslation;
