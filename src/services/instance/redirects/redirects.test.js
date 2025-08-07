require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");
const moment = require("moment");

test.before(authContext);

// Redirects

test("fetchRedirects:200", async t => {
  const res = await t.context.sdk.instance.fetchRedirects();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchRedirect:200", async t => {
  const res = await t.context.sdk.instance.fetchRedirect(
    process.env.TEST_REDIRECT_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("createRedirect:201", async(t) => {
  const name = `node_sdk_createRedirect_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createRedirect(
    {
      path: `/test/path/${name}`,
      targetType: "path",
      target: `/test/path/${name}`,
      code: 301
    }
  )

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  const newRedirectZUID = res.data.ZUID;
  
  res = await t.context.sdk.instance.deleteRedirect(
    newRedirectZUID
  );

  t.is(res.statusCode, 200);
});

test("updateRedirect:200", async(t) => {
  const name = `node-sdk_updateRedirect_${moment().valueOf()}`;
  const res = await t.context.sdk.instance.updateRedirect(
    process.env.TEST_REDIRECT_ZUID,
    {
      path: `/test/path/${name}`,
      targetType: "path",
      target: `/test/path/${name}`,
      code: 301
    }    
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("patchRedirect:200", async(t) => {
    const name = `node-sdk_patchRedirect_${moment().valueOf()}`;
    const res = await t.context.sdk.instance.patchRedirect(
      process.env.TEST_REDIRECT_ZUID,
      {
        path: `/test/path/${name}`,
        target: `/test/path/${name}`,
      }
    )
    t.is(res.statusCode, 200);
    t.truthy(res.data.ZUID);
});

test("deleteRedirect:200", async(t) => {
    const name = `node-sdk_createRedirect_${moment().valueOf()}`;
    let res = await t.context.sdk.instance.createRedirect(
      {
        path: `/test/path/${name}`,
        targetType: "path",
        target: `/test/path/${name}`,
        code: 301
      }    
    )

    t.is(res.statusCode, 201);
    t.truthy(res.data.ZUID);

    const newRedirectZUID = res.data.ZUID;
  
    res = await t.context.sdk.instance.deleteRedirect(
      newRedirectZUID
    );
  
    t.is(res.statusCode, 200);
});