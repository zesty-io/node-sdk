require("dotenv").config();

const test = require("ava");

const Auth = require("./auth");
const Media = require("./media");

const BIN_ZUID = "1-76a04cf-dgpem";

test.beforeEach(async t => {
  const auth = new Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.context.media = new Media(process.env.ZESTY_INSTANCE_ZUID, session.token);
});

test("getBins:200", async t => {
  const res = await t.context.media.getBins();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("getBin:200", async t => {
  const res = await t.context.media.getBin(BIN_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].id, BIN_ZUID);
});
