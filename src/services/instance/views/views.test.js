require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const { TEST_VIEW_ZUID } = process.env;
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
    filename: `test-${moment().valueOf()}.css`,
    type: "ajax-html"
  });

  t.is(res.statusCode, 201);
  t.is(res.data.version, 1); // Newly created resource should have a version of 1
  t.truthy(res.data.ZUID);
});
