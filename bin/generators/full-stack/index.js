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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var util_1 = __importDefault(require("util"));
var chalk_1 = __importDefault(require("chalk"));
var child_process_1 = __importDefault(require("child_process"));
var prettier_1 = __importDefault(require("prettier"));
var rimraf_1 = __importDefault(require("rimraf"));
var mkdir = util_1.default.promisify(fs_1.default.mkdir);
var stat = util_1.default.promisify(fs_1.default.stat);
var readdir = util_1.default.promisify(fs_1.default.readdir);
var readFile = util_1.default.promisify(fs_1.default.readFile);
var writeFile = util_1.default.promisify(fs_1.default.writeFile);
var unlink = util_1.default.promisify(fs_1.default.unlink);
var rmdir = util_1.default.promisify(rimraf_1.default);
var spawn = function (command, args, cwd) {
    return new Promise(function (resolve, reject) {
        command = /^win/.test(process.platform) ? command + ".cmd" : command;
        var cmd = child_process_1.default.spawn(command, args, { cwd: cwd, stdio: "inherit" });
        cmd.on("error", reject);
        cmd.on("close", resolve);
    });
};
var format = function (source) {
    return prettier_1.default.format(source, { parser: "typescript" });
};
exports.default = (function (dir) { return __awaiter(void 0, void 0, void 0, function () {
    var dirExists, files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(chalk_1.default.green("Generating full-stack scaffold..."));
                console.log(chalk_1.default.green("Checking if \"" + dir + "\" exists..."));
                return [4 /*yield*/, checkDirectoryExists(dir)];
            case 1:
                dirExists = _a.sent();
                if (!dirExists) return [3 /*break*/, 3];
                console.log(chalk_1.default.green("Directory exists. Checking for existing files..."));
                return [4 /*yield*/, readdir(dir)];
            case 2:
                files = _a.sent();
                if (files.length > 0) {
                    throw new Error("Please ensure the target directory is empty.");
                }
                return [3 /*break*/, 5];
            case 3:
                console.log(chalk_1.default.green("Creating directory..."));
                return [4 /*yield*/, mkdir(dir)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, Promise.all([
                    createPackageJson(dir),
                    createGitIgnore(dir),
                    generateServerScaffold(dir),
                    generateClientScaffold(dir)
                ])];
            case 6:
                _a.sent();
                console.log(chalk_1.default.green("Done!"));
                return [2 /*return*/];
        }
    });
}); });
function createPackageJson(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = {
                        "name": path_1.default.basename(dir),
                        "version": "1.0.0",
                        "scripts": {
                            "start": "cd build && node index.js",
                            "install": "run-p install:server install:client",
                            "install:server": "cd ./server && npm install",
                            "install:client": "cd ./client && npm install",
                            "dev": "run-p -r dev:server dev:client",
                            "dev:server": "cd ./server && npm start",
                            "dev:client": "wait-on tcp:3001 && cd ./client && npm start",
                            "build": "run-s build:clean build:server && run-p build:client build:dependencies",
                            "build:server": "cd ./server && npm run build && mv ./build ../build",
                            "build:client": "cd ./client && npm run build && mv ./build ../build/client",
                            "build:dependencies": "cd ./build && npm install",
                            "build:clean": "rimraf ./build"
                        }
                    };
                    return [4 /*yield*/, writeFile(path_1.default.join(dir, "package.json"), JSON.stringify(data, null, 2))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, spawn("npm", ["install", "-D", "npm-run-all", "wait-on", "rimraf"], dir)];
                case 2:
                    _a.sent();
                    console.log(chalk_1.default.green("Created root package.json file."));
                    return [2 /*return*/];
            }
        });
    });
}
function createGitIgnore(dir) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, writeFile(path_1.default.join(dir, ".gitignore"), "\n      node_modules\n      .vscode\n      build\n    "
                        .split("\n")
                        .map(function (line) { return line.trim(); })
                        .join("\n"))];
                case 1:
                    _a.sent();
                    console.log(chalk_1.default.green("Created .gitignore."));
                    return [2 /*return*/];
            }
        });
    });
}
function generateServerScaffold(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var serverDir, packageData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverDir = path_1.default.join(dir, "server");
                    return [4 /*yield*/, mkdir(serverDir)];
                case 1:
                    _a.sent();
                    packageData = {
                        "name": path_1.default.basename(dir) + "-server",
                        "scripts": {
                            "start": "ts-node-dev --respawn --transpileOnly index.ts",
                            "build": "tsc && npm run build:dependencies cd ./build && npm install",
                            "build:dependencies": "node build-dependencies.js"
                        }
                    };
                    return [4 /*yield*/, writeFile(path_1.default.join(serverDir, "package.json"), JSON.stringify(packageData, null, 2))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, spawn("npm", ["install", "dotenv", "koa", "mongoose", "koa-static"], serverDir)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, spawn("npm", [
                            "install",
                            "-D",
                            "typescript",
                            "ts-node-dev",
                            "@types/node",
                            "@types/koa",
                            "@types/koa-static",
                            "@types/mongoose"
                        ], serverDir)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            writeFile(path_1.default.join(serverDir, "tsconfig.json"), JSON.stringify({
                                "compilerOptions": {
                                    "strict": true,
                                    "esModuleInterop": true,
                                    "outDir": "./build"
                                },
                                "include": ["./**/*.ts"]
                            }, null, 2)),
                            writeFile(path_1.default.join(serverDir, "build-dependencies.js"), format("\n        const fs = require(\"fs\");\n        const { version, author, dependencies } = require(\"./package.json\");\n\n        fs.writeFileSync(\n          \"./build/package.json\",\n          JSON.stringify({\n            name: \"server-build\",\n            version,\n            author,\n            dependencies\n          }, null, 2)\n        );\n      ")),
                            writeFile(path_1.default.join(serverDir, "index.ts"), format("\n        import dotenv from \"dotenv\";\n        dotenv.config();\n\n        import fs from \"fs\";\n        import { promisify } from \"util\";\n        import Koa from \"koa\";\n        import serve from \"koa-static\";\n\n        const readFile = promisify(fs.readFile);\n\n        const port = process.env.PORT || 3001;\n        const app = new Koa();\n\n        app.use(serve(\"./client\"));\n\n        app.use(async (ctx) => {\n          ctx.set(\"Content-Type\", \"text/html\");\n          ctx.body = (await readFile(\"./client/index.html\")).toString();\n        });\n\n        app.listen(port, () => console.log(`Server running on port ${port}.`));\n      "))
                        ])];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function generateClientScaffold(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var clientDir, packageData, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    clientDir = path_1.default.join(dir, "client");
                    return [4 /*yield*/, mkdir(path_1.default.join(dir, "client"))];
                case 1:
                    _c.sent();
                    console.log(chalk_1.default.green("Created \"client\" directory."));
                    return [4 /*yield*/, spawn("npx", ["create-react-app", "--template", "typescript", "."], clientDir)];
                case 2:
                    _c.sent();
                    console.log(chalk_1.default.green("Created react app."));
                    return [4 /*yield*/, rmdir(path_1.default.join(clientDir, ".git"))];
                case 3:
                    _c.sent();
                    console.log(chalk_1.default.green("Removed .git folder from client."));
                    return [4 /*yield*/, unlink(path_1.default.join(clientDir, ".gitignore"))];
                case 4:
                    _c.sent();
                    console.log(chalk_1.default.green("Removed .gitignore file from client."));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readFile(path_1.default.join(clientDir, "package.json"))];
                case 5:
                    packageData = _b.apply(_a, [(_c.sent()).toString()]);
                    packageData.homepage = ".";
                    packageData.proxy = "http://localhost:3001";
                    return [4 /*yield*/, writeFile(path_1.default.join(clientDir, "package.json"), JSON.stringify(packageData, null, 2))];
                case 6:
                    _c.sent();
                    console.log(chalk_1.default.green("Wrote homepage and proxy to package.json."));
                    return [2 /*return*/];
            }
        });
    });
}
function checkDirectoryExists(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, stat(dir)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
