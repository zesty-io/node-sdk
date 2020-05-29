"use strict";

require("dotenv").config();

const test = require("ava");
const moment = require("moment");

const Auth = require("./auth");

// 
// AUTH
// 

const auth = new Auth({
  authURL: process.env.ZESTY_AUTH_API
});
const badAuth = new Auth({
  authURL: "http://localhost:9999"
});

// NOTE: We explicitly do not catch promise rejections,
// instead we let them throw failing the test. Ava will
// print the uncaught error to the console

// 
// AUTH LOGIN
// 

// test successful login to auth service
test.serial("login:200", async t => {
  const res = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );

  t.is(res.statusCode, 200);
  t.not("", res.token);
});

 // test failed login to auth service with no username and password
test.serial("login:400", async t => {
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

// test failed login to auth service using a bad username and bad password
test.serial("login:401||403", async t => {
  // creates a unique bad username everytime so this test can be run 
  // multiple times without fear of getting locked out
  const res = await auth.login(`BADUSERNAME+${moment().valueOf()}@MAIL.COM`, "BAD PASSWORD");

  // After 5 failed login attempts the auth service locks the account and returns
  // a 403 status code. We check for both status codes otherwise this test is inconsistent
  // when ran over 5 times within 5 minutes.
  t.truthy(res.statusCode == 401 || res.statusCode == 403);
});

// test failed login to an invalid auth service URL using a valid username and password
test.serial("login:error", async t => {
  const badAuthURL = await t.throwsAsync(
    badAuth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    )
  );
  t.is(
    badAuthURL.code,
    'ECONNREFUSED'
  );
});

// 
// AUTH VERIFY TOKEN
// 

// test successful token verification using auth service by logging in with a valid username and password
test.serial("verifyToken:200", async t => {
  const session = await auth.login(
    process.env.ZESTY_USER_EMAIL,
    process.env.ZESTY_USER_PASSWORD
  );
  const res = await auth.verifyToken(session.token);

  t.is(res.statusCode, 200);
  t.is(res.verified, true);
});

// test failed token verification using auth service with an invalid auth token
test.serial("verifyToken:401", async t => {
  const res = await auth.verifyToken("BADTOKEN");
  t.is(res.statusCode, 401);
  t.is(res.verified, false);
});

// test failed token verification using auth service with a missing token
test.serial("verifyToken:missing token", async t => {
  const res = await auth.verifyToken();
  t.is(res.verified, false);
});

// test failed token verification using an invalid auth service with a valid token
test.serial("verifyToken:error", async t => {
  const badAuthToken = await t.throwsAsync(
    badAuth.verifyToken("BADTOKEN")
  );
  t.is(
    badAuthToken.code,
    'ECONNREFUSED'
  );
});
