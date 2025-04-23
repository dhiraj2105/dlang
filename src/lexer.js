// ==========================
// lexer.js
// This file convert source code into a list of tokens
// Each token is a meaningful unit: keywords, variables, number, operators, etc

// Example:
// Input : let x = 5 + 10
// Output: [ { type: 'KEYWORD', value: 'let' }, { type: 'IDENTIFIER', value: 'x' }, ... ]

// Each part of code is matched using regex
// ==========================

// List of reserved keywords in dlang
const KEYWORDS = ["let", "print", "if", "else", "while"];

// Definie token types using regex
const TOKEN_TYPES = [
  { type: "WHITESPACE", regex: /^\s+/ }, // spaces and tabs
  { type: "COMMENT", regex: /^#.*$/ }, // comments
  { type: "NUMBER", regex: /^\d+/ }, // integers
  { type: "STRING", regex: /^"([^"]*)"/ }, // string literals
  { type: "OPERATOR", regex: /^[+\-*/=<>!]+/ }, // operators like +, -, *, =, etc.
  { type: "PUNCTUATION", regex: /^[\(\)\{\};,]/ }, // punctuation
  { type: "IDENTIFIER", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ }, // variables & keywords
];

// -----------------------
// Main Tokenizer function
// -----------------------

/**
 * Tokenizes a single line or block of code
 * @param {string} input - The source code to tokenize
 * * @returns {Array} - An array of tokens extracted from the input source code
 */

export const tokenize = (input) => {
  const tokens = []; // Initialie an array to store tokens
  let code = input; // Copy input code to a mutuable variable

  // loop through code untial all characters are processed
  while (code.length > 0) {
    let matched = false; // falg to check if any token matched

    // try matching each token type in order
    for (const { type, regex } of TOKEN_TYPES) {
      const match = regex.exec(code); // attempt to match the regex

      if (match) {
        matched = true; // set matched flag to true
        const value = match[0]; // get the matched value

        // skip whitespaces and comments from final output
        if (type !== "WHITESPACE" && type !== "COMMENT") {
          let tokenType = type; // default token type

          // if identifier is a keyword, change type to KEYWORD
          // if  any token is a predefined keyword then change the type of token to KEYWORD so that user can not set variable as keyword
          if (type === "IDENTIFIER" && KEYWORDS.includes(value)) {
            tokenType = "KEYWORD";
          }

          // push the token to tokens array
          tokens.push({ type: tokenType, value });
        }

        // remove mtached part from code
        code = code.slice(value.length);
        break;
      }
    }

    // if no matched found , throw error
    if (!matched) {
      console.error(`Failed to tokenize: ${code}`);
      throw new Error(`Unexpected token near : ` + code.slice(0, 10));
    }
  }

  // return array of tokens
  return tokens;
};

// Uncomment to Test
const code = " let x = 5 + 10 #comment after code";
console.log(tokenize(code));
