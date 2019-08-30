const { success } = require("simple-output");
const chalk = require("chalk");
const { promisify } = require("util");
const { resolve } = require("path");
const { readFileSync, writeFile } = require("fs");
const execAsync = promisify(require("child_process").exec);
const execSync = require("child_process").execSync;
const writeFileAsync = promisify(writeFile);

const log = async (task, message) => {
  const start = Date.now();
  success(`${await task()} ${chalk.green(`in ${Date.now() - start}ms`)}`);
};

(async function main() {
  try {
    await Promise.all([
      log(() =>
        execAsync(
          `${resolve("node_modules/typescript/bin/tsc")} --project tsconfig.types.json`
        ).then(() => "Typescript definitions created")
      ),
      log(() =>
        writeFileAsync(
          resolve("dist/common.d.ts"),
          readFileSync(resolve("src/react-app-env.d.ts"))
            .toString()
            .split("\n")
            .filter(s => s && !s.includes('types="react-scripts"'))
            .join("\n")
        ).then(() => "Common definitions created")
      )
    ]);

    const indexdtsPath = resolve("dist/index.d.ts");
    log(() =>
      writeFileAsync(
        indexdtsPath,
        `/// <reference path="common.d.ts" />\n\n${readFileSync(indexdtsPath).toString()}`
      ).then(() => `Overwritten ${chalk.cyan(indexdtsPath)}`)
    );
  } catch (e) {
    console.log(e.stdout.toString());
  }
})();
