/**
 * This mocks the client env by taking the configuration
 * directly from config. This should never happen in the
 * main version, since this should come from the server.
 *
 */
const { clientEnv: env } = require('../../config');

export default env;
