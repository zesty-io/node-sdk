"use strict";

require("dotenv").config();

const test = require("ava");
const SDK = require("./sdk");

async function getToken() {
  const auth = new SDK.Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  return session.token;
}

test("requires token", (t) => {
  try {
    new SDK(process.env.ZESTY_INSTANCE_ZUID);
  } catch (err) {
    t.is(err.message, "SDK:constructor() missing required `token` parameter");
  }
});

test("authenticated", async (t) => {
  const token = await getToken();
  const sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID, token);
  const res = await sdk.instance.getModels();
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("init with options", async (t) => {
  const opts = {
    accountsAPIURL: "https://accounts.api.dev.zesty.io/v1/",
    authURL: "https://auth.api.dev.zesty.io/v1/",
    instancesAPIURL: "https://INSTANCE_ZUID.api.dev.zesty.io/v1",
    mediaAPIURL: "https://svc.dev.zesty.io",
  };
  const token = await getToken();
  const sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID, token, opts);

  t.is(sdk.auth.authURL, opts.authURL);
  t.is(sdk.account.baseAPI, opts.accountsAPIURL);
  t.is(sdk.instance.baseAPI, opts.instancesAPIURL);
  t.is(sdk.media.baseAPI, opts.mediaAPIURL);
});
