"use strict";

const Service = require("../service");

module.exports = class Account extends Service {
  constructor(instanceZUID, token, options = {}) {
    const baseAPI =
      options.accountsAPIURL ||
      process.env.ZESTY_ACCOUNTS_API ||
      `https://accounts.api.zesty.io/v1`;

    super(baseAPI, token);

    this.API = {
      createInstance: `/instances`,
      fetchInstances: `/instances`,
      fetchInstance: `/instances/${instanceZUID}`,
      fetchInstanceUsers: `/instances/${instanceZUID}/users/roles`,
    };
  }

  async getInstance() {
    return await this.getRequest(this.API.fetchInstance);
  }
  async getInstances() {
    return await this.getRequest(this.API.fetchInstances);
  }
  async getInstanceUsers() {
    return await this.getRequest(this.API.fetchInstanceUsers);
  }
  async getSiteId() {
    if (this.siteId) {
      return this.siteId;
    } else {
      const instanceData = await this.getInstance();
      this.siteId = instanceData.data.ID;

      return this.siteId;
    }
  }
  async createInstance(payload) {
    return await this.postRequest(this.API.createInstance, { payload });
  }
};
