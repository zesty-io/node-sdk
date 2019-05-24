require("dotenv").config();

const test = require("ava");

const Auth = require("../auth");
const Account = require("./account");

test.beforeEach(async t => {
  const auth = new Auth();
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.context.account = new Account(
    process.env.ZESTY_INSTANCE_ZUID,
    session.token
  );
});

test("getInstance:200", async t => {
  const res = await t.context.account.getInstance();
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.ZESTY_INSTANCE_ZUID);
});

test("getInstanceUsers:200", async t => {
  const res = await t.context.account.getInstanceUsers();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
