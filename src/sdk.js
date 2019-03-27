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
      this.init(token);
    } else {
      throw new Error("SDK: missing required `token` parameter");
    }
  }

  async init(token) {
    this.token = token;

    this.account = new Account(this.instanceZUID, this.token, this.options);
    this.instance = new Instance(this.instanceZUID, this.token, this.options);
    this.media = new Media(this.instanceZUID, this.token, this.options);

    return this.auth.verifyToken(this.token).then(res => {
      if (res.statusCode !== 200) {
        throw res;
      } else {
        return res;
      }
    });
  }
};

module.exports.Auth = Auth;
