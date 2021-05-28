"use strict";

const Service = require("../service");

module.exports = class Account extends Service {
  constructor(instanceZUID, token, options = {}) {
    super(instanceZUID, token, options);

    this.baseAPI =
      options.accountsAPIURL ||
      process.env.ZESTY_ACCOUNTS_API ||
      `https://accounts.api.zesty.io/v1`;

    this.API = {
      fetchInstance: `/instances/${instanceZUID}`,
      fetchInstanceUsers: `/instances/${instanceZUID}/users/roles`,
      
      // 
      // WEBHOOKS
      // 
      createWebhook: `/webhooks`,
      getInstanceWebhook: `/instances/${instanceZUID}/webhooks`,
      getWebhook: `/webhooks/WEBHOOK_ZUID`,
    };

    // WEBHOOK CONSTANTS

    // event actions
    this.CREATE = 1
    this.UPDATE = 2
    this.DELETE = 3
    this.PUBLISH = 4
    this.UNPUBLISH = 5
    this.UNDO_DELETE = 6
  
    // HTTP Application Content Types
    this.JSON = "application/json"
    this.formEncoded = "application/x-www-form-url-encoded"
  
  }

  async getInstance() {
    return await this.getRequest(this.API.fetchInstance);
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

  // Creates a single webhook to listen for events
  // At this point the SDK will only allow users to 
  // create webhooks for a given Zesty instance. 

  async createWebhook(opts = {
    scopedResource: "",
    eventAction: "",
    parentResourceZUID: null,
    resource: "",
    method: "",
    URL: "",
    contentType: "",
    authorization: null,
    body: null,
    description: null,
  }){
      
    // validate event action
    if (opts.eventAction != this.CREATE &&
      opts.eventAction != this.UPDATE &&
      opts.eventAction != this.DELETE &&
      opts.eventAction != this.PUBLISH &&
      opts.eventAction != this.UNPUBLISH &&
      opts.eventAction != this.UNDO_DELETE) {
        throw new Error(
          "Invalid eventAction value"
        );
      }
    
    // validate method
    if (opts.method != "POST" &&
    opts.method != "GET") {
      throw new Error(
        `Unsupported method type: ${opts.method}`
      );
    }

    // validate resource type

    // validate content-type
    if (opts.contentType != this.JSON && 
      opts.contentType != this.formEncoded) {
        throw new Error(
          `Unsupported content-type: ${opts.contentType}`
        );
      }

    // send request
    return await this.postRequest(
      this.API.createWebhook,
      {
        payload: opts
      }
    );

  }

  // get all webhooks for the current instance
  async getWebhooks() {
    // validate the scoped resource
    const instance = this.getInstance();
    const instanceZUID = instance.ZUID;

    return await this.getRequest(
      this.interpolate(
        this.API.getInstanceWebhook, {
          INSTANCE_ZUID: instanceZUID
        } 
      )
    );
  }

  // get a single webhook by its webhook ZUID
  async getWebhook(webhookZUID) {
    // validate webhook ZUID
    if (!webhookZUID.startsWith("40-")) {
      throw new Error(
        `Invalid webhook ZUID: ${webhookZUID}`
      );
    }

    return await this.getRequest(
      this.interpolate(
        this.API.getWebhook, {
          WEBHOOK_ZUID: webhookZUID
        }
      )
    );
  }

};
