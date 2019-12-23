"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
exports.default = (function () {
    console.log("Generator running...");
    child_process_1.exec('echo "hi"', function (error, stdout, stderr) {
        stdout.pipe(process.stdout);
        stderr.pipe(process.stderr);
        if (error !== null) {
            console.log("exec error: " + error);
        }
    });
});
