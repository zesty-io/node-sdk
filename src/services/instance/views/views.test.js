require("dotenv").config();

const https = require("https");
const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const { TEST_VIEW_ZUID, TEST_PREVIEW } = process.env;
const TEST_VIEW = fs.readFileSync(`./test/fixtures/view.html`).toString();

const authContext = require("../../../../test/helpers/auth-context");
test.before(authContext);

// 
// VIEWS
// 

//  test view payload validation
//  validates payload for the following:
//  - missing code 
//  - missing filename
//  - missing type
//  - invalid type
test.serial("validation", async t => {
  const code = await t.throwsAsync(
    t.context.sdk.instance.createView({
      filename: `test-${moment().valueOf()}.html`,
      type: "ajax-html"
    })
  );
  t.is(
    code.message,
    "Your provide payload is missing a required `code` property. This should be view code."
  );

  const filename = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      type: "ajax-html"
    })
  );
  t.is(
    filename.message,
    "Your provide payload is missing a required `filename` property. This is the filename this code should belong to."
  );

  const type = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      filename: `test-${moment().valueOf()}.html`
    })
  );
  t.is(
    type.message,
    "Your provide payload is missing a required `type` property. This determines the type of view it is. Allowed types are snippet, ajax-json, ajax-html, 404"
  );

  const invalidType = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      filename: `test-${moment().valueOf()}.html`,
      type: "invalid-type"
    })
  );
  t.is(
    invalidType.message,
    "The provided `type` (invalid-type) property is not supported. Allowed types are snippet, ajax-json, ajax-html, 404"
  );
});

// 
// VIEWS GET
// 

// test successful views retrieval
test.serial("fetchViews:200", async t => {
  const res = await t.context.sdk.instance.getViews();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// 
// VIEW GET
// 

// test successful view retrieval
test.serial("fetchView:200", async t => {
  const res = await t.context.sdk.instance.getView(TEST_VIEW_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_VIEW_ZUID);
});

// test failed view retrieval with a bad view ZUID
test.serial("fetchView with bad view ZUID", async t => {
  const res = await t.context.sdk.instance.getView("BAD_VIEW_ZUID");
  t.is(res.statusCode, 400);
});

// 
// VIEW CREATE
// 

// test successful view creation
test.serial("createView:201", async t => {
  const res = await t.context.sdk.instance.createView({
    code: TEST_VIEW,
    filename: `test-${moment().valueOf()}.html`,
    type: "ajax-html"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

// 
// VIEW UPDATE
// 

// test successful view update and retrieval
// here we are testing the succesful retrieval of a 404 view
test.cb("updateView:200", t => {
  const now = moment().valueOf();
  t.context.sdk.instance
    .updateView(TEST_VIEW_ZUID, {
      code: `<h1>404 Page Not Found</h1><p>${now}</p>`
    })
    .then(res => {
      t.is(res.statusCode, 200);
      t.truthy(res.data.ZUID);

      // this was changed to https because the preview site enforces HTTPS-only
      https
        .get(`${TEST_PREVIEW}/this-page-does-not-exist`, res => {
          t.is(res.statusCode, 404); // This is the 404 page we are request as such should expect a 404 response

          res.setEncoding("utf8");

          let rawData = "";
          res.on("data", chunk => {
            rawData += chunk;
          });

          res.on("end", () => {
            try {
              t.truthy(rawData.includes(now));
              t.end();
            } catch (err) {
              t.fail(err);
            }
          });
        })
        .on("error", err => {
          t.fail(err);
        });
    });
});

// 
// VIEW PUBLISH
// 

// test successful view publishing
test.serial("publishView:200", async t => {
  const view = await t.context.sdk.instance.getView(TEST_VIEW_ZUID);

  t.is(view.statusCode, 200);
  t.is(view.data.ZUID, TEST_VIEW_ZUID);

  const res = await t.context.sdk.instance.publishView(
    TEST_VIEW_ZUID,
    view.data.version
  );

  t.is(res.statusCode, 200);
});
