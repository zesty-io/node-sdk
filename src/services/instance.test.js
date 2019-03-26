"use strict";

require("dotenv").config();

const test = require("ava");

const Auth = require("./auth");
const Instance = require("./instance");

const MODEL_ZUID = "6-aa7788-9dhmdf";
const FIELD_ZUID = "12-d2aa60-cj23bq";
const ITEM_ZUID = "7-82b5cff0fc-7pkvcp";

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

// Templates
