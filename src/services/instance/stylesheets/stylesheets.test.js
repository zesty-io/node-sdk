require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const {
  TEST_CSS_ZUID,
  TEST_GOOD_LESS_ZUID,
  TEST_BAD_LESS_ZUID,
  TEST_GOOD_SCSS_ZUID,
  TEST_BAD_SCSS_ZUID,
  TEST_GOOD_SASS_ZUID,
  TEST_BAD_SASS_ZUID
} = process.env;

const TEST_CSS = fs.readFileSync(`./test/fixtures/stylesheet.css`).toString();
// const TEST_GOOD_LESS = fs
//   .readFileSync(`./test/fixtures/stylesheet.less`)
//   .toString();
// const TEST_BAD_LESS = fs
//   .readFileSync(`./test/fixtures/stylesheet-bad.less`)
//   .toString();

test.before(authContext);

// validateStylesheet payload with no code
test.serial("validateStylesheet payload with no code", async t => {
  const payload = {};
  try {
    const res = await t.context.sdk.instance.validateStylesheet(
      payload
    )
  } catch (err) {
    t.is(err.message, "Your provide payload is missing a required `code` property. This should be stylesheet code.");
  }
});

// validateStylesheet payload with no filename
test.serial("validateStylesheet payload with no filename", async t => {
  const payload = {
    code: TEST_CSS,
  };

  try {
    const res = await t.context.sdk.instance.validateStylesheet(
      payload
    )
  } catch (err) {
    t.is(err.message, "Your provide payload is missing a required `filename` property. This is the filename this code should belong to.");
  }
});

// validateStylesheet payload with no type
test.serial("validateStylesheet payload with no type", async t => {
  const payload = {
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`
  };

  try {
    const res = await t.context.sdk.instance.validateStylesheet(
      payload
    )
  } catch (err) {
    t.is(err.message, 'Your provide payload is missing a required `type` property. This is the value to represent the files http `Content-Type`. e.g. "text/css", "text/less"');
  }
});

// validateStylesheet payload with unsupported type
test.serial("validateStylesheet payload with unsupported type", async t => {
  const supportedTypes = [
    "text/css",
    "text/less",
    "text/scss",
    "text/sass"
  ];
  
  const payload = {
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`,
    type: "BAD_TYPE"
  };

  try {
    const res = await t.context.sdk.instance.validateStylesheet(
      payload
    )
  } catch (err) {
    t.is(err.message, 
      `The provided \`type\` (${
        payload.type
      }) property is not supported. Allowed types are ${supportedTypes.join(
        ", "
      )}`
    );
  }
});

test.serial("fetchStylesheets:200", async t => {
  const res = await t.context.sdk.instance.getStylesheets();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("fetchStylesheet:200", async t => {
  const res = await t.context.sdk.instance.getStylesheet(TEST_CSS_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_CSS_ZUID);
});

test.serial("updateStylesheet:200", async t => {
  const res = await t.context.sdk.instance.updateStylesheet(TEST_CSS_ZUID, {
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`,
    type: "text/css"
  });

  t.is(res.statusCode, 200);
  t.is(res._meta.totalResults, 1); // Should have only effected one resource
  t.truthy(res.data.ZUID);
});

test.serial("createStylesheet:201", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`,
    type: "text/css"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

// Ran serially to avoid non-unique filenames.
// Using millisecond unix timestamps. Running tests async it seem like it may need nanosecond percision.
test.serial("deleteStylesheet:200", async t => {
  const stylesheet = await t.context.sdk.instance.createStylesheet({
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`,
    type: "text/css"
  });

  t.truthy(stylesheet.data.ZUID);

  const res = await t.context.sdk.instance.deleteStylesheet(
    stylesheet.data.ZUID
  );

  t.is(res.statusCode, 200);
  t.is(res._meta.totalResults, 1); // Deletion should result in 1
});

// FIXME API returns 500 when missing CDN service ID
test.serial("publishStylesheet:200", async t => {
  const sheet = await t.context.sdk.instance.getStylesheet(TEST_CSS_ZUID);

  t.is(sheet.statusCode, 200);
  t.is(sheet.data.ZUID, TEST_CSS_ZUID);

  const res = await t.context.sdk.instance.publishStylesheet(
    TEST_CSS_ZUID,
    sheet.data.version
  );

  t.is(res.statusCode, 200);
});

// TODO trigger cache purge

// TODO less file creation
// TODO less error responses
// TODO scss/sass file creation
// TODO scss/sass error responses

// TODO fetch version
