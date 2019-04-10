"use strict";

require("dotenv").config();

const test = require("ava");
const SDK = require("./sdk");

async function authedSDK() {
  const auth = new SDK.Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  return new SDK(process.env.ZESTY_INSTANCE_ZUID, session.token);
}

test("requires token", t => {
  try {
    const sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID);
  } catch (err) {
    t.is(err.message, "SDK:constructor() missing required `token` parameter");
  }
});

test("authenticated", async t => {
  const sdk = await authedSDK();
  const res = await sdk.instance.getModels();
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
