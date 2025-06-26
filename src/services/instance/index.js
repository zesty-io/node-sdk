"use strict";

const Service = require("../service");
const Models = require("./models");
const Fields = require("./fields");
const Labels = require("./labels");
const Links = require("./links");
const Items = require("./items");
const ItemLabelings = require("./item-labelings");
const Redirects = require("./redirects");
const Settings = require("./settings");
const AuditLogs = require("./audit-logs");
const HeadTags = require("./head-tags");
const Stylesheets = require("./stylesheets");
const Variables = require("./variables");
const Views = require("./views");
const Langs = require("./langs");

/**
  Utility class to combine mixins
  @see http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/
 */
class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}
let mix = (superclass) => new MixinBuilder(superclass);

/**
  Instance Class
  Using mixins we combine sub-classes with the Service superclass to generate the `Instance` class
 */
// Instance -> mixin(Model) | mixin(Item) | etc -> Service
module.exports = class Instance extends mix(Service).with(
  Models.mixin,
  Fields.mixin,
  Labels.mixin,
  Links.mixin,
  Items.mixin,
  ItemLabelings.mixin,
  Settings.mixin,
  Redirects.mixin,
  AuditLogs.mixin,
  HeadTags.mixin,
  Stylesheets.mixin,
  Variables.mixin,
  Views.mixin,
  Langs.mixin
) {
  constructor(instanceZUID, token, options = {}) {
    const baseAPI =
      options.instancesAPIURL ||
      process.env.ZESTY_INSTANCE_API ||
      `https://${instanceZUID}.api.zesty.io/v1`;

    // Legacy API endpoints
    // TODO retire these endpoints
    const sitesServiceURL =
      options.sitesServiceURL ||
      process.env.ZESTY_INSTANCE_LEGACY_API ||
      `https://svc.zesty.io/sites-service/${instanceZUID}`;

    // Instantiate Service class
    super(baseAPI, token, options);

    // TODO retire these endpoints
    this.legacy = new Service(sitesServiceURL, token);

    this.API = {
      ...Models.API,
      ...Fields.API,
      ...Labels.API,
      ...Links.API,
      ...Items.API,
      ...ItemLabelings.API,
      ...Redirects.API,
      ...Settings.API,
      ...AuditLogs.API,
      ...HeadTags.API,
      ...Stylesheets.API,
      ...Variables.API,
      ...Views.API,
      ...Langs.API
    };
  }

  formatPath(path) {
    if (!path) {
      throw new Error(
        "SDK:Instance:formatPath() missing required `path` argument"
      );
    }
    return path
      .trim()
      .toLowerCase()
      .replace(/\&/g, "and")
      .replace(/[^a-zA-Z0-9]/g, "-");
  }
};
