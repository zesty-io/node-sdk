# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests with coverage
npm test

# Run a single test file
npx ava src/services/instance/items/items.test.js --verbose --timeout=2m

# Format staged files (pre-commit)
npm run precommit
```

Tests require a `.env` file with valid Zesty.io credentials and ZUIDs (see README.md for full list of required env vars). Tests hit real Zesty.io APIs — there are no mocks.

## Architecture

This is a Node.js client SDK for the [Zesty.io](https://zesty.io) CMS API. The main entry point is [src/sdk.js](src/sdk.js), which exports a single `SDK` class.

### Request handling

[src/services/service.js](src/services/service.js) is the base class for all services. It provides `getRequest`, `postRequest`, `putRequest`, `patchRequest`, and `deleteRequest` helpers that:
- Attach `Authorization: Bearer <token>` headers automatically
- Standardize response shape to `{ statusCode, data, ... }`
- Use `interpolate()` to fill URL path parameters (e.g., `MODEL_ZUID`, `ITEM_ZUID`)

### Service classes

Three top-level services hang off the SDK instance:
- `sdk.auth` — authentication (`src/services/auth/`)
- `sdk.account` — account/team management (`src/services/account/`)
- `sdk.instance` — all instance-scoped resources (`src/services/instance/`)
- `sdk.media` — file/media bin management (`src/services/media/`)

### Mixin pattern (Instance service)

The Instance service is large, so it's split into domain modules under `src/services/instance/`. Each module exports:
```js
module.exports = {
  API: { /* endpoint string constants */ },
  mixin: superclass => class extends superclass { /* methods */ }
}
```

[src/services/instance/index.js](src/services/instance/index.js) composes them via `mix(Service).with(Models.mixin, Items.mixin, ...)`. This aggregates all `API` constants onto `this.API` and all methods onto the single `Instance` instance. Follow this pattern when adding new resource types.

### Actions

`src/actions/` holds complex multi-step operations (e.g., `findAndReplace`) that orchestrate multiple service calls. They're bound to the SDK instance and exposed as `sdk.action.<name>()`.

### URL interpolation

API endpoint constants use `UPPER_SNAKE_CASE` placeholders:
```js
const API = { fetchItem: "/models/MODEL_ZUID/items/ITEM_ZUID" };
this.getRequest(this.interpolate(this.API.fetchItem, { MODEL_ZUID, ITEM_ZUID }));
```

### Auth flow

```js
const auth = new SDK.Auth();
const session = await auth.login(email, password);
const sdk = new SDK(instanceZUID, session.token);
```

Constructors accept an `options` object to override API base URLs (useful for dev/staging environments). Fallback URLs come from env vars: `ZESTY_AUTH_API`, `ZESTY_ACCOUNTS_API`, `ZESTY_INSTANCE_API`, `ZESTY_MEDIA_API`.
