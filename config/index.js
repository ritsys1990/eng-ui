const fs = require('fs');
const path = require('path');

const stage = process.env.STAGE || 'dev';
const defaultConfigFile = path.resolve(__dirname, `./default.json`);
const stageConfigFile = path.resolve(__dirname, `./${stage}.json`);

if (!stage) {
  throw new Error(`Stage is not set, I can't guess which environment this is.`);
}

if (!fs.existsSync(stageConfigFile)) {
  throw new Error(
    `default environment file is required but couldn't be loaded.
    at: ${defaultConfigFile}`
  );
}

if (!fs.existsSync(stageConfigFile)) {
  throw new Error(
    `${stage} environment file is required but couldn't be loaded.
    at: ${stageConfigFile}`
  );
}

const defaultConfig = require(defaultConfigFile);
const stageConfig = require(stageConfigFile);
const env = { ...defaultConfig, ...stageConfig };
const clientEnv = Object.keys(env)
  .filter(k => (env.PUBLIC || []).indexOf(k) > -1)
  .reduce((obj, key) => ({ ...obj, [key]: env[key] }), {});

module.exports = { env, clientEnv };
