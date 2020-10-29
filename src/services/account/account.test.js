require("dotenv").config();

const test = require("ava");

const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

// 
// ACCOUNTS
// 

// 
// ACCOUNTS GET INSTANCE
// 

// test succesful instance retrieval
test.serial("getInstance:200", async t => {
  const res = await t.context.sdk.account.getInstance();
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.ZESTY_INSTANCE_ZUID);
});

// 
// ACCOUNTS GET INSTANCE
//

// test successful instance users retrieval 
test.serial("getInstanceUsers:200", async t => {
  const res = await t.context.sdk.account.getInstanceUsers();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// ACCOUNTS GET SITE ID
// 

// test successful getting site ID from local instance object
test.serial("getSiteId:200", async t => {
  const res = await t.context.sdk.account.getSiteId();
  t.is(res, parseInt(process.env.ZESTY_SITE_ID));
})

// test successful retrieval of a manually set site ID
test.serial("getSiteId:200 with manual id being set", async t => {
  t.context.sdk.account.siteId = 123;
  const res = await t.context.sdk.account.getSiteId();
  t.is(
    res, 
    123
  );
})