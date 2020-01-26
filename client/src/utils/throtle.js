/**
 * Create a throtle callback function
 * Throttling is configured as a threshold on the maximum number of
 * requests that can be made during a specific time period.
 * @param {number} wait time in miliseconds
 * @param {function} cb callback
 */
export default function createThrottle(wait, cb) {
  let timeout = null;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      cb(...args);
    }, wait);
  };
}
