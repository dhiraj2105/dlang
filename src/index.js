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
import chalk from "chalk";

// Version
const VERSION = "1.2.2";
// Help content | about
const HELP_TEXT = `
Dlang is an interpreted toy language by Dhiraj.

Usage:
  dlang <file.dlang>          Run a Dlang program from specified file
  dlang --help                Display the help section
  dlang --version             Display the version of dlang interpreter
  dlang --keywords            Display all keywords in dlang
`;

const SHOW_KEYWORDS = `
  Keywords in dlang...

  let
  print
  if
  else
  while
  break
  continue
  function
  dede      ( instead of return )
`;

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
// -----------------------

function main() {
  const fileArg = process.argv[2];

  // if no argument passed
  if (!fileArg) {
    console.error("📂 Usage: dlang <filename.dlang> or dlang --help");
    process.exit(1);
  }

  // version, help, keywords
  if (fileArg.includes("--version")) {
    console.log(chalk.green(`Dlang ${VERSION}`));
    process.exit(0);
  }
  if (fileArg.includes("--help")) {
    console.log(HELP_TEXT);
    process.exit(0);
  }
  if (fileArg.includes("--keywords")) {
    console.log(SHOW_KEYWORDS);
    process.exit(0);
  }

  //
  // Driver

  const code = readSource(fileArg);

  runDlangCode(code);
}

main();
