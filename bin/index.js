#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
var generators_1 = __importDefault(require("./generators"));
yargs_1.default
    .scriptName("chevtek")
    .usage("$0 <cmd> [args]")
    .command("generate [template]", "create new project scaffold from a given template", function (yargs) {
    return yargs.positional("template", {
        type: "string",
        default: "full-stack",
        describe: "The template to use."
    });
}, function (_a) {
    var template = _a.template;
    generators_1.default[template]();
})
    .help().argv;
