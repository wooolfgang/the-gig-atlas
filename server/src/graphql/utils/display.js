/* eslint-disable no-console */
const util = require('util');

/**
 * Display full object content to terminal
 * @param {object} obj object to display
 */
export function fullDisplay(obj) {
  console.log(util.inspect(obj, false, null, /* !!colors */ true));
}
