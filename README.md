# configurator

> A microservice for adding Totem's webhooks to GitHub repositories

Works with the [Totem dashboard](https://github.com/totem/dashboard-v2)

## Setup

#### Clone and install dependencies

```
git clone git@github.com:totem/configurator.git
cd configurator
npm install
```

For local development [Gulp](http://gulpjs.com/) is required. If it's not already installed, run:

```
npm install -g gulp
```

#### Register your GitHub application or generate personal access token

To use OAuth, you can [register a new application here](https://github.com/settings/applications/new). Set the 'Authorization callback URL' to the domain you are hosting this service at with a path of `/auth/github/callback`.

Alternatively, you can [generate a personal access token here](https://github.com/settings/tokens/new), and use that to authorize the configurator. You must give the token a scope containing `write:repo_hook`.

#### Set environment variables

- `CONFIGURATOR_HOST`: the host that the configurator is deployed to
- `CONFIGURATOR_RUNTIME_CONFIG`: the URL to your runtime config for the configurator from your config service
- `TOTEM_SERVICES_CONFIG`: the URL to your totem services config on your config service (`https://{{config-service-url}}/providers/s3/groups/{{env}}/configs/totem-services`)

##### OAuth

- `CONFIGURATOR_GITHUB_CLIENT_ID`: the client ID for your registered GitHub app
- `CONFIGURATOR_GITHUB_CLIENT_SECRET`: the client secret for your registered GitHub app

##### Personal Access Token

- `CONFIGURATOR_GITHUB_ACCESS_TOKEN`: the personal access token you generated on GitHub

#### Set up [config service](https://github.com/totem/config)

Your config service should serve something along the lines of the following:

```yml
hooks:
  - name: 'web'
    config:
      url: '{{URL to your Image Factory webhook}}'
      content_type: 'json'
    events:
      - push
  - name: 'web'
    config:
      url: '{{URL to your Orchestrator webhook}}'
      content_type: 'json'
    events:
      - delete
```

## Runnning

#### Local development

```
gulp
```

This will serve the app at `http://localhost:5000`.

#### Production

```
node bin/www
```

This will serve the app at port `5000`.

## Tests

#### Linting

```
gulp lint
```

#### Unit tests

```
gulp unit
```

#### Both

```
gulp test
```
