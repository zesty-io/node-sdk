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
  const SETTING_ZUID = "29-875da54-677865"; //1
  const res = await t.context.sdk.instance.getSetting(SETTING_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, SETTING_ZUID);
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
})

test("updateSetting:200", async t => {
  const SETTING_ZUID = "29-875da54-677865"; //1
  const res = await t.context.sdk.instance.updateSetting(
    SETTING_ZUID,
    // {
    //   data: {
    //     title,
    //   },
    //   meta: {
    //     contentModelZUID: "6-aa7788-9dhmdf",
    //     masterZUID: "7-780b5a8-823sn7",
    //     ZUID: "7-780b5a8-823sn7",
    //   },
    //   web: {
    //     createdByUserZUID: "5-44ccc74-tr1vmph",
    //     pathPart,
    //   },
    // }  
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, SETTING_ZUID);
});

test("patchSetting:200", async t => {
  const SETTING_ZUID = "29-875da54-677865"; //1
  const res = await t.context.sdk.instance.patchSetting(
    SETTING_ZUID,
    // {
    //   data: {
    //     title,
    //   },
    //   meta: {
    //     contentModelZUID: "6-aa7788-9dhmdf",
    //     masterZUID: "7-780b5a8-823sn7",
    //     ZUID: "7-780b5a8-823sn7",
    //   },
    //   web: {
    //     createdByUserZUID: "5-44ccc74-tr1vmph",
    //     pathPart,
    //   },
    // }  
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, SETTING_ZUID);
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
  
  res = await t.context.sdk.instance.deleteSetting(res.data.ZUID);

  t.is(res.statusCode, 200);
});