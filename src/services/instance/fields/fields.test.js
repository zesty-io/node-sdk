require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

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
test("createField:201", async(t) => {
  const name = `node-sdk_createItem_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createField(
    process.env.TEST_MODEL_ZUID,
    {
      contentModelZUID :  process.env.TEST_MODEL_ZUID,
      datatype : "text",
      label: name,
      name: name,
      settings: {
        list : true
      }
    }
  )
  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
})