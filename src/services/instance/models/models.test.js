require("dotenv").config();

// const fs = require("fs");
const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

// const ITEM_JSON = JSON.parse(
//   fs.readFileSync(`./test/fixtures/${ITEM_ZUID}.json`).toString()
// );

test.beforeEach(authContext);

// Models
test.serial("fetchModels:200", async t => {
  const res = await t.context.sdk.instance.getModels();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test.serial("fetchModel:200", async t => {
  const res = await t.context.sdk.instance.getModel(
    process.env.TEST_MODEL_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_MODEL_ZUID);
});
test.serial("fetchModel:404", async t => {
  const res = await t.context.sdk.instance.getModel("6-0000-00000");
  t.is(res.statusCode, 404);
  t.truthy(typeof res.data === "object");
  t.is(Object.keys(res.data).length, 0);
  t.is(res.message, "No Results Found for ZUID: 6-0000-00000");
});

// test get model without a ZUID
test.serial("getModel without a model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getModel();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getModel() missing required `modelZUID` argument");
  }
})