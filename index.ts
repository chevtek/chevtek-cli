#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import path from "path";
import generators from "./generators";

yargs
  .scriptName("chevtek")
  .usage(`${chalk.green("$0")} ${chalk.cyan("<cmd> [args]")}`)
  .command(
    "generate [--template] <path>",
    chalk.yellow("create new project scaffold from a given template"),
    (yargs) => {
      yargs.option("template", {
        type: "string",
        default: "full-stack",
        alias: "t",
        describe: chalk.yellow("The template to use.")
      });
      yargs.option("force", {
        type: "boolean",
        default: false,
        alias: "f",
        description: chalk.redBright("Force template generation even if directory is not empty.")
      });
      yargs.positional("path", {
        type: "string",
        describe: chalk.yellow("The path to generate scaffold at.")
      });
    },
    async ({ template, path: dir }: { template: string; path: string }) => {
      try {
        console.log(chalk.yellow(`generate --template="${template}" ${dir}`));
        if (generators.hasOwnProperty(template)) {
          await generators[template](path.resolve(dir));
        } else {
          throw new Error(`No template "${template}" found named.`);
        }
      } catch (err) {
        console.log(chalk.redBright(err.stack));
      }
    }
  )
  .help().argv;
