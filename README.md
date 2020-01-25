# 🚀 GoCD Mergable - Github Action

[![Build Status](https://travis-ci.org/GaneshSPatil/gocd-mergable.svg?branch=master)](https://travis-ci.org/GaneshSPatil/gocd-mergable)
[![Coverage Status](https://coveralls.io/repos/github/GaneshSPatil/gocd-mergable/badge.svg)](https://coveralls.io/github/GaneshSPatil/gocd-mergable)
[![Greenkeeper badge](https://badges.greenkeeper.io/GaneshSPatil/gocd-mergable.svg)](https://greenkeeper.io/)

A Github Action for verifying changes done to the GoCD config repository. 

On every check-in or a pull request, GoCD Mergable action verifies whether modifications done to the GoCD configuration files are valid or not by performing the [GoCD preflight check](https://api.gocd.org/current/#preflight-check-of-config-repo-configurations) on the specified config repository.  


## Usage

See [action.yml](https://github.com/actions/gocd-mergable/blob/master/action.yml) For comprehensive list of options.

#### Basic 

*Note:* Do not specify `GOCD_ADMIN_ACCESS_TOKEN` as a plain text value. 
Use [Github Secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) for specifying the secret access token.

```yaml
on: [push]

jobs:
  verify_config_repository:
    runs-on: ubuntu-latest
    name: verify config repository changes
    steps:
      - name: Git checkout
        uses: actions/checkout@v2
      - name: Verify Config Merge
        uses: GaneshSPatil/gocd-mergable@master
        with:
          GOCD_SERVER_URL: 'https://build.gocd.org/go'
          GOCD_ADMIN_ACCESS_TOKEN: ${{ secrets.GOCD_ADMIN_ACCESS_TOKEN }}
          GOCD_CONFIG_REPOSITORY_ID: 'plugin-api.go.cd-pipelines-yaml'
```

#### Validate on pull requests

```yaml
on: [pull_request]

jobs:
  verify_config_repository:
    runs-on: ubuntu-latest
    name: verify config repository changes
    steps:
      - name: Git checkout
        uses: actions/checkout@v2
      - name: Verify Config Merge
        uses: GaneshSPatil/gocd-mergable@master
        with:
          GOCD_SERVER_URL: 'https://build.gocd.org/go'
          GOCD_ADMIN_ACCESS_TOKEN: ${{ secrets.GOCD_ADMIN_ACCESS_TOKEN }}
          GOCD_CONFIG_REPOSITORY_ID: 'plugin-api.go.cd-pipelines-yaml'
```

#### Trigger validation only when configurations changes

GoCD's pipeline as code allows the pipeline configurations to be defined where the source is (same git repository).
But we often don't make changes to the pipeline configurations and thus can avoid GoCD mergable bot check by whitelisting the config files. 

```yaml
on:
  push:
    paths:
    - '.gocd/*.gocd.yml'
    - '.gocd/*.gocd.yaml'

jobs:
  verify_config_repository:
    runs-on: ubuntu-latest
    name: verify config repository changes
    steps:
      - name: Git checkout
        uses: actions/checkout@v2
      - name: Verify Config Merge
        uses: GaneshSPatil/gocd-mergable@master
        with:
          GOCD_SERVER_URL: 'https://build.gocd.org/go'
          GOCD_ADMIN_ACCESS_TOKEN: ${{ secrets.GOCD_ADMIN_ACCESS_TOKEN }}
          GOCD_CONFIG_REPOSITORY_ID: 'plugin-api.go.cd-pipelines-yaml'
```

## License

GoCD Mergable is an open source project, under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
