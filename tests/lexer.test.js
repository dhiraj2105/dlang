import chalk from "chalk";
import { tokenize } from "../src/lexer.js";

const testCases = [
  {
    input: "let x = 42",
    expected: [
      { type: "KEYWORD", value: "let" },
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "=" },
      { type: "NUMBER", value: "42" },
    ],
  },
  {
    input: "#commented line",
    expected: [],
  },
  {
    input: 'print "Hello, world!"',
    expected: [
      { type: "KEYWORD", value: "print" },
      { type: "STRING", value: '"Hello, world!"' },
    ],
  },
  {
    input: "x = x + 1",
    expected: [
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "=" },
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "+" },
      { type: "NUMBER", value: "1" },
    ],
  },
  {
    input: 'if (x < 5) { print "small"; } else { print "big"; }',
    expected: [
      { type: "KEYWORD", value: "if" },
      { type: "PUNCTUATION", value: "(" },
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "<" },
      { type: "NUMBER", value: "5" },
      { type: "PUNCTUATION", value: ")" },
      { type: "PUNCTUATION", value: "{" },
      { type: "KEYWORD", value: "print" },
      { type: "STRING", value: '"small"' },
      { type: "PUNCTUATION", value: ";" },
      { type: "PUNCTUATION", value: "}" },
      { type: "KEYWORD", value: "else" },
      { type: "PUNCTUATION", value: "{" },
      { type: "KEYWORD", value: "print" },
      { type: "STRING", value: '"big"' },
      { type: "PUNCTUATION", value: ";" },
      { type: "PUNCTUATION", value: "}" },
    ],
  },
  // Test case for `break` keyword (no semicolon after break)
  {
    input: "break",
    expected: [{ type: "KEYWORD", value: "break" }],
  },
  // Test case for `continue` keyword (no semicolon after continue)
  {
    input: "continue",
    expected: [{ type: "KEYWORD", value: "continue" }],
  },
  // Test case for `break` in a loop (no semicolon after break)
  {
    input: "while (x < 10) { break }",
    expected: [
      { type: "KEYWORD", value: "while" },
      { type: "PUNCTUATION", value: "(" },
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "<" },
      { type: "NUMBER", value: "10" },
      { type: "PUNCTUATION", value: ")" },
      { type: "PUNCTUATION", value: "{" },
      { type: "KEYWORD", value: "break" },
      { type: "PUNCTUATION", value: "}" },
    ],
  },
  // Test case for `continue` in a loop (no semicolon after continue)
  {
    input: "while (x < 10) { continue }",
    expected: [
      { type: "KEYWORD", value: "while" },
      { type: "PUNCTUATION", value: "(" },
      { type: "IDENTIFIER", value: "x" },
      { type: "OPERATOR", value: "<" },
      { type: "NUMBER", value: "10" },
      { type: "PUNCTUATION", value: ")" },
      { type: "PUNCTUATION", value: "{" },
      { type: "KEYWORD", value: "continue" },
      { type: "PUNCTUATION", value: "}" },
    ],
  },
];

function runLexerTests() {
  for (let index = 0; index < testCases.length; index++) {
    const { input, expected } = testCases[index];
    let result;

    try {
      result = tokenize(input);
      const pass = JSON.stringify(result) === JSON.stringify(expected);

      if (pass) {
        console.log(chalk.green(`✔ Test ${index + 1} passed.`));
      } else {
        console.log(chalk.red(`✖ Test ${index + 1} failed.`));
        console.log(chalk.yellow("Input:"), input);
        console.log(chalk.cyan("Expected:"), JSON.stringify(expected, null, 2));
        console.log(chalk.magenta("Got:"), JSON.stringify(result, null, 2));
      }
    } catch (err) {
      console.log(chalk.red(`❌ Test ${index + 1} threw an error.`));
      console.log(chalk.yellow("Input:"), input);
      console.error(chalk.red(err));
    }
  }

  console.log(chalk.blueBright("Lexer tests completed."));
}

runLexerTests();
