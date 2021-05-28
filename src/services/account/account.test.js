require("dotenv").config();

const test = require("ava");

const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

test("getInstance:200", async t => {
  const res = await t.context.sdk.account.getInstance();
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.ZESTY_INSTANCE_ZUID);
});

test("getInstanceUsers:200", async t => {
  const res = await t.context.sdk.account.getInstanceUsers();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// WEBHOOKS
// 

// 
// WEBHOOK CREATE
// 

// test successful webhook creation
test.serial("create a webhook", async t => {
  const opts = {
    scopedResource: process.env.ZESTY_INSTANCE_ZUID,
    eventAction: t.context.sdk.account.CREATE,
    parentResourceZUID: null,
    resource: "items",
    method: "POST",
    URL: "http://website.com",
    contentType: t.context.sdk.account.JSON,
    authorization: null,
    body: null,
    description: null,
  };

  const res = await t.context.sdk.account.createWebhook(opts);
  t.is(res.statusCode, 201)
  t.is(
    res.data.eventAction,
    t.context.sdk.account.CREATE
  );
  t.is(
    res.data.resource,
    "items"
  );
  t.is(
    res.data.method,
    "POST"
  );
  t.is(
    res.data.contentType,
    t.context.sdk.account.JSON
  );
});


// test failed webhook creation with an invalid event action
test.serial("create a webhook with an invalid event action", async t => {
  const badAction = await t.throwsAsync(
    t.context.sdk.account.createWebhook({
      eventAction: 0
    })
  );
  t.is(
    badAction.message,
    "Invalid eventAction value"
  );
});

// test failed webhook creation with an invalid method
test.serial("create a webhook with an invalid method", async t => {
  const opts = {
    eventAction: 1,
    method: "PUT"
  };
  const badMethod = await t.throwsAsync(
    t.context.sdk.account.createWebhook(opts)
  );

  t.is(
    badMethod.message,
    `Unsupported method type: ${opts.method}`
  );
});

// test failed webhook creation with an invalid content type
test.serial("create a webhook with an invalid content type", async t => {
  const opts = {
    eventAction: 1,
    method: "POST",
    contentType: "text/html"
  };
  const badContentType = await t.throwsAsync(
    t.context.sdk.account.createWebhook(opts)
  );

  t.is(
    badContentType.message,
    `Unsupported content-type: ${opts.contentType}`
  );
});

// 
// WEBHOOKS GET
// 

// test successful webhhooks retrieval on a given instance
test.serial("get all webhooks for a specific instance", async t => {
  const res = await t.context.sdk.account.getWebhooks();

  t.truthy(
    Array.isArray(res.data)
  );

  t.truthy(
    res.data.length > 0
  );
});

// 
// WEBHOOK GET
// 

// test successful single webhook retrieval
test.serial("get a single webhook", async t => {
  const res = await t.context.sdk.account.getWebhook(
    process.env.TEST_WEBHOOK_ZUID
  );

  t.is(
    res.statusCode,
    200
  );
});

// test failed single webhook retrieval
test.serial("get a webhook with an invalid webhook ZUID", async t => {
  const BAD_WEBHOOK_ZUID = "39-1234-ABCD";
  const badWebhookZUID = await t.throwsAsync(
    t.context.sdk.account.getWebhook(BAD_WEBHOOK_ZUID)
  );

  t.is(
    badWebhookZUID.message,
    `Invalid webhook ZUID: ${BAD_WEBHOOK_ZUID}`
  );
});