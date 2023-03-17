const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const app = express();

// Arguments
const args = process.argv.slice(2);

// Process Env
process.env.NODE_ENV = args[0] || process.env.NODE_ENV || 'development';

// Config file location vary in build.
const configPath = path.join(__dirname, '../config');
const { env, clientEnv } = require(configPath);

// Initializing the Proxy
const proxy = httpProxy.createProxyServer({
  secure: false,
  ignorePath: true,
  changeOrigin: true,
  timeout: env.PROXY_TIMEOUT * 60000,
});

/**
 * Proxy Endpoint
 */
app.all('/proxy/:service/*', (req, res) => {
  const { service } = req.params;
  const envName = `${service.replace('-service', '').toUpperCase()}_URL`;
  let baseUrl = env[envName];
  if (!baseUrl) {
    throw new Error(`No url for service: ${service} (${envName})`);
  }
  baseUrl = baseUrl.replace(/\/$/, '');
  const path = req.url.replace(`/proxy/${service}`, '').replace(/\/$/, '');
  const target = `${baseUrl}${path}`;
  proxy.web(req, res, { target }, e => res.status(502).end(e.message));
});

proxy.on('proxyRes', (proxyRes, req, res) => {
  res.set('Content-Security-Policy', `default-src 'self'; child-src 'none'`);
  res.set('Cache-Control', 'no-cache, no-store');
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('X-XSS-Protection', '1; mode=block');
  res.set('X-Frame-Options', 'sameorigin');
});

/**
 * Server client env file.
 */
app.get('/env/env.js', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store');
  res.set('Pragma', 'no-cache');
  res.contentType('text/javscript');
  res.end(`window._env_ = ${JSON.stringify(clientEnv)}`);
});

// Include the correct handler for the process environment.
process.env.NODE_ENV === 'development'
  ? require(path.join(__dirname, './dev'))(app)
  : require(path.join(__dirname, './prod'))(app);

const port = process.env.PORT || 3000;
app.listen(port);

// Adding a banner, so it's easy to find in logs, when the app
// started.
// Consider moving this to a helper module or using a libary.
const banner = `
___________________________________________________________________

  ░█▀▀▀ █▀▀▄ █▀▀▀ █▀▀█ █▀▀▀ █▀▀ █▀▄▀█ █▀▀ █▀▀▄ ▀▀█▀▀    ░█ ░█ ▀█▀
  ░█▀▀▀ █  █ █ ▀█ █▄▄█ █ ▀█ █▀▀ █ ▀ █ █▀▀ █  █   █   ▀▀ ░█ ░█ ░█
  ░█▄▄▄ ▀  ▀ ▀▀▀▀ ▀──▀ ▀▀▀▀ ▀▀▀ ▀   ▀ ▀▀▀ ▀  ▀   ▀       ▀▄▄▀ ▄█▄

  Engagement UI Listening on Port: ${port}
___________________________________________________________________
`;
console.log(banner);
