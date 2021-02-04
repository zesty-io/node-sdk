# node-sdk ![version badge](https://img.shields.io/npm/v/@zesty-io/sdk)

> [Zesty.io](https://www.zesty.io/) software development kit (SDK) for the [node.js](https://nodejs.org/en/) runtime

### what is zesty.io?

[Zesty.io](https://www.zesty.io/) is a web content management system (WCMS) that is API driven with open-source user interfaces. Our software is built to automate the configuration, optimization, and distribution of digital content so marketing teams and developers can focus on creating excellent digital experiences. [Learn more in our platform knowledge base](https://zesty.org/).


## Usage

### prerequisites

- [Node.js 10.16 LTS](https://nodejs.org/dist/latest-v10.x/docs/api/)

### installing

```
npm install @zesty-io/sdk
```

### sdk client reference

Once you have the prerequisites meet and the sdk installed, review our guide to [getting started using the node-sdk](https://github.com/zesty-io/node-sdk/wiki)


## Development

By providing a `.env` file a developer can override the default production settings and develop the SDK code against alternate (non-production) services.

*When developing against alternate environments you will need to use credentials (token / user) from that alternate env. e.g. Testing against stage requries using a instance access token that exists on the stage isntance.*

```
// These are the basic SDK values. 
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

#### testing
```
npm test
```

## License

[GNU](https://www.gnu.org/licenses/gpl-3.0.en.html)
