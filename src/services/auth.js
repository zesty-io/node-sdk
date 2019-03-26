"use strict";

const request = require("request");

module.exports = class Auth {
  constructor(options = {}) {
    this.authURL =
      options.authURL ||
      process.env.ZESTY_AUTH_API ||
      "https://svc.zesty.io/auth";
  }

  async login(email, password) {
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
              statusCode: response.statusCode,
              ...body,
              token: body.meta.token
            });
          }
        }
      );
    });
  }

  async verifyToken(token) {
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
            let verified = false;

            if (response.statusCode === 200) {
              verified = true;
            }

            resolve({
              statusCode: response.statusCode,
              ...body,
              verified
            });
          }
        }
      );
    });
  }
};
