const fs = require('fs');
const rp = require('request-promise');

function fetch(serverUrl, accessToken, id) {
  const options = {
    url:     `${serverUrl}/api/admin/config_repos/${id}`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'Accept':        'application/vnd.go.cd.v2+json'
    }
  };

  return rp(options).then(function (json) {
    return JSON.parse(json);
  });
}

async function preflight(serverUrl, accessToken, id, pluginId, filePaths) {
  const options = {
    url:      `${serverUrl}/api/admin/config_repo_ops/preflight?pluginId=${pluginId}&repoId=${id}`,
    headers:  {
      'Authorization': `bearer ${accessToken}`,
      'Content-Type':  'multipart/form-data',
      'Accept':        'application/vnd.go.cd.v1+json',
    },
    formData: {
      "files[]": filePaths.map((path) => fs.readFileSync(path, 'utf8'))
    }
  };

  return rp.post(options).then(function (json) {
    return JSON.parse(json);
  });
}

function getFilePatterns() {
  return {
    "yaml.config.plugin":                      ['**/*.gocd.yaml', '**/*.gocd.yml'],
    "json.config.plugin":                      ['*.gopipeline.json', '*.goenvironment.json'],
    "cd.go.contrib.plugins.configrepo.groovy": ['**/*.gocd.groovy']
  }
}

module.exports = {
  fetchConfigRepository: fetch,
  preflight,
  getFilePatterns
};
