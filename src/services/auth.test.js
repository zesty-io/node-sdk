"use strict";

require("dotenv").config();

const test = require("ava");
const Auth = require("./auth");
const auth = new Auth({
  authURL: process.env.ZESTY_AUTH_API
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

test("login:401", async t => {
  const res = await auth.login("BAD@USERNAME", "BAD PASSWORD");
  t.is(res.statusCode, 401);
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
