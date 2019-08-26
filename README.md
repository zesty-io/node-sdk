# node-sdk

> [Zesty.io](https://www.zesty.io/) SDK(software development kit) for node.js runtime

## installing

```
npm install @zesty-io/sdk
```

## usage

Review the [repository wiki](https://github.com/zesty-io/node-sdk/wiki) for complete documentation on usage.

## development

By providing a .env file and override values a developer can build the SDK code against alternate (non-production) services.

```
// These are the basic SDK values. They can be hard code into your SDK usage or can be loaded
// from a .env file as such
ZESTY_INSTANCE_ZUID=
ZESTY_USER_EMAIL=
ZESTY_USER_PASSWORD=

// Services that are used can be overriden to use alternate service locations.
// e.g. local development services
ZESTY_AUTH_API=
ZESTY_ACCOUNTS_API=
ZESTY_INSTANCE_API=
ZESTY_MEDIA_API=
ZESTY_COOKIE=

// The included SDK tests require providing resource ZUIDs to run against
TEST_ITEM_VERSION=
TEST_BIN_ZUID=
TEST_MODEL_ZUID=
TEST_ITEM_ZUID=
TEST_FIELD_ZUID=
TEST_AUDIT_LOG_ZUID=
TEST_PUBLISH_ZUID=
TEST_HEAD_TAG_ZUID=
```
