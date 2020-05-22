require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

// Fields
test("fetchModelFields:200", async t => {
  const res = await t.context.sdk.instance.getModelFields(
    process.env.TEST_MODEL_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchModelField:200", async t => {
  const res = await t.context.sdk.instance.getModelField(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_FIELD_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_FIELD_ZUID);
  t.is(res.data.contentModelZUID, process.env.TEST_MODEL_ZUID);
});

//  tests model fields retrieval without specificying a model ZUID
test("fetchModelFields: requires model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getModelFields();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getModelFields() missing required `modelZUID` argument");
  }
})

//  tests single model field retrieval without specificying a model ZUID
test("fetchModelField: requires model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getModelField();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getModelField() missing required `modelZUID` argument");
  }
})

//  tests single model field retrieval without specificying a field ZUID
test("fetchModelField: requires field ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getModelField(
      process.env.TEST_MODEL_ZUID,
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getModelField() missing required `fieldZUID` argument");
  }
})