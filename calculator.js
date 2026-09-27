/**
 * Simple CLI Calculator - core arithmetic logic.
 * Version: 1.0.0
 *
 * Supports: addition, subtraction, multiplication, division,
 * power, and square root.
 */

const VERSION = "1.1.0";

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

// FIXED in 1.1.0: division by zero now returns a friendly error
// message instead of silently producing "Infinity".
function divide(a, b) {
  if (b === 0) {
    return "Error: Cannot divide by zero";
  }
  return formatNumber(a / b);
}

function power(a, b) {
  return Math.pow(a, b);
}

// FIXED in 1.1.0: negative input now returns a friendly error
// message instead of silently producing "NaN".
function squareRoot(a) {
  if (a < 0) {
    return "Error: Cannot compute square root of a negative number";
  }
  return formatNumber(Math.sqrt(a));
}

/** Formats a number without a trailing ".0"-style noise for whole numbers. */
function formatNumber(value) {
  if (Number.isNaN(value)) return "NaN";
  if (value === Infinity) return "Infinity";
  if (value === -Infinity) return "-Infinity";
  // Round to 10 decimal places to avoid floating-point noise (e.g. 5.6000000000000005)
  const rounded = Math.round(value * 1e10) / 1e10;
  return String(rounded);
}

module.exports = {
  VERSION,
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  formatNumber,
};
