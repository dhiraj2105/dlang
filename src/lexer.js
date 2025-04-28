// ==========================
// lexer.js
// This file converts source code into a list of tokens
// Each token is a meaningful unit: keywords, variables, numbers, operators, etc.
//
// Example:
// Input : let x = 5 + 10
// Output: [ { type: 'KEYWORD', value: 'let' }, { type: 'IDENTIFIER', value: 'x' }, ... ]
//
// Each part of the code is matched using regex
// ==========================

// List of reserved keywords in dlang
const KEYWORDS = [
  "let",
  "print",
  "if",
  "else",
  "while",
  "break",
  "continue",
  "function",
  "dede",
];

// Define token types using regular expressions
const TOKEN_TYPES = [
  { type: "WHITESPACE", regex: /^\s+/ }, // Matches spaces and tabs
  { type: "NUMBER", regex: /^\d+/ }, // Matches integers
  { type: "STRING", regex: /^"([^"]*)"/ }, // Matches string literals
  { type: "OPERATOR", regex: /^[+\-*/=<>!]+/ }, // Matches operators like +, -, *, =, etc.
  { type: "PUNCTUATION", regex: /^[\(\)\{\};,]/ }, // Matches punctuation marks
  { type: "IDENTIFIER", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ }, // Matches variable names and keywords
];

/**
 * Tokenizes the source code into an array of token objects
 * Each token has a type and a value
 *
 * @param {string} input - The source code to tokenize
 * @returns {Array} - An array of tokens
 */
export const tokenize = (input) => {
  const tokens = []; // Array to store extracted tokens
  const lines = input.split("\n"); // Split the entire code into lines

  // Process each line individually
  for (let line of lines) {
    // Remove inline comments (everything after #)
    if (line.includes("#")) {
      line = line.split("#")[0];
    }

    // Trim whitespace and skip if line is empty after removing comment
    line = line.trim();
    if (line === "") continue;

    let code = line; // Copy line into mutable variable

    // Loop through characters in the line until fully processed
    while (code.length > 0) {
      let matched = false; // Flag to track if any token matched

      // Try matching each token type in order
      for (const { type, regex } of TOKEN_TYPES) {
        const match = regex.exec(code); // Try to match the regex

        if (match) {
          matched = true; // Set matched flag to true
          const value = match[0]; // Get matched string

          // Skip whitespace
          if (type !== "WHITESPACE") {
            let tokenType = type;

            // Change type to KEYWORD if the identifier matches a reserved word
            if (type === "IDENTIFIER" && KEYWORDS.includes(value)) {
              tokenType = "KEYWORD";
            }

            // Push the valid token into the token array
            tokens.push({ type: tokenType, value });
          }

          // Remove the matched part from the code string
          code = code.slice(value.length);
          break; // Break inner loop and try next part
        }
      }

      // If no token matched, throw an error
      if (!matched) {
        console.error(`Failed to tokenize: ${code}`);
        throw new Error(`Unexpected token near: ${code.slice(0, 10)}`);
      }
    }
  }

  return tokens; // Return the array of tokens
};
