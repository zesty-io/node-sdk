require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

// 
// FIELDS
// 

// 
// FIELDS GET
// 

// test successful fields retrieval
test.serial("fetchModelFields:200", async t => {
  const res = await t.context.sdk.instance.getModelFields(
    process.env.TEST_MODEL_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

//  tests model fields retrieval with no model ZUID
test.serial("fetchModelFields: requires model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getModelFields()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getModelFields() missing required `modelZUID` argument"
  );
})

// 
// FIELD GET
// 

// test successful field retrieval
test.serial("fetchModelField:200", async t => {
  const res = await t.context.sdk.instance.getModelField(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_FIELD_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_FIELD_ZUID);
  t.is(res.data.contentModelZUID, process.env.TEST_MODEL_ZUID);
});

//  tests single model field retrieval without specificying a model ZUID
test.serial("fetchModelField: requires model ZUID", async t => {
  const noModel = await t.throwsAsync(
    t.context.sdk.instance.getModelField()
  ); 
  t.is(
    noModel.message,
    "SDK:Instance:getModelField() missing required `modelZUID` argument"
  );
});

//  tests single model field retrieval without specificying a field ZUID
test.serial("fetchModelField: requires field ZUID", async t => {
  const noFieldZUID = await t.throwsAsync(
    t.context.sdk.instance.getModelField(
      process.env.TEST_MODEL_ZUID,
    )
  );
  t.is(
    noFieldZUID.message,
    "SDK:Instance:getModelField() missing required `fieldZUID` argument"
  );
})