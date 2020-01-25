/**
 * Generates a number from 0 to max
 * @param {number} max
 * @returns {number}
 */
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

module.exports = getRandomInt;