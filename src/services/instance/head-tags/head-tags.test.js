require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

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

test("getHeadTag:200", async t => {
  const res = await t.context.sdk.instance.getHeadTag(
    process.env.TEST_HEAD_TAG_ZUID
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_HEAD_TAG_ZUID);
});

test("createHeadTag:201", async t => {
  const name = `node-sdk_createHeadtag_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createHeadTag(
    {
      type: "script",
			attributes: {
				name: name
			},
			resourceZUID: process.env.TEST_ITEM_ZUID,
		  sort: 1
    }
  );

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("updateHeadTag:200", async(t) => {
  const name = `node-sdk_updateHeadTag_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.updateHeadTag(
    process.env.TEST_HEAD_TAG_ZUID,
    {
			type: "meta",
      attributes: {
				name: name
			},
		  sort: 0
    }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("patchHeadTag:200", async(t) => {
  let res = await t.context.sdk.instance.patchHeadTag(
    process.env.TEST_HEAD_TAG_ZUID,
    {
      sort: 1
    }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("deleteHeadTag:200", async(t) => {
  const name = `node-sdk_createHeadtag_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createHeadTag(
    {
      type: "script",
			attributes: {
				name: name
			},
			resourceZUID: process.env.TEST_ITEM_ZUID,
		  sort: 1
    }
  );

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  const newHeadtagZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteHeadTag(
    newHeadtagZUID
  );

  t.is(res.statusCode, 200);
});