"use strict";

const Auth = require("./services/auth");
const Account = require("./services/account");
const Instance = require("./services/instance");
const Media = require("./services/media");

module.exports = class SDK {
  constructor(instanceZUID, token, options = {}) {
    this.instanceZUID = instanceZUID;
    this.options = options;

    this.auth = new Auth({
      authURL: this.options.authURL
    });

    if (token) {
      this.token = token;
      this.auth.verifyToken(this.token).catch(err => {
        throw err;
      });
    } else {
      throw new Error("SDK: missing require `token` parameter");
    }

    // Setup APIs
    this.account = new Account(this.instanceZUID, this.token, this.options);
    this.instance = new Instance(this.instanceZUID, this.token, this.options);
    this.media = new Media(this.instanceZUID, this.token, this.options);
  }
};
