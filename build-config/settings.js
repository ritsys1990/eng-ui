const settings = {
  // Useful for determining whether we’re running in production mode.
  // Most importantly, it switches React into the correct mode.
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Useful for resolving the correct path to static assets in `public`.
  // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
  // This should only be used as an escape hatch. Normally you would put
  // images into the `src` and `import` them in code to get their paths.
  PUBLIC_URL: '',
  ADOBE_ACCOUNT: JSON.parse(
    JSON.stringify(
      process.env.ADOBE_ACCOUNT ||
        '//assets.adobedtm.com/571f1a0c43d6/40facd7a1d99/launch-b71a20d6dbca-development.min.js'
    )
  ),
};

module.exports = settings;
