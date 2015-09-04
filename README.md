# configurator

> A microservice for adding Totem's webhooks to GitHub repositories

Works with the [Totem dashboard](https://github.com/totem/dashboard-v2)

### Setup

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

#### Register your GitHub application

You can [register here](https://github.com/settings/applications/new). Set the 'Authorization callback URL' to the domain you are hosting this service at with a path of `/auth/github/callback`.

#### Set environment variables

- `GITHUB_CLIENT_ID`: the client ID for your registered GitHub app
- `GITHUB_CLIENT_SECRET`: the client secret for your registered GitHub app

#### Set up [config service](https://github.com/totem/config)

Your config service should serve something along the lines of the following:

```json
{
  "dashboardUrl": "< URL to your Totem dashboard >",
  "serviceUrl": "< URL this service will be hosted at >",
  "hooks": [
    {
      "name": "web",
      "config": {
        "url": "< URL to your Image Factory webhook >",
        "content_type": "json"
      },
      "events": ["push"]
    },
    {
      "name": "web",
      "config": {
        "url": "< URL to your Orchestrator webhook >",
        "content_type": "json"
      },
      "events": ["delete"]
    }
  ]
}
```

(Currently this is just a `config.json` file in the root of the repo, TODO: remove and set up config service.)

### Runnning

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

### Tests

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
