// ================================
// ✅ Simple Evaluator Test Runner
// For evaluator.js with global env
// ================================

import chalk from "chalk";
import parse from "../src/parser.js";
import evaluate from "../src/evaluator.js";
import { tokenize } from "../src/lexer.js";

// 🧪 Test cases
const testCases = [
  {
    description: "variable declaration and arithmetic",
    input: "let x = 2 + 3",
    expectedEnv: { x: 5 },
    expectedOutput: [],
  },
  {
    description: "print literal string",
    input: 'print "Hello"',
    expectedEnv: {},
    expectedOutput: ["Hello"],
  },
  {
    description: "variable usage in print",
    input: "let a = 7\nprint a",
    expectedEnv: { a: 7 },
    expectedOutput: ["7"],
  },
  {
    description: "nested expression and variable",
    input: "let a = 2 + 3 * 4\nprint a",
    expectedEnv: { a: 14 },
    expectedOutput: ["14"],
  },

  // Test case: function with no params and no return
  {
    description: "function without return or params",
    input: 'function greet() { print "Hello World" } greet()',
    expectedEnv: {},
    expectedOutput: ["Hello World"],
  },

  // Test case: function with parameters and return using `dede`
  {
    description: "function with params and return using `dede`",
    input: "function sum(a, b) { dede a + b } let res = sum(5, 10) print res",
    expectedEnv: { res: 15 },
    expectedOutput: ["15"],
  },

  // Test case: calling function with literals
  {
    description: "calling function with literals",
    input: "print sum(5, 10)",
    expectedEnv: {},
    expectedOutput: ["15"],
  },

  // Test case: function with variables and return using `dede`
  {
    description: "calling function with variables",
    input:
      "let num1 = 5\nlet num2 = 10\nlet result = sum(num1, num2)\nprint result",
    expectedEnv: { num1: 5, num2: 10, result: 15 },
    expectedOutput: ["15"],
  },
];

// 🔁 Patch console.log to capture output
let capturedOutput = [];
const originalLog = console.log;
console.log = (...args) => capturedOutput.push(args.join(" "));

// 🧪 Run the tests
function runEvaluatorTests() {
  console.log(chalk.yellow("\n🏁 Running evaluator tests...\n"));

  for (let i = 0; i < testCases.length; i++) {
    const { input, expectedEnv, expectedOutput, description } = testCases[i];

    // Reset environment and output
    capturedOutput = [];
    const env = {}; // Reset environment for each test case

    try {
      const tokens = tokenize(input);
      const ast = parse(tokens);
      evaluate(ast); // Execute the evaluation of the AST

      // Compare console output
      const outputOK =
        JSON.stringify(capturedOutput) === JSON.stringify(expectedOutput);

      // Compare environment
      const envOK = Object.entries(expectedEnv).every(
        ([key, val]) => env[key] === val
      );

      if (outputOK && envOK) {
        console.log(chalk.green(`✔ Test ${i + 1}: ${description}`));
      } else {
        console.log(chalk.red(`✖ Test ${i + 1}: ${description}`));
        console.log(chalk.cyan("  Input:        "), input);
        console.log(chalk.cyan("  Expected Env: "), expectedEnv);
        console.log(chalk.cyan("  Actual Env:   "), env);
        console.log(chalk.cyan("  Expected Out: "), expectedOutput);
        console.log(chalk.cyan("  Actual Out:   "), capturedOutput);
      }
    } catch (error) {
      console.log(chalk.red(`❌ Test ${i + 1} threw an error: ${description}`));
      console.error(error);
    }
  }

  console.log(chalk.blueBright("\n✅ All evaluator tests completed.\n"));
}

// ✅ Start the test run
runEvaluatorTests();

// ♻️ Restore console.log
console.log = originalLog;
