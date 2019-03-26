"use strict";

const Service = require("./service");

module.exports = class Instance extends Service {
  constructor(instanceZUID, token, options = {}) {
    super(instanceZUID, token, options);

    this.defaultAccessError = "Request Failed";

    // Legacy API endpoints
    this.sitesServiceURL =
      options.sitesServiceURL ||
      process.env.ZESTY_INSTANCE_LEGACY_API ||
      `https://svc.zesty.io/sites-service/${instanceZUID}`;
    this.legacyAPI = {
      schedulePublishPOST: "/content/items/ITEM_ZUID/publish-schedule",
      scheduleUnpublishPATCH:
        "/content/items/ITEM_ZUID/publish-schedule/PUBLISHING_ZUID",
      itemsDELETE: "/content/sets/MODEL_ZUID/items/ITEM_ZUID"
    };

    this.baseAPI =
      options.instancesAPIURL ||
      process.env.ZESTY_INSTANCE_API ||
      `https://${instanceZUID}.api.zesty.io/v1`;

    this.API = {
      // Model
      fetchModels: "/content/models",
      fetchModel: "/content/models/MODEL_ZUID",

      // Fields
      fetchModelFields: "/content/models/MODEL_ZUID/fields",
      fetchModelField: "/content/models/MODEL_ZUID/fields/FIELD_ZUID",

      // Content
      fetchItems: "/content/models/MODEL_ZUID/items",
      fetchItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID",
      fetchItemPublishings:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings",
      fetchItemPublishing:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings/PUBLISH_ZUID",
      fetchItemVersions: "/content/models/MODEL_ZUID/items/ITEM_ZUID/versions",
      fetchItemVersion:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/versions/VERSION_NUMBER",

      ///////
      // TODO all below
      ///////
      itemsPOST: "/content/models/MODEL_ZUID/items",
      itemsPUT: "/content/models/MODEL_ZUID/items/ITEM_ZUID",

      // Settings
      settingsGETAll: "/env/settings",
      settingsGET: "/env/settings/SETTINGS_ID",

      // Templates
      viewsGETAll: "/web/views",
      viewsGET: "/web/views/VIEW_ZUID",
      viewsGETVersions: "/web/views/VIEW_ZUID/versions",
      viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
      viewsPOST: "/web/views",
      viewsPUT: "/web/views/VIEW_ZUID",
      viewsPUTPublish: "/web/views/VIEW_ZUID?action=publish",

      // Stylesheets
      stylesheetsGETAll: "/web/stylesheets",
      stylesheetsGET: "/web/stylesheets/STYLESHEET_ZUID",
      stylesheetsGETVersions: "/web/stylesheets/STYLESHEET_ZUID/versions",
      stylesheetsGETVersion:
        "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER",
      stylesheetsPOST: "/web/stylesheets",
      stylesheetsPUT: "/web/stylesheets/STYLESHEET_ZUID",
      stylesheetsPUTPublish: "/web/stylesheets/STYLESHEET_ZUID?action=publish",

      // Scripts
      scriptsGETAll: "/web/scripts",
      scriptsGET: "/web/scripts/SCRIPT_ZUID",
      scriptsGETVersions: "/web/scripts/SCRIPT_ZUID/versions",
      scriptsGETVersion: "/web/scripts/SCRIPT_ZUID/versions/VERSION_NUMBER",
      scriptsPOST: "/web/scripts",
      scriptsPUT: "/web/scripts/SCRIPT_ZUID",
      scriptsPUTPublish: "/web/scripts/SCRIPT_ZUID?action=publish",

      // Document Tags
      siteHeadGET: "/web/headers",
      headTagsGETAll: "/web/headtags",
      headTagsGET: "/web/headtags/HEADTAG_ZUID",
      headTagsDELETE: "/web/headtags/HEADTAG_ZUID",
      headTagsPUT: "/web/headtags/HEADTAG_ZUID",
      headTagsPOST: "/web/headtags",

      // Audit Logs
      auditsGETAll: "/env/audits",
      auditsGET: "/env/audits/AUDIT_ZUID",
      auditsGETParams: "/env/audits?AUDIT_SEARCH_PARAMS",

      // Misc.
      navGET: "/env/nav",
      searchGET: "/search/items?q=SEARCH_TERM" // Undocumented
    };
  }

  async getModels() {
    return await this.getRequest(this.API.fetchModels);
  }
  async getModel(modelZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchModel, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getModelFields(modelZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchModelFields, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getModelField(modelZUID, fieldZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchModelField, {
        MODEL_ZUID: modelZUID,
        FIELD_ZUID: fieldZUID
      })
    );
  }
  async getItems(modelZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItems, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getItem(modelZUID, itemZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItem, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemPublishings(modelZUID, itemZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItemPublishings, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemPublishing(modelZUID, itemZUID, publishZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItemPublishing, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID,
        PUBLISH_ZUID: publishZUID
      })
    );
  }
  async getItemVersions(modelZUID, itemZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItemVersions, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemVersion(modelZUID, itemZUID, version) {
    return await this.getRequest(
      this.interpolate(this.API.fetchItemVersion, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID,
        VERSION_NUMBER: version
      })
    );
  }
};
