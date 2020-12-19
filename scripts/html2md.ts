#!/usr/bin/env node
import { exec } from "child_process";
import fs = require('fs');
import readline = require('readline');

async function convertHTML(file: string) {
    const mdFile = file.replace(/html$/, 'md');
    exec("pandoc  -t markdown --wrap=none -o \"" + mdFile + ".tmp\" \"" + file + "\"", (error, stdout, stderr) => {
        if (error) {
            console.log(`Conversion of ${file} with error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`Conversion of ${file} with stderr: ${stderr}`);
            return;
        }
        console.log(`Conversion of ${file} into ${mdFile}.tmp successful`);

        const def = {
            input: fs.createReadStream(mdFile + ".tmp"),
            output: fs.createWriteStream(mdFile),
            terminal: false
        }
        const readFile = readline.createInterface(def);

        let intable: boolean = false;
        let tablestart: boolean = false;
        let blankline: boolean = false;
        const transform = (line: string) => {
            line = line.replace(/{style=".*?"}/g, '');
            line = line.replace(/\\/g, ' ');
            if(line.startsWith(":::")) return;
            if(line.trim() === "") {
                if(blankline)
                    return;
                blankline = true;
            } else {
                blankline = false;
            }
            if (!intable) {
                if (line.trim().startsWith("+-")) {
                    intable = true;
                    tablestart = true;
                } else {
                    def.output.write(`${line}\n`);
                }
            } else {
                if (tablestart) {
                    if (line.trim().startsWith("+-")) {
                        def.output.write(`${line.replace(/\+/g, '|')}\n`);
                        tablestart = false;
                    } else {
                        if(!line.startsWith("|")) {
                            tablestart = false;
                            intable = false;
                        }
                        def.output.write(`${line}\n`);
                    }
                } else {
                    if(line.trim().startsWith("+-")) {

                    } else {
                        if(!line.startsWith("|")) {
                            tablestart = false;
                            intable = false;
                        }
                        def.output.write(`${line}\n`);
                    }
                }
            }
        }

        readFile
            .on('line', transform.bind(def))
            .on('close', function () {
                console.log(`Created "${def.output.path}"`);
            });

    });
}



const path = process.argv.pop();
const promises = [];

const files = fs.readdirSync(path).map((file) => path + '/' + file);
while (files.length > 0) {
    const file = files.pop();
    if (!file) continue;
    if (fs.lstatSync(file).isDirectory()) {
        Array.prototype.push.apply(files, fs.readdirSync(file).map((newfile) => file + '/' + newfile));
    } else {
        if (file.toLowerCase().endsWith('html')) {
            promises.push(convertHTML(file));
        }
    }

}



process.on('beforeExit', async () => {
    await Promise.all(promises);
});