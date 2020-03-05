"use strict";

const request = require("request");

module.exports = class Auth {
  constructor(options = {}) {
    this.authURL =
      options.authURL || process.env.ZESTY_AUTH_API || "https://auth.zesty.io";
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

    return new Promise((resolve, reject) => {
      request.post(
        {
          url: `${this.authURL}/login`,
          json: true,
          formData: {
            email,
            password
          }
        },
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              ...body,
              statusCode: response.statusCode,
              token: (body.meta && body.meta.token) || null
            });
          }
        }
      );
    });
  }

  async verifyToken(token) {
    if (!token) {
      console.log("Auth:verifyToken() called without `token` argument");
      return { verified: false };
    }
    return new Promise((resolve, reject) => {
      request.get(
        {
          url: `${this.authURL}/verify`,
          headers: {
            Authorization: `Bearer ${token}`
          },
          json: true
        },
        (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              ...body,
              statusCode: response.statusCode,
              verified: response.statusCode === 200 ? true : false
            });
          }
        }
      );
    });
  }
};
