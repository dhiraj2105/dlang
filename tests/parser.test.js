import chalk from "chalk";
import parse from "../src/parser.js";
import { tokenize } from "../src/lexer.js";

const testCases = [
  {
    input: "let x = 42",
    expected: [
      {
        type: "VariableDeclaration",
        name: "x",
        value: {
          type: "NumberLiteral",
          value: 42,
        },
      },
    ],
  },
  {
    input: 'print "Hello, world!"',
    expected: [
      {
        type: "PrintStatement",
        value: {
          type: "StringLiteral",
          value: "Hello, world!",
        },
      },
    ],
  },
  {
    input: "x = x + 1",
    expected: [
      {
        type: "VariableDeclaration",
        name: "x",
        value: {
          type: "BinaryExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumberLiteral",
              value: 1,
            },
          },
        },
      },
    ],
  },
  {
    input: 'if x < 5 { print "small"} else { print "big" }',
    expected: [
      {
        type: "IfStatement",
        condition: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumberLiteral",
            value: 5,
          },
        },
        consequence: [
          {
            type: "PrintStatement",
            value: {
              type: "StringLiteral",
              value: "small",
            },
          },
        ],
        alternative: [
          {
            type: "PrintStatement",
            value: {
              type: "StringLiteral",
              value: "big",
            },
          },
        ],
      },
    ],
  },
];

function runParserTests() {
  for (let index = 0; index < testCases.length; index++) {
    const { input, expected } = testCases[index];
    let result;

    try {
      // Tokenize input
      const tokens = tokenize(input);
      console.log(chalk.blueBright(`Tokens for Test ${index + 1}:`), tokens);

      // Parse tokens
      result = parse(tokens);
      console.log(
        chalk.blueBright(`Parsed AST for Test ${index + 1}:`),
        result
      );

      // Compare result with expected output
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

  console.log(chalk.blueBright("Parser tests completed."));
}

runParserTests();
