"use strict";

require("dotenv").config();

const test = require("ava");
const Auth = require("./auth");
const auth = new Auth({
  authURL: process.env.ZESTY_AUTH_API,
});
const badAuth = new Auth({
  authURL: "http://localhost:9999",
});

// NOTE: We explicitly do not catch promise rejections,
// instead we let them throw failing the test. Ava will
// print the uncaught error to the console

test("login:200", async (t) => {
  const res = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.is(res.statusCode, 200);
  t.not("", res.token);
});

test("verifyToken:200", async (t) => {
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );
  const res = await auth.verifyToken(session.token);

  t.is(res.statusCode, 200);
  t.is(res.verified, true);
});

test("verify2Fa:200", async (t) => {
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  //add your otp token
  var mfatoken = "0000000000";
  const res = await auth.verify2Fa(session.token, mfatoken);
  t.is(res.code, 200);
  t.is(res.verified, true);
});

/**
 * Causes account lock breaking tests
 */

test("verify2Fa:400", async (t) => {
  const missingToken = await auth.verify2Fa(null, null);
  t.is(missingToken.status, 400);
  t.is(
    missingToken.message,
    "Auth:verify2Fa() called without `token` argument"
  );

  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );
  const missingMfaToken = await auth.verify2Fa(session.token, null);
  t.is(missingMfaToken.status, 400);
  t.is(
    missingMfaToken.message,
    "Auth:verify2Fa() called without `mfatoken` argument"
  );
});

test.skip("login:400", async (t) => {
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

test.skip("login:401||403", async (t) => {
  const res = await auth.login("BAD@USERNAME", "BAD PASSWORD");

  // After 5 failed login attempts the auth service locks the account and returns
  // a 403 status code. We check for both status codes otherwise this test is inconsistent
  // when rain over 5 times within 5 minutes.
  t.truthy(res.statusCode == 401 || res.statusCode == 403);
});

test.skip("login:error", async (t) => {
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

test.skip("verifyToken:401", async (t) => {
  const res = await auth.verifyToken("BADTOKEN");

  t.is(res.statusCode, 401);
  t.is(res.verified, false);
});

test.skip("verifyToken:missing token", async (t) => {
  const res = await auth.verifyToken();
  t.is(res.verified, false);
});

test.skip("verifyToken:error", async (t) => {
  try {
    const res = await badAuth.verifyToken("BADTOKEN");
    t.fail();
  } catch (err) {
    t.is(err.message, "connect ECONNREFUSED 127.0.0.1:9999");
  }
});
