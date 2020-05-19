require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

const {
  TEST_SETTING_ZUID
} = process.env;

test.beforeEach(authContext);

// Settings
test("fetchSettings:200", async t => {
  const res = await t.context.sdk.instance.getSettings();

  t.is(res.statusCode, 200)
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length);
});
test("fetchSetting:200", async t => {
  const res = await t.context.sdk.instance.getSetting(TEST_SETTING_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, TEST_SETTING_ZUID);
});
