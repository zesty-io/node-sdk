"use strict";

require("dotenv").config();

const test = require("ava");
const Auth = require("./auth");

const auth = new Auth({
  authURL: process.env.ZESTY_AUTH_API
});

test("Auth:login:success", async t => {
  try {
    const token = await auth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    );
    t.not("", token);
  } catch (err) {
    console.log(err);
    t.fail();
  }
});

test("Auth:login:fail", async t => {
  try {
    const token = await auth.login("BAD@USERNAME", "BAD PASSWORD");
    t.fail("Code should not be reached");
  } catch (err) {
    t.is(err.errorCode, 401);
  }
});

test("Auth:verifyToken:success", async t => {
  try {
    const token = await auth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    );
    const verified = await auth.verifyToken(token);
    t.is(verified, true);
  } catch (err) {
    t.fail();
  }
});

test("Auth:verifyToken:fail", async t => {
  try {
    const token = await auth.verifyToken("BAD TOKEN");
    t.log(`token passed verification: ${token}`);
    t.fail();
  } catch (err) {
    t.is(err, false);
  }
});
