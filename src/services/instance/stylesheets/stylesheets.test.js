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

test("fetchStylesheets:200", async t => {
  const res = await t.context.sdk.instance.getStylesheets();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchStylesheet:200", async t => {
  const res = await t.context.sdk.instance.getStylesheet(TEST_CSS_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_CSS_ZUID);
});

test("updateStylesheet:200", async t => {
  const res = await t.context.sdk.instance.updateStylesheet(TEST_CSS_ZUID, {
    code: TEST_CSS,
    filename: `test-${moment().valueOf()}.css`,
    type: "text/css"
  });

  t.is(res.statusCode, 200);
  t.is(res._meta.totalResults, 1); // Should have only effected one resource
  t.truthy(res.data.ZUID);
});

test("createStylesheet:201", async t => {
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
test("publishStylesheet:200", async t => {
  const sheet = await t.context.sdk.instance.getStylesheet(TEST_CSS_ZUID);

  t.is(sheet.statusCode, 200);
  t.is(sheet.data.ZUID, TEST_CSS_ZUID);

  const res = await t.context.sdk.instance.publishStylesheet(
    TEST_CSS_ZUID,
    sheet.data.version
  );

  t.is(res.statusCode, 200);
});

test("createStylesheetVariable:201", async t => {
  const name = `node-sdk_createStylesheetVariable_${moment().valueOf()}`

  const res = await t.context.sdk.instance.createStylesheetVariable({
    referenceName: 'refName_' + name,
    name : name,
    value : "This is from test",
    type : "text",
    category: 1
  })

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
})

test("fetchStylesheetVariables:200", async t => {
  const res = await t.context.sdk.instance.fetchStylesheetVariables();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchStylesheetVariable:200", async t => {
  const res = await t.context.sdk.instance.fetchStylesheetVariable(
    process.env.TEST_VARIABLE_ZUID
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_VARIABLE_ZUID);
});

test("updateStylesheetVariable:200", async(t) => {
  const name = `node-sdk_updateStylesheetVariable_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.updateStylesheetVariable(
    process.env.TEST_VARIABLE_ZUID,
    // {
    //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
    //   datatype : "text",
    //   label: name,
    //   name: name,
    //   settings: {
    //     list : true
    //   }
    // }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("patchStylesheetVariable:200", async(t) => {
  const name = `node-sdk_patchStylesheetVariable_${moment().valueOf()}`;
  let res = await t.context.sdk.instance.patchStylesheetVariable(
    process.env.TEST_VARIABLE_ZUID,
    // {
    //   contentModelZUID :  process.env.TEST_MODEL_ZUID,
    //   datatype : "text",
    //   label: name,
    //   name: name,
    //   settings: {
    //     list : true
    //   }
    // }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("deleteStylesheetVariable:200", async(t) => {
  const name = `node-sdk_createStylesheetVariable_${moment().valueOf()}`

  let res = await t.context.sdk.instance.createStylesheetVariable({
    referenceName: 'refName_' + name,
    name : name,
    value : "This is from test",
    type : "text",
    category: 1
  })

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  const newStyleSheetVarialbleZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteStylesheetVariable(
    newStyleSheetVarialbleZUID
  );

  t.is(res.statusCode, 200);
});

// TODO trigger cache purge

// TODO less file creation
// TODO less error responses
// TODO scss/sass file creation
// TODO scss/sass error responses

// TODO fetch version
