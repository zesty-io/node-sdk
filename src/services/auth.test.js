"use strict";

require("dotenv").config();

const test = require("ava");
const Auth = require("./auth");
const auth = new Auth({
  authURL: process.env.ZESTY_AUTH_API
});
const badAuth = new Auth({
  authURL: "http://localhost:9999"
});

// NOTE: We explicitly do not catch promise rejections,
// instead we let them throw failing the test. Ava will
// print the uncaught error to the console

test("login:200", async t => {
  const res = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.is(res.statusCode, 200);
  t.not("", res.token);
});

// Causes account lock breaking tests
test.skip("login:400", async t => {
  const missingEmail = await auth.login(null, null);
  t.is(missingEmail.statusCode, 400);
  t.is(missingEmail.message, "Auth:login() missing required argument `email`");

  const missingPass = await auth.login("test", null);
  t.is(missingPass.statusCode, 400);
  t.is(
    missingPass.message,
    "Auth:login() missing required argument `password`"
  );
});
test("login:401", async t => {
  const res = await auth.login("BAD@USERNAME", "BAD PASSWORD");
  t.is(res.statusCode, 401);
});
test("login:error", async t => {
  try {
    const res = await badAuth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    );
    t.fail();
  } catch (err) {
    t.is(err.message, "connect ECONNREFUSED 127.0.0.1:9999");
  }
});

test("verifyToken:200", async t => {
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );
  const res = await auth.verifyToken(session.token);

  t.is(res.statusCode, 200);
  t.is(res.verified, true);
});
test("verifyToken:401", async t => {
  const res = await auth.verifyToken("BADTOKEN");

  t.is(res.statusCode, 401);
  t.is(res.verified, false);
});
test("verifyToken:missing token", async t => {
  const res = await auth.verifyToken();
  t.is(res.verified, false);
});
test("verifyToken:error", async t => {
  try {
    const res = await badAuth.verifyToken("BADTOKEN");
    t.fail();
  } catch (err) {
    t.is(err.message, "connect ECONNREFUSED 127.0.0.1:9999");
  }
});
