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

const TEST_CSS = fs
  .readFileSync(`./test/fixtures/stylesheet.css`)
  .toString();
const TEST_GOOD_LESS = fs
  .readFileSync(`./test/fixtures/stylesheet.less`)
  .toString();
const TEST_BAD_LESS = fs
  .readFileSync(`./test/fixtures/stylesheet-bad.less`)
  .toString();
const TEST_GOOD_SASS = fs
  .readFileSync(`./test/fixtures/stylesheet.sass`)
  .toString();
const TEST_BAD_SASS = fs
  .readFileSync(`./test/fixtures/stylesheet-bad.sass`)
  .toString();
const TEST_GOOD_SCSS = fs
  .readFileSync(`./test/fixtures/stylesheet.scss`)
  .toString();
const TEST_BAD_SCSS = fs
  .readFileSync(`./test/fixtures/stylesheet-bad.scss`)
  .toString();


test.before(authContext);

// 
// STYLESHEETS
// 

// 
// STYLESHEET PAYLOAD VALIDATION
// 

// test stylesheet payload validation
// validates payload for the following:
// - missing code
// - missing filename
// - missing type
// - invalid / unsupported type

test.serial("validation", async t => {
  const code = await t.throwsAsync(
    t.context.sdk.instance.createStylesheet({})
  );
  t.is(
    code.message, 
    "Your provide payload is missing a required `code` property. This should be stylesheet code."
  );

  const filename = await t.throwsAsync(
    t.context.sdk.instance.createStylesheet({
      code: TEST_CSS,
    })
  );
  t.is(
    filename.message, 
    "Your provide payload is missing a required `filename` property. This is the filename this code should belong to."
  );

  const missingType = await t.throwsAsync(
    t.context.sdk.instance.createStylesheet({
      code: TEST_CSS,
      filename: `test-${moment().valueOf()}.css`
    })
  );
  t.is(
    missingType.message, 
    'Your provide payload is missing a required `type` property. This is the value to represent the files http `Content-Type`. e.g. "text/css", "text/less"'
  );

  const badFileType = "BAD_TYPE";

  const badType = await t.throwsAsync(
    t.context.sdk.instance.createStylesheet({
      code: TEST_CSS,
      filename: `test-${moment().valueOf()}.css`,
      type: badFileType
    })
  );

  const supportedTypes = [
    "text/css",
    "text/less",
    "text/scss",
    "text/sass"
  ];
  t.is(badType.message, 
    `The provided \`type\` (${
      badFileType
    }) property is not supported. Allowed types are ${supportedTypes.join(
      ", "
    )}`
  );
});

// 
// STYLESHEETS GET
// 

// test successful stylesheets retrieval
test.serial("fetchStylesheets:200", async t => {
  const res = await t.context.sdk.instance.getStylesheets();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// STYLESHEET GET
// 

// test successful stylesheet retrieval
test.serial("fetchStylesheet:200", async t => {
  const res = await t.context.sdk.instance.getStylesheet(TEST_CSS_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_CSS_ZUID);
});

// test failed stylesheet retrieval with a bad stylesheet ZUID

// 
// STYLESHEET UPDATE 
// 

// test successful stylesheet update
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


// 
// STYLESHEET CREATE
// 

// test successful CSS stylesheet creation
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

// test successful LESS stylesheet creation
test.serial("createStylesheet:201 create LESS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_GOOD_LESS,
    filename: `test-${moment().valueOf()}.less`,
    type: "text/less"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

// TODO less error responses
test.skip("createStylesheet:400 create bad LESS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_BAD_LESS,
    filename: `test-${moment().valueOf()}.less`,
    type: "text/less"
  });

  t.is(res.statusCode, 400);

});

// test successful SASS stylesheet creation
test.serial("createStylesheet:201 create SASS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_GOOD_SASS,
    filename: `test-${moment().valueOf()}.sass`,
    type: "text/sass"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

// test failed SASS stylesheet creation
test.skip("createStylesheet:400 bad SASS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_BAD_SASS,
    filename: `test-${moment().valueOf()}.sass`,
    type: "text/sass"
  });

  t.is(res.statusCode, 400);
});

// test successful SCSS stylesheet creation
test.serial("createStylesheet:201 create SCSS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_GOOD_SCSS,
    filename: `test-${moment().valueOf()}.scss`,
    type: "text/scss"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

// test failed SCSS stylesheet creation
test.skip("createStylesheet:400 bad SCSS file", async t => {
  const res = await t.context.sdk.instance.createStylesheet({
    code: TEST_BAD_SCSS,
    filename: `test-${moment().valueOf()}.scss`,
    type: "text/scss"
  });

  t.is(res.statusCode, 400);
  // t.is(res.data.version, 1); // Newly created resource should have a version of 1
  // t.truthy(res.data.ZUID);
});


// 
// STYLESHEET DELETE
// 

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

// 
// STYLESHEET PUBLISH
// 

// test successful stylesheet publishing
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
// current API functions do not support cache purge

// TODO fetch version



