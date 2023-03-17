/**
 * This module wraps the runtime public enviroment for clients.
 * This is different than CRA env files, since those are for
 * build time environment.
 *
 */
// eslint-disable-next-line no-underscore-dangle
const env = window._env_ || {};
export default env;
