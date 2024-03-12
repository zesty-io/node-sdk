require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.beforeEach(authContext);

// Settings
test("fetchSettings:200", async t => {
  const res = await t.context.sdk.instance.getSettings();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length);
});

test("fetchSetting:200", async t => {
  const res = await t.context.sdk.instance.getSetting(
    process.env.TEST_SETTING_ZUID
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_SETTING_ZUID);
});

test("createSetting:201", async t => {
  const name = `setting_name_${moment().valueOf()}`;
  const group = `setting_group_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createSetting({
    category : group,
    keyFriendly : name,
    key : name,
    value : 'Test Value from createSetting',
    dataType : "text",
    parsleyAccess : true,
    admin : false,
    tips : 'This is from test'
  })

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("updateSetting:200", async t => {
  const name = `node-sdk_updateSetting_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.updateSetting(
    process.env.TEST_SETTING_ZUID,
    {
      category : "twitter",
      key : name
    }
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_SETTING_ZUID);
});

test("patchSetting:200", async t => {
  const name = `node-sdk_patchSetting_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.patchSetting(
    process.env.TEST_SETTING_ZUID,
    {
      category : "twitter",
      key : name
    }
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_SETTING_ZUID);
});

test("deleteSetting:200", async t => {
  const name = `setting_name_${moment().valueOf()}`;
  const group = `setting_group_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createSetting({
    category : group,
    keyFriendly : name,
    key : name,
    value : 'Test Value from createSetting',
    dataType : "text",
    parsleyAccess : true,
    admin : false,
    tips : 'This is from test'
  })

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  const newSettingZUID = res.data.ZUID;
  
  res = await t.context.sdk.instance.deleteSetting(
    newSettingZUID
  );

  t.is(res.statusCode, 200);
});