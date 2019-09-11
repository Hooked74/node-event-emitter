const { resolve } = require("path");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const sizeSnapshotPath = resolve(".size-snapshot.json");
const pkg = require("../package");

(function main() {
  if (existsSync(sizeSnapshotPath)) {
    const sizeJson = JSON.parse(readFileSync(sizeSnapshotPath));

    sizeJson.module = sizeJson[pkg.module].gzipped;
    writeFileSync(sizeSnapshotPath, JSON.stringify(sizeJson, null, 2));
  }
})();
