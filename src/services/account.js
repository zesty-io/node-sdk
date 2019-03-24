"use strict";

const Service = require("./service");

module.exports = class Account extends Service {
  constructor(instanceZUID, token, options = {}) {
    super(instanceZUID, token, options);

    this.baseAPI =
      options.accountsAPIURL ||
      process.env.ZESTY_ACCOUNTS_API ||
      `https://accounts.api.zesty.io/v1`;

    this.accountsAPIEndpoints = {
      instanceGET: `/instances/${instanceZUID}`,
      instanceUsersGET: `/instances/${instanceZUID}/users/roles`
    };
  }
};
