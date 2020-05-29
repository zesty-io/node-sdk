require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

// 
// HEADERS 
// 

// 
// HEADERS GET
// 

// test successful web headers retrieval
test.serial("getWebHeaders:200", async t => {
  const res = await t.context.sdk.instance.getWebHeaders();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// HEADTAGS 
// 

// 
// HEADTAGS GET
// 

// test successful headtags retrieval
test.serial("getHeadTags:200", async t => {
  const res = await t.context.sdk.instance.getHeadTags();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// HEADTAG GET
// 

// test successful headtag retrieval
test.serial("getHeadTag:200", async t => {
  const res = await t.context.sdk.instance.getHeadTag(
    process.env.TEST_HEAD_TAG_ZUID
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_HEAD_TAG_ZUID);
});

// test failed headtag retrieval with no head tag ZUID
test.serial("getHeadTag with no headTagZUID", async t => {
  const noHeadTagZUID = await t.throwsAsync(
    t.context.sdk.instance.getHeadTag()
  );

  t.is(
    noHeadTagZUID.message,
    "SDK:Instance:HeadTags:getHeadTag() missing required `headTagZUID` argument"
  );
});
