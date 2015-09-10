# configurator API guide

## `/auth/github`

This route is for authenticating the user with GitHub via OAuth.

For this to work, you will need to direct your user to this route via `window.open()`, and listen in your opener window for a message from the opened window. The message will contain a stringified object with the user's OAuth token at `message.token`. You should store that token and send it in the `Authorization` header when sending requests to `add/:user/:repo` as `Bearer <TOKEN>`.

## POST `/add/:user/:repo`

This route is for adding the configured webhooks to GitHub repositories.

An `Authorization` header with an OAuth token is required by this route. The response from the route will include an array of objects with information from GitHub about the hooks that were created. If there are errors creating any of the webhooks, there will be an error object in place of that webhook's information object. When all webhook creations are successful, the app will respond with a `201 Created` status code. If there are errors creating any of the webhooks, the app will respond with the status code from the last error.

#### Example information object

```json
{
    "url": "https://api.github.com/repos/user/repo/hooks/5770006",
    "test_url": "https://api.github.com/repos/user/repo/hooks/5770006/test",
    "ping_url": "https://api.github.com/repos/user/repo/hooks/5770006/pings",
    "id": 5770006,
    "name": "web",
    "active": true,
    "events": [
        "push"
    ],
    "config": {
        "url": "http://testing.hooks/hook",
        "content_type": "json"
    },
    "last_response": {
        "code": null,
        "status": "unused",
        "message": null
    },
    "updated_at": "2015-09-04T17:10:22Z",
    "created_at": "2015-09-04T17:10:22Z",
    "meta": {
        "x-ratelimit-limit": "5000",
        "x-ratelimit-remaining": "4999",
        "x-ratelimit-reset": "1441390222",
        "x-oauth-scopes": "write:repo_hook",
        "location": "https://api.github.com/repos/user/repo/hooks/5770006",
        "etag": "\"74f2fa9df55177ec19e363285db0802b\"",
        "status": "201 Created"
    }
}
```

#### Example error object

```json
{
    "message": "Validation Failed",
    "errors": [
        {
            "resource": "Hook",
            "code": "custom",
            "message": "Hook already exists on this repository"
        }
    ],
    "documentation_url": "https://developer.github.com/v3/repos/hooks/#create-a-hook"
}
```
