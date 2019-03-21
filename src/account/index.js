"use strict";

module.exports = class Account {
  constructor(instanceZUID, token, options = {}) {
    this.accountsAPIEndpoints = {
      instanceGET: "/instances/INSTANCE_ZUID",
      instanceUsersGET: "/instances/INSTANCE_ZUID/users/roles"
    };
  }
};
