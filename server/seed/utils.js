/* eslint-disable no-console */
const util = require('util');

export function fullDisplay(obj) {
  console.log(util.inspect(obj, false, null, /* enable colors */ true));
}
