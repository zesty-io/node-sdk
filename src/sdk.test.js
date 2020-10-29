"use strict";

require("dotenv").config();

const test = require("ava");
const SDK = require("./sdk");

// 
// SDK
// 

async function authedSDK() {
  const auth = new SDK.Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  return new SDK(process.env.ZESTY_INSTANCE_ZUID, session.token);
}

// 
// SDK CONSTRUCTOR
// 

// test failed attempt to create an unauthenticated SDK context without using a token
test.serial("constructor():requires token", t => {
  try {
    new SDK(process.env.ZESTY_INSTANCE_ZUID);
  } catch (err) {
    t.is(err.message, "SDK:constructor() missing required `token` parameter");
  }
});

// test failed attempt to create an SDK context using an invalid token
test.serial("constructor():intialize with invalid token", async t => {
  try {
    const sdk = await authedSDK();
    const res = await sdk.init("BAD TOKEN")
  } catch (err) {
    t.is(err.statusCode, 401);
    t.is(err.status, "Unauthorized");
  }
});


// 
// SDK INIT
// 

// test successful SDK init
test.serial("init", async t => {
  const sdk = await authedSDK();
  const res = await sdk.init(sdk.token);

  t.truthy(sdk.action);
})
// 
// SDK AUTHENTICATION
// 

// test successful creation of an SDK context
test.serial("authenticated", async t => {
  const sdk = await authedSDK();
  const res = await sdk.instance.getModels();
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});