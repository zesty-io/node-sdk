"use strict";

const fetch = require("node-fetch");
const FormData = require("form-data");

module.exports = class Auth {
  constructor(options = {}) {
    this.authURL =
      options.authURL ||
      process.env.ZESTY_AUTH_API ||
      "https://auth.api.zesty.io";
  }

  async login(email, password) {
    if (!email) {
      return {
        statusCode: 400,
        message: "Auth:login() missing required argument `email`"
      };
    }
    if (!password) {
      return {
        statusCode: 400,
        message: "Auth:login() missing required argument `password`"
      };
    }

    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    return fetch(`${this.authURL}/login`, {
      method: "POST",
      body: form
    }).then(res => {
      return res.json().then(data => {
        return {
          ...data,
          statusCode: res.status,
          token: (data.meta && data.meta.token) || null
        };
      });
    });
  }

  async verifyToken(token) {
    if (!token) {
      console.log("Auth:verifyToken() called without `token` argument");
      return { verified: false };
    }

    return fetch(`${this.authURL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      return res.json().then(data => {
        return {
          ...data,
          statusCode: res.status,
          verified: res.status === 200 ? true : false
        };
      });
    });
  }
};
