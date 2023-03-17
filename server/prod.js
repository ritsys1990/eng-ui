const express = require('express');
const path = require('path');

// Config file location vary in build.
const configPath = path.join(__dirname, '../config');
const { env } = require(configPath);

/**
 * Handles production / stage environment.
 */
const prod = app => {
  // Set headers for CSP
  app.use((req, res, next) => {
    const allowUrl = (env.ALLOW_URL_PROD || []).join(' ');
    const frameAncestors = (env.FRAME_ANCESTORS || []).join(' ');
    const allowSignalRUrl = (env.ALLOW_SIGNALR_URL || []).join(' ');

    res.set(
      'Content-Security-Policy',
      `default-src 'self' ${allowUrl}; connect-src 'self' ${allowSignalRUrl}; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${allowUrl}; frame-ancestors 'self' ${frameAncestors};`
    );
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('X-Frame-Options', 'sameorigin');

    return next();
  });

  // Serve Engagement UI build as static files.
  app.use(express.static(path.join(__dirname, '../build'), { fallthrough: true }));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build/index.html'));
  });
};

module.exports = prod;
