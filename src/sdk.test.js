"use strict";

require("dotenv").config();

const test = require("ava");
const SDK = require("./sdk");

async function authedSDK() {
  const sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID, null);
  await sdk.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  return sdk;
}

test("authenticated", async t => {
  const sdk = await authedSDK();
  const res = await sdk.instance.getModels();

  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
