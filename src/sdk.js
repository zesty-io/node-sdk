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
      this.auth
        .verifyToken(this.token)
        .then(this.initServices)
        .catch(err => {
          throw err;
        });
    }
    // else {
    //   throw new Error("SDK: missing required `token` parameter");
    // }
  }

  initServices() {
    // Setup APIs
    this.account = new Account(this.instanceZUID, this.token, this.options);
    this.instance = new Instance(this.instanceZUID, this.token, this.options);
    this.media = new Media(this.instanceZUID, this.token, this.options);
  }

  async login(email, pass) {
    try {
      const res = await this.auth.login(email, pass);
      this.token = res.token;
      this.initServices(); // Re-init services with new token
      return this.token;
    } catch (err) {
      throw err;
    }
  }
};
