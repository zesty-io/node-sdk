"use strict";

const Auth = require("./services/auth");
const Account = require("./services/account");
const Instance = require("./services/instance");
const Media = require("./services/media");

const actions = require("./actions");

module.exports = class SDK {
  constructor(instanceZUID, token, options = {}) {
    this.instanceZUID = instanceZUID;
    this.options = options;

    if (token) {
      this.init(token);
    } else {
      throw new Error("SDK:constructor() missing required `token` parameter");
    }
  }

  init(token) {
    this.token = token;

    this.auth = new Auth(this.options);
    this.account = new Account(this.instanceZUID, this.token, this.options);
    this.instance = new Instance(this.instanceZUID, this.token, this.options);
    this.media = new Media(this.instanceZUID, this.token, this.options);

    // Bind the SDK to context to all action functions
    // Link action functions onto SDK class
    this.action = {};
    for (const funcName in actions) {
      if (actions[funcName].bind) {
        this.action[funcName] = actions[funcName].bind(this);
      }
    }

    // return this.auth
    //   .verifyToken(this.token)
    //   .then((res) => {
    //     if (res.statusCode !== 200) {
    //       throw res;
    //     } else {
    //       return res;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("init: catch: ", err);
    //     throw err;
    //   });
  }

  setToken(token) {
    if (!token) {
      throw Error("Missing token");
    }
    this.init(token);
  }

  setInstance(instanceZUID) {
    if (!instanceZUID) {
      throw Error("Missing instanceZUID");
    }
    this.instanceZUID = instanceZUID;
    this.init(this.token);
  }

  setOptions(options = {}) {
    this.options = options;
    this.init(this.token);
  }
};

module.exports.Auth = Auth;
