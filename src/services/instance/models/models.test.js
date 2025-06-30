require("dotenv").config();

// const fs = require("fs");
const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

// const ITEM_JSON = JSON.parse(
//   fs.readFileSync(`./test/fixtures/${ITEM_ZUID}.json`).toString()
// );

test.before(authContext);

// Models
test("fetchModels:200", async t => {
  const res = await t.context.sdk.instance.getModels();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchModel:200", async t => {
  const res = await t.context.sdk.instance.getModel(
    process.env.TEST_MODEL_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_MODEL_ZUID);
});
test("fetchModel:404", async t => {
  const res = await t.context.sdk.instance.getModel("6-0000-00000");
  t.is(res.statusCode, 404);
  t.truthy(typeof res.data === "object");
  t.is(Object.keys(res.data).length, 0);
  t.is(res.message, "No Results Found for ZUID: 6-0000-00000");
});

test("createModel:200", async t => {
  const name = `node-sdk_createmodel_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createModel({
      label : name,
      type : "templateset",
      name : name,
      listed : true
  })
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
})
