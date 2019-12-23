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
      yargs.positional("path", {
        type: "string",
        describe: chalk.yellow("The path to generate scaffold at.")
      });
    },
    ({ template, path: dir }: { template: string; path: string }) => {
      generators[template](path.resolve(dir));
    }
  )
  .help().argv;
