/**
 * Delays the thread for ms using setTimeout with a Promise.
 * @param {number} ms
 * @returns {Promise<setTimeout>}
 */
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = delay;