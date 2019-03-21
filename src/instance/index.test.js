"use strict";

require("dotenv").config();

const test = require("ava");

const Auth = require("../auth");
const Instance = require("./index.js");

async function authedInstance() {
  const auth = new Auth();
  const token = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );
  return new Instance(process.env.ZESTY_INSTANCE_ZUID, token, {
    instancesAPIURL: `http://${
      process.env.ZESTY_INSTANCE_ZUID
    }.api.zesty.localdev:3023/v1`
  });
}

test("Instance:fetchModels", async t => {
  try {
    const instance = await authedInstance();
    const models = await instance.getModels();

    console.log(models);

    t.pass();
  } catch (err) {
    console.log(err);
    t.fail();
  }
});
