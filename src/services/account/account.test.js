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
