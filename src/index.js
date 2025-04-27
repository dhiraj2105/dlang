#!/usr/bin/env node

// ============================
// index.js
// Entry point for Dlang interpreter
// connects everything - pipeline
// source code -> lexer -> parser -> evaluator

// reads input from .dlang file
// outputs results to terminal
// ============================

import fs from "fs";
import path from "path";
import { tokenize } from "./lexer.js";
import parse from "./parser.js";
import evaluate from "./evaluator.js";

// -----------------------
// 1. Read input code
// -----------------------
function readSource(filePath) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error("File not found :", fullPath);
    process.exit(1);
  }
  return fs.readFileSync(fullPath, "utf-8");
}

// -----------------------
// 2. Run full pipeline
// -----------------------
function runDlangCode(code) {
  try {
    // Step 1: Lexing – Convert code to tokens
    const tokens = tokenize(code);
    // console.log("\n📦 Tokens:", tokens);

    // Step 2: Parsing – Convert tokens to AST
    const ast = parse(tokens);
    // console.log("\n🌲 AST:", JSON.stringify(ast, null, 2));

    // Step 3: Evaluation – Run the AST
    // console.log("\n⚙️ Output:");
    evaluate(ast);
  } catch (error) {
    console.error("💥 Runtime Error:", error.message);
  }
}

// ------------------------
// 3. Entry point
// accepts a filename from cli args
// example : node src/index.js file.dlang
// -----------------------

function main() {
  const fileArg = process.argv[2];
  if (!fileArg) {
    console.error("📂 Usage: node src/index.js <filename.dlang>");
    process.exit(1);
  }

  const code = readSource(fileArg);

  runDlangCode(code);
}

main();
