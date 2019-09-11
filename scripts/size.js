const { resolve } = require("path");
const { writeFileSync, readFileSync, existsSync } = require("fs");
const pkg = require("../package");

const sizeSnapshotPath = resolve(".size-snapshot.json");
const units = ["B", "kB", "MB", "GB"];

function convertSize(size, unitIterator, lastUnitValue) {
  const unit = unitIterator.next();

  return size >= 1024 && !unit.done
    ? convertSize(Math.round((size / 1024) * 100) / 100, unitIterator, lastUnitValue)
    : `${size} ${unit.value || lastUnitValue}`;
}

(function main() {
  if (existsSync(sizeSnapshotPath)) {
    const sizeJson = JSON.parse(readFileSync(sizeSnapshotPath));

    sizeJson.module = convertSize(
      sizeJson[pkg.main].gzipped,
      units.values(),
      units[units.length - 1]
    );
    writeFileSync(sizeSnapshotPath, JSON.stringify(sizeJson, null, 2));
  }
})();
