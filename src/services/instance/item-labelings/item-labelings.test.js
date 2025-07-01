require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.before(authContext);

// Item Labelings
test.serial("fetchItemLabelings:200", async t => {
  const res = await t.context.sdk.instance.fetchItemLabelings(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("fetchItemLabeling:200", async t => {
  const res = await t.context.sdk.instance.fetchItemLabeling(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_ITEM_ZUID,
    process.env.TEST_ITEM_LABELING_ZUID
  );
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, process.env.TEST_ITEM_LABELING_ZUID);
});

test.serial("updateItemLabelings:200", async(t) => {
  const name = `node-sdk_createLabelForItemLabeling_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createLabel(
    {
      name,
      color: "#eee",
      allowPublish: true,
      addPermissionRoles: ["30-aab6d7c4ba-hwl7zx", "30-88d8fcdbba-bb52xw"],
      removePermissionRoles: ["30-aab6d7c4ba-hwl7zx", "30-88d8fcdbba-bb52xw"]
    }
  )

  const labelZuid = res.data.ZUID;

  res = await t.context.sdk.instance.updateItemLabelings(
    process.env.TEST_MODEL_ZUID,
    process.env.TEST_ITEM_ZUID,
    process.env.TEST_ITEM_LABELING_ZUID,
    {
      labelZUIDs: [labelZuid],
    }
  )

  t.is(res.statusCode, 200);

  // clean up created label to allow item publishing
  res = await t.context.sdk.instance.deleteLabel(
    labelZuid
  );

  t.is(res.statusCode, 200);
});