require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

test("getWebHeaders:200", async t => {
  const res = await t.context.sdk.instance.getWebHeaders();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("getHeadTags:200", async t => {
  const res = await t.context.sdk.instance.getHeadTags();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.skip("getHeadTag:200", async t => {
  const res = await t.context.sdk.instance.getHeadTag(
    process.env.TEST_HEAD_TAG_ZUID
  );

  console.log(res);

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_HEAD_TAG_ZUID);
});
