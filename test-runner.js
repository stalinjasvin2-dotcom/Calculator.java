/**
 * Automated test runner for the Simple CLI Calculator (JavaScript).
 * Executes the same 15 scenarios used in the Excel test case tracker,
 * directly against the functions in calculator.js, and writes the
 * results to a JSON file for reporting.
 */

const fs = require("fs");
const calc = require("./calculator");

const TEST_CASES = [
  { id: "TC01", scenario: "Addition of two positive numbers", steps: "Call add(5, 3)", expected: "8", check: "value", fn: "add", inputs: [5, 3], expectedValue: 8 },
  { id: "TC02", scenario: "Addition with a negative number", steps: "Call add(-5, 3)", expected: "-2", check: "value", fn: "add", inputs: [-5, 3], expectedValue: -2 },
  { id: "TC03", scenario: "Subtraction of two positive numbers", steps: "Call subtract(10, 4)", expected: "6", check: "value", fn: "subtract", inputs: [10, 4], expectedValue: 6 },
  { id: "TC04", scenario: "Subtraction resulting in a negative number", steps: "Call subtract(3, 10)", expected: "-7", check: "value", fn: "subtract", inputs: [3, 10], expectedValue: -7 },
  { id: "TC05", scenario: "Multiplication of two positive numbers", steps: "Call multiply(6, 7)", expected: "42", check: "value", fn: "multiply", inputs: [6, 7], expectedValue: 42 },
  { id: "TC06", scenario: "Multiplication by zero", steps: "Call multiply(5, 0)", expected: "0", check: "value", fn: "multiply", inputs: [5, 0], expectedValue: 0 },
  { id: "TC07", scenario: "Normal division", steps: "Call divide(10, 2)", expected: "5", check: "value", fn: "divide", inputs: [10, 2], expectedValue: 5 },
  { id: "TC08", scenario: "Division by zero", steps: "Call divide(10, 0)", expected: "Program shows a friendly error message (e.g. 'Error: Cannot divide by zero') and does NOT show Infinity/NaN", check: "graceful_error", fn: "divide", inputs: [10, 0] },
  { id: "TC09", scenario: "Division producing a decimal result", steps: "Call divide(7, 2)", expected: "3.5", check: "value", fn: "divide", inputs: [7, 2], expectedValue: 3.5 },
  { id: "TC10", scenario: "Power / exponent calculation", steps: "Call power(2, 3)", expected: "8", check: "value", fn: "power", inputs: [2, 3], expectedValue: 8 },
  { id: "TC11", scenario: "Square root of a positive number", steps: "Call squareRoot(16)", expected: "4", check: "value", fn: "squareRoot", inputs: [16], expectedValue: 4 },
  { id: "TC12", scenario: "Square root of a negative number", steps: "Call squareRoot(-9)", expected: "Program shows a friendly error message (e.g. 'Error: Cannot compute square root of a negative number') and does NOT show NaN", check: "graceful_error", fn: "squareRoot", inputs: [-9] },
  { id: "TC13", scenario: "Addition with decimal numbers", steps: "Call add(2.5, 3.1)", expected: "5.6", check: "value", fn: "add", inputs: [2.5, 3.1], expectedValue: 5.6 },
  { id: "TC14", scenario: "Multiplication with large numbers", steps: "Call multiply(123456, 789)", expected: "97406784", check: "value", fn: "multiply", inputs: [123456, 789], expectedValue: 97406784 },
  { id: "TC15", scenario: "Divide two negative numbers", steps: "Call divide(-20, -4)", expected: "5", check: "value", fn: "divide", inputs: [-20, -4], expectedValue: 5 },
];

// Functions that already return a display-ready string (error-aware).
const STRING_RETURNING = new Set(["divide", "squareRoot"]);

function isClose(actualStr, expected) {
  const n = Number(actualStr);
  if (Number.isNaN(n)) return false;
  return Math.abs(n - expected) < 1e-6;
}

function runTests() {
  const results = [];

  for (const tc of TEST_CASES) {
    let actual;
    let status;
    try {
      const raw = calc[tc.fn](...tc.inputs);
      actual = STRING_RENDERED(tc.fn, raw);

      if (tc.check === "value") {
        status = isClose(actual, tc.expectedValue) ? "PASS" : "FAIL";
      } else {
        status = actual.startsWith("Error") ? "PASS" : "FAIL";
      }
    } catch (e) {
      actual = `CRASHED - ${e.name}: ${e.message}`;
      status = "FAIL";
    }

    results.push({
      id: tc.id,
      scenario: tc.scenario,
      steps: tc.steps,
      expected: tc.expected,
      actual,
      status,
    });
  }

  return results;
}

function STRING_RENDERED(fnName, raw) {
  // divide/squareRoot already return formatted strings (numeric or "Error: ...").
  // add/subtract/multiply/power return raw numbers that still need formatting.
  return STRING_RETURNING.has(fnName) ? raw : calc.formatNumber(raw);
}

function main() {
  const results = runTests();
  const passed = results.filter((r) => r.status === "PASS").length;

  for (const r of results) {
    console.log(`[${r.status}] ${r.id} - ${r.scenario}`);
    console.log(`        Expected: ${r.expected}`);
    console.log(`        Actual  : ${r.actual}`);
  }

  console.log("\n---------------------------------------------");
  console.log(`Version under test: ${calc.VERSION}`);
  console.log(`Total: ${results.length}  Passed: ${passed}  Failed: ${results.length - passed}`);
  console.log("---------------------------------------------");

  const outPath = `results_v${calc.VERSION}.json`;
  fs.writeFileSync(outPath, JSON.stringify({ version: calc.VERSION, results }, null, 2));
  console.log(`Results written to ${outPath}`);

  process.exit(results.length - passed === 0 ? 0 : 1);
}

main();
