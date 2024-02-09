const fs = require('fs');
const rp = require('request-promise');


function fetchVersion(serverUrl, accessToken) {
  const options = {
    url: `${serverUrl}/api/version`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'Accept':        'application/vnd.go.cd.v1+json'
    }
  }
  return rp(options).then(function (json) {
    const res = JSON.parse(json);
    return res.version
  }
}


function fetch(serverUrl, accessToken, id) {

  const serverVersion = fetchVersion(serverUrl, accessToken)
  
  var acceptVersion = "v2"
  if (serverVersion >= "20.8.0") {
      acceptVersion = "v4"
  }
  
  const options = {
    url:     `${serverUrl}/api/admin/config_repos/${id}`,
    headers: {
      'Authorization': `bearer ${accessToken}`,
      'Accept':        `application/vnd.go.cd.${acceptVersion}+json`
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
