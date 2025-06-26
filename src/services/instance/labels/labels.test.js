require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.before(authContext);

let labelZuid;

// Labels
test.serial("fetchLabels:200", async t => {
  const res = await t.context.sdk.instance.fetchLabels();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("fetchLabel:200", async t => {
  const res = await t.context.sdk.instance.fetchLabel(
    process.env.TEST_LABEL_ZUID
  );
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, process.env.TEST_LABEL_ZUID);
});

test.serial("createLabel:201", async(t) => {
  const description = `node-sdk_createLabel_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createLabel(
    {
      name: "Test Label",
      description,
      color: "#000",
      allowPublish: true,
    }
  )

  labelZuid = res.data.ZUID;
  t.is(res.statusCode, 201);
  t.truthy(labelZuid);
});

test.serial("updateLabel:200", async(t) => {
  const description = `node-sdk_updateLabel_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.updateLabel(
    labelZuid,
    {
      name: "Test Label Updated",
      description,
      color: "#000",
      allowPublish: true,
    }
  )
  t.is(res.statusCode, 200);
});

test("deleteLabel:200", async(t) => { 
    const res = await t.context.sdk.instance.deleteLabel(
      labelZuid
    );
  
    t.is(res.statusCode, 200);
});