#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var yargs_1 = __importDefault(require("yargs"));
var path_1 = __importDefault(require("path"));
var generators_1 = __importDefault(require("./generators"));
yargs_1.default
    .scriptName("chevtek")
    .usage(chalk_1.default.green("$0") + " " + chalk_1.default.cyan("<cmd> [args]"))
    .command("generate [--template] <path>", chalk_1.default.yellow("create new project scaffold from a given template"), function (yargs) {
    yargs.option("template", {
        type: "string",
        default: "full-stack",
        alias: "t",
        describe: chalk_1.default.yellow("The template to use.")
    });
    yargs.positional("path", {
        type: "string",
        describe: chalk_1.default.yellow("The path to generate scaffold at.")
    });
}, function (_a) {
    var template = _a.template, dir = _a.path;
    return __awaiter(void 0, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    console.log(chalk_1.default.yellow("generate --template=\"" + template + "\" " + dir));
                    if (!generators_1.default.hasOwnProperty(template)) return [3 /*break*/, 2];
                    return [4 /*yield*/, generators_1.default[template](path_1.default.resolve(dir))];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2: throw new Error("No template \"" + template + "\" found named.");
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    console.log(chalk_1.default.redBright(err_1.stack));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
})
    .help().argv;
