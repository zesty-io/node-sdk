"use strict";

require("dotenv").config();

const test = require("ava");

const Auth = require("./auth");
const Instance = require("./instance");

const MODEL_ZUID = "6-aa7788-9dhmdf";
const FIELD_ZUID = "12-d2aa60-cj23bq";
const ITEM_ZUID = "7-780b5a8-823sn7";
const PUBLISH_ZUID = "18-7f5ff3a-rnn5ls";
const ITEM_VERSION = 4;

test.beforeEach(async t => {
  const auth = new Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.context.instance = new Instance(
    process.env.ZESTY_INSTANCE_ZUID,
    session.token
  );
});

test.skip("proposed API interface", async t => {
  // const instance = sdk.Instance(INSTANCE_ZUID)
  // const model = instance.Model(MODEL_ZUID)
  // const res = await model.Item(ITEM_ZUID).get();
  // const res = await model.Item(ITEM_ZUID).save();
  // const res = await model.Item(ITEM_ZUID).publish();
  // const res = await model.Item(ITEM_ZUID).unpublish();
  // const res = await model.Item(ITEM_ZUID).delete();
  // const res = await model.Item().create({
  //   data: {
  //     field1: "Hello Test 1",
  //     field2: "Hello Test 2"
  //   },
  //   web: {
  //     canonicalTagMode: 1,
  //     metaLinkText: "Hello Test 1",
  //     metaTitle: "Meta Title Text",
  //     metaKeywords: "meta,keyword,list",
  //     metaDescription: "This is the meta description."
  //   },
  //   meta: {
  //     contentModelZUID: MODEL_ZUID,
  //     createdByUserZUID: USER_ZUID
  //   }
  // })
});

// Models
test("fetchModels:200", async t => {
  const res = await t.context.instance.getModels();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchModel:200", async t => {
  const res = await t.context.instance.getModel(MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, MODEL_ZUID);
});
test("fetchModel:404", async t => {
  const res = await t.context.instance.getModel("6-0000-00000");
  t.is(res.statusCode, 404);
  t.truthy(typeof res.data === "object");
  t.is(Object.keys(res.data).length, 0);
  t.is(res.message, "No Results Found for ZUID: 6-0000-00000");
});

// Fields
test("fetchModelFields:200", async t => {
  const res = await t.context.instance.getModelFields(MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchModelField:200", async t => {
  const res = await t.context.instance.getModelField(MODEL_ZUID, FIELD_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, FIELD_ZUID);
  t.is(res.data.contentModelZUID, MODEL_ZUID);
});

// Content Item
test("fetchItems:200", async t => {
  const res = await t.context.instance.getItems(MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchItem:200", async t => {
  const res = await t.context.instance.getItem(MODEL_ZUID, ITEM_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.ZUID, ITEM_ZUID);
  t.is(res.data.meta.contentModelZUID, MODEL_ZUID);
});
test("getItemPublishings:200", async t => {
  const res = await t.context.instance.getItemPublishings(
    MODEL_ZUID,
    ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].itemZUID, ITEM_ZUID);
});
test.skip("getItemPublishing:200", async t => {
  const res = await t.context.instance.getItemPublishing(
    MODEL_ZUID,
    ITEM_ZUID,
    PUBLISH_ZUID
  );
  t.is(res.statusCode, 200);
});
test("getItemVersions:200", async t => {
  const res = await t.context.instance.getItemVersions(MODEL_ZUID, ITEM_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("getItemVersion:200", async t => {
  const res = await t.context.instance.getItemVersion(
    MODEL_ZUID,
    ITEM_ZUID,
    ITEM_VERSION
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.contentModelZUID, MODEL_ZUID);
  t.is(res.data.meta.ZUID, ITEM_ZUID);
  t.is(res.data.meta.version, ITEM_VERSION);
});

// Templates
