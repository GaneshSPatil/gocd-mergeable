const path = require('path');
const GoCD = require(path.resolve('util/gocd'));
const glob = require("glob");

function findGoCDConfigFilesForPlugin(pluginId) {
  const matchingFiles = GoCD.getFilePatterns()[pluginId].map((p) => glob.sync(p));
  return [].concat.apply([], matchingFiles);
}

function representResult(result) {
  if (result.valid) {
    console.log("");
    console.log("\x1b[32m", "Configurations can be merged successfully with GoCD!");
    return;
  }

  const msg = [
    '', `Failed to merge configurations with GoCD. Errors:`,
    ...[].concat.apply([], result.errors.map((err, i) => `${i + 1}. ${err}`.replace('\n', '\n').split("\n"))), ''
  ];

  msg.forEach((line) => console.error("\x1b[31m", line));
  process.exitCode = 1;
}

module.exports = util = {
  findGoCDConfigFilesForPlugin,
  representResult
};
