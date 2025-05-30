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
  }, // Test case for break statement (without semicolon)
  {
    input: "break",
    expected: [
      {
        type: "BreakStatement",
      },
    ],
  },
  // Test case for continue statement (without semicolon)
  {
    input: "continue",
    expected: [
      {
        type: "ContinueStatement",
      },
    ],
  },
  // Test case for break inside a while loop
  {
    input: "while x < 10 { break }",
    expected: [
      {
        type: "WhileStatement",
        condition: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumberLiteral",
            value: 10,
          },
        },
        body: {
          type: "BreakStatement",
        },
      },
    ],
  },
  // Test case for continue inside a while loop
  {
    input: "while x < 10 { continue }",
    expected: [
      {
        type: "WhileStatement",
        condition: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumberLiteral",
            value: 10,
          },
        },
        body: {
          type: "ContinueStatement",
        },
      },
    ],
  },
  // Test case: function with no parameters, returns nothing
  {
    input: 'function greet() { print "Hello World" }',
    expected: [
      {
        type: "FunctionDeclaration",
        name: "greet",
        params: [],
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "PrintStatement",
              value: {
                type: "StringLiteral",
                value: "Hello World",
              },
            },
          ],
        },
      },
    ],
  },

  // Test case: function with params and return using `dede`
  {
    input: "function sum(a,b) { dede a + b }",
    expected: [
      {
        type: "FunctionDeclaration",
        name: "sum",
        params: ["a", "b"],
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ReturnStatement",
              value: {
                type: "BinaryExpression",
                operator: "+",
                left: { type: "Identifier", name: "a" },
                right: { type: "Identifier", name: "b" },
              },
            },
          ],
        },
      },
    ],
  },

  // Test case: calling a function with variables
  {
    input: "let res = sum(x, y)",
    expected: [
      {
        type: "VariableDeclaration",
        name: "res",
        value: {
          type: "FunctionCall",
          name: "sum",
          args: [
            { type: "Identifier", name: "x" },
            { type: "Identifier", name: "y" },
          ],
        },
      },
    ],
  },

  // Test case: calling a function with literals
  {
    input: "print sum(5, 10)",
    expected: [
      {
        type: "PrintStatement",
        value: {
          type: "FunctionCall",
          name: "sum",
          args: [
            { type: "NumberLiteral", value: 5 },
            { type: "NumberLiteral", value: 10 },
          ],
        },
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
