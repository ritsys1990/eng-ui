import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Select, SelectTypes, Text, TextTypes } from 'cortex-look-book';
import useTranslation from 'src/hooks/useTranslation';
import { settingsSelectors } from '../../store/settings/selectors';
import { setLocale } from '../../store/settings/actions';

export const COMPONENT_NAME = 'LanguageSelect';

const LanguageSelect = ({ setLanguageSelectIsOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const supportedLocales = useSelector(settingsSelectors.selectSupportedLocales);
  const defaultSupportedLocales = useSelector(settingsSelectors.selectDefaultSupportedLocales);
  const locale = useSelector(settingsSelectors.selectLocale);
  let optionsSupportedLocales;
  if (supportedLocales && supportedLocales.length) {
    optionsSupportedLocales = supportedLocales;
  } else {
    optionsSupportedLocales = defaultSupportedLocales;
  }
  const onChange = value => {
    if (value.length) {
      dispatch(setLocale(value[0]));
    }
    if (setLanguageSelectIsOpen) {
      setLanguageSelectIsOpen(false);
    }
  };

  return (
    <Select
      label={t('Components_HeaderProfile_MenuOption_Language')}
      options={optionsSupportedLocales}
      type={SelectTypes.SINGLE}
      filtering={false}
      value={[locale]}
      onChange={onChange}
      dataInstance={COMPONENT_NAME}
      customRenderSelected={(option, index) => (
        <Text key={index} type={TextTypes.BODY} color='black'>
          {option.text}
        </Text>
      )}
    />
  );
};

export default LanguageSelect;
