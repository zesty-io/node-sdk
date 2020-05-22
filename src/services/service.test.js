"use strict";

require("dotenv").config();

const test = require("ava");

const Models = require("./instance/models")
const Service = require("./service")

//  test service constructor without specifying API URL
test("constructor():missing API URL", async t => {
  try {
    new Service();
  } catch (err) {
    t.is(err.message, "SDK:Service:constructor() missing required `baseAPI` argument on instantiation");  
  }
});

//  test service constructor without specifying token
test("constructor():missing token", async t => {
  try {
    new Service(process.env.ZESTY_INSTANCE_API);
  } catch (err) {
    t.is(err.message, "SDK:Service:constructor() missing required `token` argument on instantiation. All API requests have to be authenticated");  
  }
});

//  test sending a request from the service
test("getRequest:200", async t => {
  const instanceService = new Service(process.env.ZESTY_INSTANCE_API, process.env.ZESTY_TOKEN);

  const res = await instanceService.getRequest(
    instanceService.interpolate(
      Models.API.fetchModels  
    )
  )
  t.is(res.statusCode, 200)
});
