require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

// Settings
test("fetchSettings:200", async t => {
  const res = await t.context.instance.getSettings();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length);
});
test("fetchSetting:200", async t => {
  const SETTING_ID = 1;
  const res = await t.context.instance.getSetting(SETTING_ID);

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ID, SETTING_ID);
});
