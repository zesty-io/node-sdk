"use strict";

require("dotenv").config();

const test = require("ava");

const Auth = require("./services/auth");
const SDK = require("./sdk");

async function authedSDK() {
  const auth = new Auth();
  const token = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  return new SDK(process.env.ZESTY_INSTANCE_ZUID, token);
}

test("authenticated SDK request", async t => {
  try {
    const sdk = await authedSDK();
    const models = await sdk.instance.getModels();

    console.log(models.data.length);

    t.pass();
  } catch (err) {
    console.log(err);
    t.fail();
  }
});
