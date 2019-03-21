"use strict";

const Auth = require("./auth");
const Account = require("./account");
const Instance = require("./instance");
const Media = require("./media");

module.exports = class SDK {
  constructor(instanceZUID, token, options = {}) {
    this.instanceZUID = instanceZUID;
    this.options = options;

    // Ensure provided token is valid
    this.token = token;
    this.auth = new Auth({
      authURL: this.options.authURL
    });
    this.auth.verifyToken(this.token).catch(err => {
      throw err;
    });

    // Setup APIs
    // this.account = new Account(this.instanceZUID, this.token, this.options);
    this.instance = new Instance(this.instanceZUID, this.token, this.options);
    // this.media = new Media(this.instanceZUID, this.token, this.options)
  }
};
