/**
 * Return node(s) with the given dataInstance prop
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {string} val - Value of dataInstance prop for search
 * @param {string} component - Name of the component where the attribute is located
 * @return {ShallowWrapper}
 */
export const findByInstanceProp = (wrapper, val, component = '') => {
  return wrapper.find(`${component}[dataInstance="${val}"]`);
};

/**
 * Return node(s) with the given data-instance attribute
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {string} val - Value of data-instance attribute for search
 * @param {string} component - Name of the component where the attribute is located
 * @return {ShallowWrapper}
 */
export const findByInstanceAttr = (wrapper, val, component = '') => {
  return wrapper.find(`${component}[data-instance="${val}"]`);
};

const mockDeutschLocaleText = 'Deutsch (Deutschland)';
const mockUnitedStatesLocaleText = 'English (United States)';

export const mockL10nContent = {
  Engagement_Key_From_Response_Test: 'Translated value from response',
  General_Key_From_Response_Test: 'Translated value from response with general prefix',
  // eslint-disable-next-line no-template-curly-in-string
  Engagement_Key_From_Response_Test_Sanitize: 'Translated value from response ${test1} ${test2} ${test3}',
  Dropdown_Tag_Manufacturing: 'Translated Manufacturing',
  Dropdown_TagGroup_Manufacturing: 'Translated Manufacturing',
  Dropdown_TagGroup_Transport: 'Translated Transport',
  Dropdown_Tag_Air: 'Translated Air',
  Dropdown_Country_US: 'Translated US',
};

export const userLocale = {
  preferredLanguage: 'en-US',
  userEmail: 'user@deloitte.com',
};

export const newUserLocale = {
  value: 'de-DE',
  text: mockDeutschLocaleText,
};

export const supportedLocales = [
  {
    language: mockDeutschLocaleText,
    localeCode: 'de-DE',
    nativeName: mockDeutschLocaleText,
    englishName: 'German (Germany)',
    nativeCountryName: 'Deutschland',
    englishCountryName: 'Germany',
  },
  {
    language: mockUnitedStatesLocaleText,
    localeCode: 'en-US',
    nativeName: mockUnitedStatesLocaleText,
    englishName: mockUnitedStatesLocaleText,
    nativeCountryName: 'United States',
    englishCountryName: 'United States',
  },
  {
    language: 'français (France)',
    localeCode: 'fr-FR',
    nativeName: 'français (France)',
    englishName: 'French (France)',
    nativeCountryName: 'France',
    englishCountryName: 'France',
  },
  {
    language: '中文(中华人民共和国)',
    localeCode: 'zh-CN',
    nativeName: '中文(中华人民共和国)',
    englishName: 'Chinese (Simplified, China)',
    nativeCountryName: '中华人民共和国',
    englishCountryName: 'Simplified, China',
  },
];
