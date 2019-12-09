require("dotenv").config();

const test = require("ava");
const FormData = require("form-data");

const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

test("getBins:200", async t => {
  const res = await t.context.sdk.media.getBins();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("getBin:200", async t => {
  const res = await t.context.sdk.media.getBin(process.env.TEST_BIN_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].id, process.env.TEST_BIN_ZUID);
});

test.skip("updateBin:200", async t => {
  const payload = new FormData();
  payload.append("name", "test");

  const res = await t.context.sdk.media.updateBin(
    process.env.TEST_BIN_ZUID,
    payload
  );

  // console.log(res);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].id, process.env.TEST_BIN_ZUID);
  // t.is(res.data[0].name, "test");
});
