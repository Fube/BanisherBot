/**
 * Generates a number in range of min and max
 * @param {number} [min=0] Minimum of range
 * @param {number} [max=10] Maximum of range
 */
const rng = (min = 0, max = 10) => Math.floor(Math.random() * (parseInt(max) - parseInt(min))+ parseInt(min));

module.exports = rng;