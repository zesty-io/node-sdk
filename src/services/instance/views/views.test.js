require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const { TEST_VIEW_ZUID } = process.env;
// const TEST_VIEW = fs.readFileSync(`./test/fixtures/view.txt`).toString();

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
