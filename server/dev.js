const express = require('express');
const paths = require('../build-config/paths');
const path = require('path');
const configFactory = require('../build-config/webpack.config');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const { createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const appName = require(paths.appPackageJson).name;
const config = configFactory('development');
const publicPath = path.resolve(__dirname, '../public');
const urls = prepareUrls('http', 'localhost', 3000);
const url = require('url');
const fs = require('fs');

// Config file location vary in build.
const configPath = path.join(__dirname, '../config');
const { env } = require(configPath);

// Create a compiler for
const compiler = createCompiler({
  appName,
  config,
  webpack,
  urls,
});

// Allow URLs for CORs
const allowUrl = (env.ALLOW_URL_PROD || []).join(' ');
const allowSignalRUrl = (env.ALLOW_SIGNALR_URL || []).join(' ');
const frameAncestors = (env.FRAME_ANCESTORS || []).join(' ');

// webpack dev middleware instance.
const instance = middleware(compiler, {
  index: true,
  noInfo: true,
  publicPath: config.output.publicPath,
  headers: {
    'Content-Security-Policy': `default-src 'self' ${allowUrl}; connect-src 'self' ${allowSignalRUrl}; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${allowUrl}; frame-ancestors 'self' ${frameAncestors} localhost:*;`,
  },
});

// Host public folder
const statics = express.static(publicPath, { index: false });

/**
 * Handles local dev environment.
 */
const dev = app => {
  /**
   * SPA rewrite midddleware.
   * If it's not a file request, then rewrite to /
   */
  app.use((req, res, next) => {
    if (!/(\.(?!html)\w+$|__webpack.*)/.test(req.url)) {
      req.url = '/';
    }
    next();
  });

  /**
   * Server public folder, if file not exists, fallback to webpack
   * in memory build files.
   */
  app.get('*', (req, res, next) => {
    const urlPath = url.parse(req.url).pathname;
    const filename = path.join(publicPath, urlPath);
    if (!fs.existsSync(filename)) {
      return next();
    }
    statics(req, res, next);
  });

  /**
   * Everything else goes to webpack.
   */
  app.use(instance);

  /**
   * Hot module webpack middleware.
   */
  app.use(
    hotMiddleware(compiler, {
      log: console.log,
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  );
};

module.exports = dev;
