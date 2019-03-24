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
          if (response.statusCode === 200) {
            return resolve(body.meta.token);
          } else {
            if (error) {
              return reject({
                errorCode: -1,
                errorMessage: "Unexpected error."
              });
            } else {
              return reject({
                errorCode: response.statusCode,
                errorMessage: body.message || ""
              });
            }
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
          if (response.statusCode === 200) {
            return resolve(true);
          } else {
            if (error) {
              return reject({
                errorCode: -1,
                errorMessage: "Unexpected error."
              });
            } else {
              return reject(false);
            }
          }
        }
      );
    });
  }
};
