/**
 * Tableau is imported from CDN as a global var.
 * We might consider using an npm cache package in the futuge.
 */
// eslint-disable-next-line no-underscore-dangle
const tableau = window.tableau || {};
export default tableau;
