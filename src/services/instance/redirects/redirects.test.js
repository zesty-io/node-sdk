require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.beforeEach(authContext);

// Redirects
test("fetchRedirect:200", async t => {
  const res = await t.context.sdk.instance.fetchRedirect(
    process.env.TEST_REDIRECT_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("fetchRedirects:200", async t => {
    const res = await t.context.sdk.instance.fetchRedirects();
    t.log(res.data);
    t.is(res.statusCode, 200);
    t.truthy(Array.isArray(res.data));
    t.truthy(res.data.length > 0);
  });

test("createRedirect:201", async(t) => {
  const name = `node-sdk_createRedirect_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createRedirect(
    {
      path: "/test/path",
      targetType: "path",
      target: "/another/test/path",
      code: 301
    }
  )
  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

// test("updateRedirect:200", async(t) => {
//   const name = `node-sdk_updateRedirect_${moment().valueOf()}`;
//   let res = await t.context.sdk.instance.updateRedirect(
//     process.env.TEST_REDIRECT_ZUID,
//     // {
//     //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
//     //   datatype : "text",
//     //   label: name,
//     //   name: name,
//     //   settings: {
//     //     list : true
//     //   }
//     // }
//   )
//   t.is(res.statusCode, 201);
//   t.truthy(res.data.ZUID);
// });

// test("patchRedirect:200", async(t) => {
//     const name = `node-sdk_patchRedirect_${moment().valueOf()}`;
//     let res = await t.context.sdk.instance.patchRedirect(
//       process.env.TEST_REDIRECT_ZUID,
//       // {
//       //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
//       //   datatype : "text",
//       //   label: name,
//       //   name: name,
//       //   settings: {
//       //     list : true
//       //   }
//       // }
//     )
//     t.is(res.statusCode, 201);
//     t.truthy(res.data.ZUID);
// });

// test("deleteRedirect:200", async(t) => {
//     const name = `node-sdk_createRedirect_${moment().valueOf()}`;
//     const res = await t.context.sdk.instance.createRedirect(
//       // {
//       //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
//       //   datatype : "text",
//       //   label: name,
//       //   name: name,
//       //   settings: {
//       //     list : true
//       //   }
//       // }
//     )
//     t.is(res.statusCode, 201);
//     t.truthy(res.data.ZUID);
  
//     res = await t.context.sdk.instance.deleteRedirect(
//       res.data.ZUID
//     );
  
//     t.is(res.statusCode, 200);
// });