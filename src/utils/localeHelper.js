export const getBrowserLocale = supportedLocales => {
  if (supportedLocales && supportedLocales.length) {
    let browserLocale;
    for (let i = 0; i < navigator.languages.length; i++) {
      browserLocale = supportedLocales.find(
        locale => locale.value === navigator.languages[0] || locale.value.substring(0, 2) === navigator.languages[0]
      );
      if (browserLocale) {
        return browserLocale;
      }
    }
  }

  return { value: 'en-US', text: `English (United States)` };
};
