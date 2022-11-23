require("dotenv").config();

const https = require("https");
const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const { TEST_VIEW_ZUID, TEST_PREVIEW } = process.env;
const TEST_VIEW = fs.readFileSync(`./test/fixtures/view.html`).toString();

const authContext = require("../../../../test/helpers/auth-context");
const { resolve } = require("path");
test.before(authContext);

test("validation", async (t) => {
  const code = await t.throwsAsync(
    t.context.sdk.instance.createView({
      filename: `test-${moment().valueOf()}.html`,
      type: "ajax-html",
    })
  );

  const filename = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      type: "ajax-html",
    })
  );

  const type = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      filename: `test-${moment().valueOf()}.html`,
    })
  );

  const invalidType = await t.throwsAsync(
    t.context.sdk.instance.createView({
      code: "test",
      filename: `test-${moment().valueOf()}.html`,
      type: "invalid-type",
    })
  );

  t.is(
    code.message,
    "Your provide payload is missing a required `code` property. This should be view code."
  );
  t.is(
    filename.message,
    "Your provide payload is missing a required `filename` property. This is the filename this code should belong to."
  );
  t.is(
    type.message,
    "Your provide payload is missing a required `type` property. This determines the type of view it is. Allowed types are snippet, ajax-json, ajax-html, 404"
  );
  t.is(
    invalidType.message,
    "The provided `type` (invalid-type) property is not supported. Allowed types are snippet, ajax-json, ajax-html, 404"
  );
});

test("fetchViews:200", async (t) => {
  const res = await t.context.sdk.instance.getViews();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchView:200", async (t) => {
  const res = await t.context.sdk.instance.getView(TEST_VIEW_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_VIEW_ZUID);
});

test("createView:201", async (t) => {
  const res = await t.context.sdk.instance.createView({
    code: TEST_VIEW,
    filename: `test-${moment().valueOf()}.html`,
    type: "ajax-html",
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

test("updateView:200", (t) => {
  const now = moment().valueOf();

  return t.context.sdk.instance
    .updateView(TEST_VIEW_ZUID, {
      code: `<h1>404 Page Not Found</h1><p>${now}</p>`,
    })
    .then((res) => {
      t.is(res.statusCode, 200);
      t.truthy(res.data.ZUID);

      return new Promise((resolve, reject) => {
        https
          .get(`https://${TEST_PREVIEW}/this-page-does-not-exist`, (res) => {
            t.is(res.statusCode, 404); // This is the 404 page we are request as such should expect a 404 response

            res.setEncoding("utf8");

            let rawData = "";
            res.on("data", (chunk) => {
              rawData += chunk;
            });

            res.on("end", () => {
              try {
                resolve(t.truthy(rawData.includes(now)));
              } catch (err) {
                reject(err);
              }
            });
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    });
});

// FIXME API returns 500 when missing CDN service ID
test("publishView:200", async (t) => {
  const view = await t.context.sdk.instance.getView(TEST_VIEW_ZUID);

  t.is(view.statusCode, 200);
  t.is(view.data.ZUID, TEST_VIEW_ZUID);

  const res = await t.context.sdk.instance.publishView(
    TEST_VIEW_ZUID,
    view.data.version
  );

  t.is(res.statusCode, 200);
});
