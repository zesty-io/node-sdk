"use strict";

require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const Auth = require("./auth");
const Instance = require("./instance");

const MODEL_ZUID = "6-aa7788-9dhmdf";
const FIELD_ZUID = "12-d2aa60-cj23bq";
const ITEM_ZUID = "7-780b5a8-823sn7";
const PUBLISH_ZUID = "18-7f5ff3a-rnn5ls";
const ITEM_VERSION = 4;
const ITEM_JSON = JSON.parse(
  fs.readFileSync(`./test/fixtures/${ITEM_ZUID}.json`).toString()
);

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
test("createItem:200", async t => {
  const title = `node-sdk:createItem:${moment().format()}`;
  const res = await t.context.instance.createItem(MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.instance.formatPath(title)
    }
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("updateItem:200", async t => {
  const res = await t.context.instance.updateItem(
    MODEL_ZUID,
    ITEM_ZUID,
    ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, ITEM_ZUID);
});

test("findItem:200", async t => {
  const res = await t.context.instance.findItem(ITEM_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(typeof res.data[0].web === "object");
  t.truthy(typeof res.data[0].meta === "object");
  t.truthy(typeof res.data[0].data === "object");
  t.is(res.data[0].meta.ZUID, ITEM_ZUID);
});

// Upsert: update existing item
test("upsertItem:200", async t => {
  const EXISTING_PATH = "node-sdk-updateitem";
  const res = await t.context.instance.upsertItem(
    MODEL_ZUID,
    EXISTING_PATH,
    ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, ITEM_ZUID);
});

// Upsert: create new item
test.skip("upsertItem:201", async t => {
  const title = `node-sdk:upsertItem:${moment().format()}`;
  const pathPart = t.context.instance.formatPath(title);
  const res = await t.context.instance.upsertItem(MODEL_ZUID, pathPart, {
    data: {
      title
    },
    meta: {
      contentModelZUID: "6-aa7788-9dhmdf",
      masterZUID: "7-780b5a8-823sn7",
      ZUID: "7-780b5a8-823sn7"
    },
    web: {
      createdByUserZUID: "5-44ccc74-tr1vmph",
      parentZUID: "6-aa7788-9dhmdf",
      pathPart
    }
  });

  t.is(res.statusCode, 201);
});

// Templates
