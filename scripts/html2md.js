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
exports.__esModule = true;
var child_process_1 = require("child_process");
var fs = require("fs");
var readline = require("readline");
function convertHTML(file) {
    return __awaiter(this, void 0, void 0, function () {
        var mdFile;
        return __generator(this, function (_a) {
            mdFile = file.replace(/html$/, 'md');
            child_process_1.exec("pandoc  -t markdown --wrap=none -o \"" + mdFile + ".tmp\" \"" + file + "\"", function (error, stdout, stderr) {
                if (error) {
                    console.log("Conversion of " + file + " with error: " + error.message);
                    return;
                }
                if (stderr) {
                    console.log("Conversion of " + file + " with stderr: " + stderr);
                    return;
                }
                console.log("Conversion of " + file + " into " + mdFile + ".tmp successful");
                var def = {
                    input: fs.createReadStream(mdFile + ".tmp"),
                    output: fs.createWriteStream(mdFile),
                    terminal: false
                };
                var readFile = readline.createInterface(def);
                var intable = false;
                var tablestart = false;
                var blankline = false;
                var transform = function (line) {
                    line = line.replace(/{style=".*?"}/g, '');
                    line = line.replace(/\\/g, ' ');
                    if (line.startsWith(":::"))
                        return;
                    if (line.trim() === "") {
                        if (blankline)
                            return;
                        blankline = true;
                    }
                    else {
                        blankline = false;
                    }
                    if (!intable) {
                        if (line.trim().startsWith("+-")) {
                            intable = true;
                            tablestart = true;
                        }
                        else {
                            def.output.write(line + "\n");
                        }
                    }
                    else {
                        if (tablestart) {
                            if (line.trim().startsWith("+-")) {
                                def.output.write(line.replace(/\+/g, '|') + "\n");
                                tablestart = false;
                            }
                            else {
                                if (!line.startsWith("|")) {
                                    tablestart = false;
                                    intable = false;
                                }
                                def.output.write(line + "\n");
                            }
                        }
                        else {
                            if (line.trim().startsWith("+-")) {
                            }
                            else {
                                if (!line.startsWith("|")) {
                                    tablestart = false;
                                    intable = false;
                                }
                                def.output.write(line + "\n");
                            }
                        }
                    }
                };
                readFile
                    .on('line', transform.bind(def))
                    .on('close', function () {
                    console.log("Created \"" + def.output.path + "\"");
                });
            });
            return [2 /*return*/];
        });
    });
}
var path = process.argv.pop();
var promises = [];
var files = fs.readdirSync(path).map(function (file) { return path + '/' + file; });
var _loop_1 = function () {
    var file = files.pop();
    if (!file)
        return "continue";
    if (fs.lstatSync(file).isDirectory()) {
        Array.prototype.push.apply(files, fs.readdirSync(file).map(function (newfile) { return file + '/' + newfile; }));
    }
    else {
        if (file.toLowerCase().endsWith('html')) {
            promises.push(convertHTML(file));
        }
    }
};
while (files.length > 0) {
    _loop_1();
}
process.on('beforeExit', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(promises)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
