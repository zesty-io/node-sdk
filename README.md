# node-sdk

[!version badge](https://img.shields.io/npm/v/@zesty-io/sdk)

> This package is the [Zesty.io](https://www.zesty.io/) software development kit (SDK) for the [node.js](https://nodejs.org/en/) runtime

### what is zesty.io?

[Zesty.io](https://www.zesty.io/) is a cloud web content management system (WCMS) that is API driven with open-source user interfaces. Our software is built to automate the configuration, optimization, and distribution of digital content so marketing teams and developers can focus on creating excellent digital experiences. [Learn more in our platform knowledge base](https://zesty.org/).

### pre-requisites

- [Node.js 10.16 LTS](https://nodejs.org/dist/latest-v10.x/docs/api/)

### installing

```
npm install @zesty-io/sdk
```

## [Get started using the node-sdk](https://github.com/zesty-io/node-sdk/wiki)

### development

By providing a `.env` file and override values a developer can build the SDK code against alternate (non-production) services.

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

### license

[GNU](https://www.gnu.org/licenses/gpl-3.0.en.html)
