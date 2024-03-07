require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.beforeEach(authContext);

// Links
test("fetchLink:200", async t => {
  const res = await t.context.sdk.instance.fetchLink(
    process.env.TEST_LINK_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchLinks:200", async t => {
    const res = await t.context.sdk.instance.fetchLinks();
    t.is(res.statusCode, 200);
    t.truthy(Array.isArray(res.data));
    t.truthy(res.data.length > 0);
  });

test("createLink:201", async(t) => {
  const name = `node-sdk_createLink_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createLink(
    // {
    //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
    //   datatype : "text",
    //   label: name,
    //   name: name,
    //   settings: {
    //     list : true
    //   }
    // }
  )
  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("updateLink:200", async(t) => {
  const name = `node-sdk_updateLink_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.updateLink(
    process.env.TEST_LINK_ZUID,
    // {
    //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
    //   datatype : "text",
    //   label: name,
    //   name: name,
    //   settings: {
    //     list : true
    //   }
    // }
  )
  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("patchLink:200", async(t) => {
    const name = `node-sdk_patchLink_${moment().valueOf()}`;
    let res = await t.context.sdk.instance.patchLink(
      process.env.TEST_LINK_ZUID,
      // {
      //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
      //   datatype : "text",
      //   label: name,
      //   name: name,
      //   settings: {
      //     list : true
      //   }
      // }
    )
    t.is(res.statusCode, 201);
    t.truthy(res.data.ZUID);
});

test("deleteLink:200", async(t) => {
    const name = `node-sdk_createLink_${moment().valueOf()}`;
    const res = await t.context.sdk.instance.createLink(
      // {
      //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
      //   datatype : "text",
      //   label: name,
      //   name: name,
      //   settings: {
      //     list : true
      //   }
      // }
    )
    t.is(res.statusCode, 201);
    t.truthy(res.data.ZUID);
  
    res = await t.context.sdk.instance.deleteLink(
      item.data.ZUID
    );
  
    t.is(res.statusCode, 200);
});