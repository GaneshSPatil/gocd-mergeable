const nock     = require('nock');
const path     = require('path');
const {assert} = require('assertthat');
const GoCD     = require(path.resolve('util/gocd'));
const mock     = require('mock-fs');

describe('GoCD', function () {
  const serverUrl          = "https://demo.gocd.org/go";
  const accessToken        = "my-admin-access-token";
  const configRepoId       = "repo1";
  const configRepoPluginId = "json.plugin";

  afterEach(mock.restore);

  describe('Config Repository', () => {
    it('should make a request to fetch config repository', async function () {
      const scope = nock(serverUrl)
        .get(`/api/admin/config_repos/${configRepoId}`)
        .matchHeader("authorization", `bearer ${accessToken}`)
        .matchHeader("accept", `application/vnd.go.cd.v2+json`)
        .reply(200, {
          "id":            configRepoId,
          "plugin_id":     "json.config.plugin",
          "material":      {
            "type":       "git",
            "attributes": {
              "url":    "https://github.com/config-repo/gocd-json-config-example.git",
              "branch": "master"
            }
          },
          "configuration": []
        });

      const repo = await GoCD.fetchConfigRepository(serverUrl, accessToken, configRepoId);

      assert.that(repo.id).is.equalTo(configRepoId);
      assert.that(repo.plugin_id).is.equalTo("json.config.plugin");

      scope.done();
    });

    it('should fail when the specified config repository does not exists', function (done) {
      const scope = nock(serverUrl)
        .get(`/api/admin/config_repos/${configRepoId}`)
        .matchHeader("authorization", `bearer ${accessToken}`)
        .matchHeader("accept", `application/vnd.go.cd.v2+json`)
        .reply(404, {
          message: {
            "message": "The specified config repository does not exists"
          }
        });

      GoCD.fetchConfigRepository(serverUrl, accessToken, configRepoId).catch((err) => {
        const msg = '404 - "{\\"message\\":{\\"message\\":\\"The specified config repository does not exists\\"}}"';
        assert.that(err.message).is.equalTo(msg);
        scope.done();
        done();
      });

    });
  });

  describe('Preflight', () => {
    it('should perform preflight check', async function () {
      mock({
        'example.gocd.yaml': 'some-valid-yaml'
      });

      const verifyRequestBody = (body) => {
        return body.includes('----------------------------') && //start
          body.includes('Content-Disposition: form-data;') &&
          body.includes('name="files[]"') &&
          body.includes('some-valid-yaml');
      };

      const scope = nock(serverUrl)
        .post(`/api/admin/config_repo_ops/preflight?pluginId=${configRepoPluginId}&repoId=${configRepoId}`, verifyRequestBody)
        .matchHeader("authorization", `bearer ${accessToken}`)
        .matchHeader("accept", `application/vnd.go.cd.v1+json`)
        .reply(200, {
          valid:  true,
          errors: []
        });

      const res = await GoCD.preflight(serverUrl, accessToken, configRepoId, configRepoPluginId, ['example.gocd.yaml']);
      assert.that(res.valid).is.equalTo(true);

      scope.done();
    });
  });

  it('should get file pattern for json plugin', () => {
    const pluginId = 'json.config.plugin';
    const pattern  = GoCD.getFilePatterns()[pluginId];

    assert.that(pattern).is.equalTo(['*.gopipeline.json', '*.goenvironment.json']);
  });

  it('should get file pattern for yaml plugin', () => {
    const pluginId = 'yaml.config.plugin';
    const pattern  = GoCD.getFilePatterns()[pluginId];

    assert.that(pattern).is.equalTo(['**/*.gocd.yaml', '**/*.gocd.yml']);
  });

  it('should get file pattern for groovy plugin', () => {
    const pluginId = 'cd.go.contrib.plugins.configrepo.groovy';
    const pattern  = GoCD.getFilePatterns()[pluginId];

    assert.that(pattern).is.equalTo(['**/*.gocd.groovy']);
  });
});

