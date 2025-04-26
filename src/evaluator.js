// =====================================
// evaluator.js
// This file executes the AST
// from the parser and runs the actual logic of the program

// ✅ Input: AST from parser
// ✅ Output: Console output, variable storage, etc.
//
// 🧠 Example:
// AST: [{ type: 'VariableDeclaration', name: 'x', value: { type: 'NumberLiteral', value: 5 } }]
// Result: Stores variable 'x' with value 5
// ==========================================

// ------------------------------
// 📦 Environment Object
// This acts like memory to store variables
// ------------------------------
const env = {};

// Control flow signals for break and continue
class BreakSignal {}
class ContinueSignal {}

// ------------------------------
// Main Evaluate function
// Accepts the full AST and runs each node
// ------------------------------
function evaluate(ast) {
  for (const node of ast) {
    evaluateNode(node); // evaluate each top- level AST node in sequence
  }
}

// ------------------------------
// Dispatcher: Handle different node types
// Delegates to the correct handler based on node.type
// ------------------------------
function evaluateNode(node) {
  switch (node.type) {
    case "VariableDeclaration":
      return handleVariableDeclaration(node);
    case "PrintStatement":
      return handlePrintStatement(node);
    case "IfStatement":
      return handleIfStatement(node);
    case "WhileStatement":
      return handleWhileStatement(node);
    case "BlockStatement":
      return handleBlockStatement(node);
    case "BinaryExpression":
      return evaluateBinaryExpression(node);
    case "AssignmentExpression":
      return handleAssignment(node);
    case "ContinueStatement": // Handling ContinueStatement
      return handleContinueStatement(); // Trigger continue logic
    case "BreakStatement": // Handling BreakStatement
      return handleBreakStatement(); // Trigger break logic
    case "NumberLiteral":
    case "StringLiteral":
    case "Identifier":
      return evaluateExpression(node);
    default:
      throw new Error("Unknown AST Node Type: " + node.type);
  }
}

// ------------------------------
// Handle Variable Declaration
// stores variable values in the environment
// ------------------------------
function handleVariableDeclaration(node) {
  const { name, value } = node; // destructure variable name and assigned value
  const evaluatedValue = evaluateExpression(value); // evaluate expression on right hand side
  env[name] = evaluatedValue; // store in env
  return evaluatedValue;
}

// ------------------------------
// 🖨️ Handle Print Statement
// Example: print x or print 5 + 2
// ------------------------------
function handlePrintStatement(node) {
  const value = evaluateExpression(node.value);
  console.log(value); // print to output
  return value;
}

// ------------------------------
// If Statement
// ------------------------------
function handleIfStatement(node) {
  const testResult = evaluateExpression(node.condition);
  if (testResult) {
    return evaluateNode(node.thenBranch);
  } else if (node.elseBranch) {
    return evaluateNode(node.elseBranch);
  }
}

// ------------------------------
// 🔁 While Statement
// ------------------------------
function handleWhileStatement(node) {
  let result;
  while (evaluateExpression(node.condition)) {
    try {
      result = evaluateNode(node.body);
    } catch (e) {
      if (e instanceof BreakSignal) break;
      if (e instanceof ContinueSignal) continue;
      throw e; // rethrow other unexpected errors
    }
  }
  return result;
}

// ------------------------------
// Handle Continue Signal
// This will signal the loop to continue to the next iteration
// ------------------------------
function handleContinueStatement() {
  throw new ContinueSignal(); // Trigger a ContinueSignal to skip the current loop iteration
}

// ------------------------------
// Handle Break Signal
// This will signal the loop to break and exit
// ------------------------------
function handleBreakStatement() {
  throw new BreakSignal(); // Trigger a BreakSignal to exit the loop
}

function handleAssignment(node) {
  if (!(node.name in env)) {
    throw new Error(`Cannot assign to undeclared variable: ${node.name}`);
  }

  const newValue = evaluateExpression(node.value);
  env[node.name] = newValue;
  return newValue;
}

// ------------------------------
// Block Statement
// Executes multiple statements inside a block
// ------------------------------
function handleBlockStatement(node) {
  let result;
  for (const stmt of node.body) {
    result = evaluateNode(stmt);
  }
  return result;
}

// ------------------------------
// 🧮 Handle Arithmetic and Binary Expressions
// Example: 5 + 3, 10 - x
// ------------------------------
function evaluateBinaryExpression(node) {
  const left = evaluateExpression(node.left); // recursively evaluate left side
  const right = evaluateExpression(node.right); // recusively evaluate right side

  switch (node.operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "*":
      return left * right;
    case "/":
      return left / right;
    case "=":
      return left === right;
    case "<":
      return left < right;
    case ">":
      return left > right;
    case "==": // ✅ ADDED
      return left === right;
    case "!=": // ✅ ADDED
      return left !== right;
    default:
      throw new Error("Unsupported operator: " + node.operator);
  }
}

// ------------------------------
// 🧠 Evaluate Expressions
// Handles literals, variables, binary expressions
// ------------------------------
function evaluateExpression(expr) {
  switch (expr.type) {
    case "NumberLiteral":
      return expr.value; // return numeric value directly
    case "StringLiteral":
      return expr.value; // return string value directly
    case "Identifier":
      // lookup variable name in environment
      if (expr.name in env) {
        return env[expr.name]; // return stored value
      } else {
        throw new Error(`Undefined variable: ${expr.name}`);
      }
    case "BinaryExpression":
      return evaluateBinaryExpression(expr); // recurse for nested expression
    default:
      throw new Error("Unknown expression type: " + expr.type);
  }
}

export default evaluate;
