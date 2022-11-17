"use strict";

require("dotenv").config();

const test = require("ava");
const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

const MODEL_ZUID = "6-a0f4b7b0f8-fcwk35";
const FIELD_NAME = "content";
const PATTERN = "TOKEN";
const REPLACEMENT = "REPLACED";

test("findAndReplace > require all function parameters", async (t) => {
  await t.throwsAsync(
    t.context.sdk.action.findAndReplace,
    undefined,
    "All function parameters are required. findAndReplace(zuid, fieldName, substr, newSubstr"
  );
});

test("findAndReplace > only item and models allowed", async (t) => {
  const result = t.context.sdk.action.findAndReplace(
    "8-8ca8dccef4-4w7r5w", // Invalid ZUID test
    FIELD_NAME,
    PATTERN,
    REPLACEMENT
  );

  await t.throwsAsync(
    result,
    undefined,
    "Find and replace actions are only allowed on content items and models. Unsupported zuid 8-8ca8dccef4-4w7r5w provided."
  );
});

test("findAndReplace > on model items", async (t) => {
  try {
    const result = await t.context.sdk.action.findAndReplace(
      MODEL_ZUID,
      FIELD_NAME,
      PATTERN,
      REPLACEMENT
    );

    // At least one item is updated
    t.truthy(result.length > 0);

    // All update requests returned success response
    const successCount = result.filter((res) => res.statusCode === 200);
    t.is(result.length, successCount.length);

    // Reset test content
    await t.context.sdk.action.findAndReplace(
      MODEL_ZUID,
      FIELD_NAME,
      REPLACEMENT,
      PATTERN
    );
  } catch (error) {
    console.log(error);
    t.fail();
  }
});
