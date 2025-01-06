require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.before(authContext);

test.serial("fetchLangs:200", async t => {
  const res = await t.context.sdk.instance.fetchLangs();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length);
});

test.serial("createLang:200", async t => {
  const res = await t.context.sdk.instance.createLang({
    code : process.env.TEST_LANG_CODE
  })

  t.is(res.statusCode, 200);
});

test.serial("updateLang:200", async t => {
  const res = await t.context.sdk.instance.updateLang(
    process.env.TEST_LANG_CODE,
    "activate"
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
});

test.serial("deleteLang:200", async t => {
  const res = await t.context.sdk.instance.deleteLang(
    process.env.TEST_LANG_CODE,
    "false"
  )

  t.is(res.statusCode, 200);
});