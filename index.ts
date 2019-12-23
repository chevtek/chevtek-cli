#!/usr/bin/env node
import chalk from "chalk";
import yargs from "yargs";
import generators from "./generators";

yargs
  .scriptName(chalk.green("chevtek"))
  .usage("$0 <cmd> [args]")
  .command(
    chalk.cyan("generate [template]"),
    "create new project scaffold from a given template",
    (yargs) =>
      yargs.positional("template", {
        type: "string",
        default: "full-stack",
        describe: "The template to use."
      }),
    ({ template }) => {
      generators[template]();
    }
  )
  .help().argv;
