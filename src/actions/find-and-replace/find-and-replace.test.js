"use strict";

require("dotenv").config();

const test = require("ava");

const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

test("findAndReplace > require all function parameters", async t => {
  await t.throwsAsync(
    t.context.sdk.action.findAndReplace,
    "All function parameters are required. findAndReplace(zuid, fieldName, substr, newSubstr"
  );
});

test("findAndReplace > only item and models allowed", async t => {
  const result = t.context.sdk.action.findAndReplace(
    "8-8ca8dccef4-4w7r5w",
    "content",
    "TOKEN",
    "REPLACED"
  );

  await t.throwsAsync(
    result,
    "Find and replace actions are only allowed on content items and models. Unsupported zuid 8-8ca8dccef4-4w7r5w provided."
  );
});

test("findAndReplace > on model items", async t => {
  try {
    const result = await t.context.sdk.action.findAndReplace(
      "6-8ca8dccef4-4w7r5w",
      "content",
      "REPLACED $ CHAR PHRASE",
      "REPLACED"
    );

    // At least one item is updated
    t.truthy(result.length > 0);

    // All update requests returned success response
    const successCount = result.filter(res => res.statusCode === 200);
    t.is(result.length, successCount.length);
  } catch (error) {
    console.log(error);
    t.fail();
  }
});
