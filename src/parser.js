// =======================================
// 📄 parser.js
// This file parses tokens into an AST (Abstract Syntax Tree)
// The AST is a structured, nested representation of what the program means.
//
// ✅ Input: Tokens from lexer
// ✅ Output: AST (Array of Node objects)
//
// 🧠 Example:
// Input Tokens: [ {type: 'KEYWORD', value: 'let'}, {type: 'IDENTIFIER', value: 'x'}, ... ]
// Output AST:
// [
//   { type: 'VariableDeclaration', name: 'x', value: { type: 'NumberLiteral', value: 5 } }
// ]
// =======================================

let tokens = []; // This array will hold the tokens provided by the lexer.
let current = 0; // The current token index, used to track the current position while parsing.

// ------------------------------
// 🧠 Helper: Get current token
// ------------------------------
function peek() {
  // Returns the current token without advancing the token index
  return tokens[current];
}

// ------------------------------
// 🧠 Helper: Move to next token
// ------------------------------
function next() {
  // Advances the token index and returns the next token
  current++;
  return peek();
}

// ------------------------------
// 🧠 Helper: Match token type
// ------------------------------
function match(type, value = null) {
  const token = peek(); // Retrieves the current token
  // Checks if the current token matches the specified type (and optionally value)
  return (
    token && token.type === type && (value === null || token.value === value)
  );
}

// ------------------------------
// 🧠 Main Parser Function
// ------------------------------
function parse(inputTokens) {
  // Sets the tokens array to the input tokens and resets the current index to 0
  tokens = inputTokens;
  current = 0;
  const ast = []; // This will hold the Abstract Syntax Tree (AST) we build during parsing.

  // Loop through all the tokens, parsing each statement
  while (current < tokens.length) {
    const node = parseStatement(); // Parse a single statement
    if (node) ast.push(node); // If a valid node was returned, add it to the AST
  }

  return ast; // Return the complete AST after all statements are parsed
}

// ------------------------------
// 🧩 Parse a statement
// Supports: let, print, expressions
// ------------------------------
function parseStatement() {
  const token = peek(); // Retrieve the current token to determine the type of statement

  // Check if the token is a "let" keyword for variable declaration
  if (match("KEYWORD", "let")) {
    return parseVariableDeclaration(); // Parse a variable declaration (e.g., let x = 5)
  }

  // Check if the token is a "print" keyword for a print statement
  if (match("KEYWORD", "print")) {
    return parsePrintStatement(); // Parse a print statement (e.g., print "Hello")
  }

  // If the token doesn't match "let" or "print", throw an error
  throw new Error("Unknown statement: " + token.value);
}

// ------------------------------
// 🧩 let x = 5 + 10
// Parses variable declaration
// ------------------------------
function parseVariableDeclaration() {
  next(); // Skip the 'let' keyword

  const nameToken = peek(); // Retrieve the next token (which should be the variable name)
  if (nameToken.type !== "IDENTIFIER") {
    throw new Error("Expected variable name after 'let'"); // If the next token isn't an identifier, throw an error
  }

  const name = nameToken.value; // Extract the variable name (e.g., 'x')
  next(); // Skip past the variable name

  // Check if the next token is the "=" operator (for assignment)
  if (!match("OPERATOR", "=")) {
    throw new Error("Expected '=' after variable name"); // If '=' is missing, throw an error
  }
  next(); // Skip past the '=' token

  const value = parseExpression(); // Parse the expression assigned to the variable

  return {
    type: "VariableDeclaration", // The type of AST node for this declaration
    name, // The variable's name
    value, // The expression or value assigned to the variable
  };
}

// ------------------------------
// 🧩 print x or print 5 + 2
// Parses print statement
// ------------------------------
function parsePrintStatement() {
  next(); // Skip the 'print' keyword
  const value = parseExpression(); // Parse the expression to be printed

  return {
    type: "PrintStatement", // The type of AST node for this print statement
    value, // The expression to be printed
  };
}

// ------------------------------
// 🧮 Parses basic expressions: numbers, variables, arithmetic
// ------------------------------
function parseExpression() {
  let left = parsePrimary(); // Parse the first part of the expression (e.g., number, variable, or parenthesized expression)

  // Keep parsing if there are more operators like `+`, `-`, `*`, `/`
  while (match("OPERATOR")) {
    const operator = peek().value; // Retrieve the operator (e.g., '+')
    next(); // Skip past the operator

    const right = parsePrimary(); // Parse the right-hand side of the expression (e.g., the second operand)

    // Create a BinaryExpression node that represents the left and right operands and the operator
    left = {
      type: "BinaryExpression", // The type of AST node for binary operations
      operator, // The operator (e.g., '+')
      left, // The left operand (previous part of the expression)
      right, // The right operand (the new part of the expression)
    };
  }

  return left; // Return the complete binary expression or a simple expression (if no operators were found)
}

// ------------------------------
// 🧮 Parses numbers, identifiers, and strings
// ------------------------------
function parsePrimary() {
  const token = peek(); // Get the current token

  // If the token is a number, return a NumberLiteral node with the value
  if (token.type === "NUMBER") {
    next(); // Skip the number token
    return { type: "NumberLiteral", value: Number(token.value) }; // Return a node with the parsed number
  }

  // If the token is a string, return a StringLiteral node with the value (remove the surrounding quotes)
  if (token.type === "STRING") {
    next(); // Skip the string token
    return { type: "StringLiteral", value: token.value.slice(1, -1) }; // Remove the quotes and return the string literal
  }

  // If the token is an identifier, return an Identifier node with the identifier name
  if (token.type === "IDENTIFIER") {
    next(); // Skip the identifier token
    return { type: "Identifier", name: token.value }; // Return the identifier node
  }

  // If the token doesn't match any of the expected types (number, string, identifier), throw an error
  throw new Error("Unexpected token in expression: " + token.value);
}

// ------------------------------
// Export the parse function
// ------------------------------
export default parse; // Export the parse function so it can be used in other files (e.g., in a test file)
