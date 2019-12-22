#!/usr/bin/env node
import yargs from "yargs";
import generators from "./generators";

yargs
  .scriptName("chevtek")
  .usage("$0 <cmd> [args]")
  .command(
    "generate [template]",
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
