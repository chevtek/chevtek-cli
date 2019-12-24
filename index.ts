#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import path from "path";
import generators from "./generators";
import Logger from "./logger";

const { log } = new Logger("cli");

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
      yargs.positional("path", {
        type: "string",
        describe: chalk.yellow("The path to generate scaffold at.")
      });
    },
    async ({ template, path: dir }: { template: string; path: string }) => {
      try {
        log(`generate --template="${template}" ${dir}`);
        if (generators.hasOwnProperty(template)) {
          await generators[template](path.resolve(dir));
        } else {
          throw new Error(`No template "${template}" found named.`);
        }
      } catch (err) {
        console.log(chalk.red(err.message));
      }
    }
  )
  .help().argv;
