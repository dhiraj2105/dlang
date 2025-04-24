import { argv } from "node:process";
import chalk from "chalk";

async function runTests() {
  const testType = argv[2];

  try {
    switch (testType) {
      case "lexer":
        console.log(chalk.blueBright("Running lexer tests..."));
        await import("./lexer.test.js");
        break;
      case "parser":
        console.log(chalk.blueBright("Running parser tests..."));
        await import("./parser.test.js");
        break;
      case "evaluator":
        console.log(chalk.blueBright("Running parser tests..."));
        await import("./evaluator.test.js");
        break;
      default:
        console.log(
          chalk.yellow("Usage: node cli.js <lexer|parser|evaluator>")
        );
        process.exit(1);
    }

    console.log(chalk.greenBright(`✅ ${testType} tests passed successfully!`));
  } catch (err) {
    console.error(chalk.red(`❌ Error running ${testType} tests:\n`), err);
    process.exit(1);
  }
}

runTests();
