const core = require('@actions/core');
const util = require('./util');
const GoCD = require('./util/gocd');

const GoCDServerUrl            = core.getInput('GOCD_SERVER_URL');
const GoCDAdminUserAccessToken = core.getInput('GOCD_ADMIN_ACCESS_TOKEN');
const GoCDConfigRepositoryId   = core.getInput('GOCD_CONFIG_REPOSITORY_ID');

try {
  (async function () {
    console.log(`Fetching '${GoCDConfigRepositoryId}' config repository...`);
    const repo = await GoCD.fetchConfigRepository(GoCDServerUrl, GoCDAdminUserAccessToken, GoCDConfigRepositoryId);

    const matchingFilePaths = util.findGoCDConfigFilesForPlugin(repo.plugin_id);

    if (matchingFilePaths.length === 0) {
      [
        '',
        `No GoCD config files found in the repository for '${repo.plugin_id}' plugin!`,
        `Skipping validations...`
      ].forEach((line) => console.log("\x1b[33m", line));
      return;
    }

    console.log("\nSending following files for config merge validations:");
    matchingFilePaths.forEach(p => console.log(`- ${p}`));

    console.log("\nPerforming preflight check...");
    const result = await GoCD.preflight(GoCDServerUrl, GoCDAdminUserAccessToken, repo.id, repo.plugin_id, matchingFilePaths);
    util.representResult(result);
  })()
} catch (e) {
  core.setFailed(`\n${e.message}`)
}
