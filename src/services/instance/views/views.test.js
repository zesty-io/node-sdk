require("dotenv").config();

const http = require("http");
const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const { TEST_VIEW_ZUID, TEST_PREVIEW } = process.env;
const TEST_VIEW = fs.readFileSync(`./test/fixtures/view.html`).toString();

test.before(authContext);

test("fetchViews:200", async t => {
  const res = await t.context.instance.getViews();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchView:200", async t => {
  const res = await t.context.instance.getView(TEST_VIEW_ZUID);
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_VIEW_ZUID);
});

test("createView:201", async t => {
  const res = await t.context.instance.createView({
    code: TEST_VIEW,
    filename: `test-${moment().valueOf()}.html`,
    type: "ajax-html"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});

test.cb("updateView:200", t => {
  const now = moment().valueOf();

  t.context.instance
    .updateView(TEST_VIEW_ZUID, {
      code: `<h1>404 Page Not Found</h1><p>${now}</p>`
    })
    .then(res => {
      t.is(res.statusCode, 200);
      t.truthy(res.data.ZUID);

      http
        .get(`http://${TEST_PREVIEW}/this-page-does-not-exist`, res => {
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

// FIXME API returns 500 when missing CDN service ID
test("publishView:200", async t => {
  const view = await t.context.instance.getView(TEST_VIEW_ZUID);

  t.is(view.statusCode, 200);
  t.is(view.data.ZUID, TEST_VIEW_ZUID);

  const res = await t.context.instance.publishView(
    TEST_VIEW_ZUID,
    view.data.version
  );

  t.is(res.statusCode, 200);
});
