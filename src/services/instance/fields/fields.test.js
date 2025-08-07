require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.before(authContext);

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

test.skip("createField:201", async(t) => {
  const name = `node-sdk_createItem_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createField(
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
});

// skip this test to stop for overpopulating the database by adding more columns without deleting them
test.serial("updateField:200", async(t) => {
  const name = `node-sdk_updateItem_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.updateModelField(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_FIELD_ZUID,
    {
      name: name,
      settings: {
        list : true
      }
    }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test.serial("patchField:200", async(t) => {
  const name = `node-sdk_patchItem_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.patchModelField(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_FIELD_ZUID,
    {
      name: name,
    }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

// Field deletion is only a soft-delete so need to skip this test to stop overpopulating the database by adding more columns without actually deleting them
test.skip("deleteField:200", async(t) => {
  const name = `node-sdk_createItem_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createField(
    process.env.TEST_MODEL_ZUID,
    {
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

  const newFieldZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteModelField(
    process.env.TEST_MODEL_ZUID,
    newFieldZUID
  );

  t.is(res.statusCode, 200);
});