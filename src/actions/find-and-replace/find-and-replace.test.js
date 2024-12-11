"use strict";

require("dotenv").config();

const test = require("ava");
const authContext = require("../../../test/helpers/auth-context");
test.before(authContext);

// const { TEST_MODEL_ZUID } = process.env;
const MODEL_ZUID = "6-a8bae2f4d7-rffln5";
const FIELD_NAME = "content";
const PATTERN = "TOKEN";
const REPLACEMENT = "REPLACED";
const INVALID_ZUID = "8-8ca8dccef4-4w7r5w";

test("findAndReplace > require all function parameters", async (t) => {
  await t.throwsAsync(
    t.context.sdk.action.findAndReplace,
    undefined,
    "All function parameters are required. findAndReplace(zuid, fieldName, substr, newSubstr"
  );
});

test("findAndReplace > only item and models allowed", async (t) => {
  const result = t.context.sdk.action.findAndReplace(
    INVALID_ZUID,
    FIELD_NAME,
    PATTERN,
    REPLACEMENT
  );

  await t.throwsAsync(
    result,
    undefined,
    `Find and replace actions are only allowed on content items and models. Unsupported zuid ${INVALID_ZUID} provided.`
  );
});

test.skip("findAndReplace > on model items", async (t) => {
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
