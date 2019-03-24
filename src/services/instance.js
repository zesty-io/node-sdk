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
      fetchModels: "/content/models",
      fetchModel: "/content/models/MODEL_ZUID",
      fetchModelFields: "/content/models/MODEL_ZUID/fields",
      fetchModelField: "/content/models/MODEL_ZUID/fields/FIELD_ZUID",

      itemsGETAll: "/content/models/MODEL_ZUID/items",
      itemsPOST: "/content/models/MODEL_ZUID/items",
      itemsGET: "/content/models/MODEL_ZUID/items/ITEM_ZUID",
      itemsGETPublishings:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings",
      itemsGETPublishing:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings/PUBLISHING_ZUID",
      itemsGETVersions: "/content/models/MODEL_ZUID/items/ITEM_ZUID/versions",
      itemsGETVersion:
        "/content/models/MODEL_ZUID/items/ITEM_ZUID/versions/VERSION_NUMBER",
      itemsPUT: "/content/models/MODEL_ZUID/items/ITEM_ZUID",
      viewsGETAll: "/web/views",
      viewsGET: "/web/views/VIEW_ZUID",
      viewsGETVersions: "/web/views/VIEW_ZUID/versions",
      viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
      viewsPOST: "/web/views",
      viewsPUT: "/web/views/VIEW_ZUID",
      viewsPUTPublish: "/web/views/VIEW_ZUID?action=publish",
      settingsGETAll: "/env/settings",
      settingsGET: "/env/settings/SETTINGS_ID",
      stylesheetsGETAll: "/web/stylesheets",
      stylesheetsGET: "/web/stylesheets/STYLESHEET_ZUID",
      stylesheetsGETVersions: "/web/stylesheets/STYLESHEET_ZUID/versions",
      stylesheetsGETVersion:
        "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER",
      stylesheetsPOST: "/web/stylesheets",
      stylesheetsPUT: "/web/stylesheets/STYLESHEET_ZUID",
      stylesheetsPUTPublish: "/web/stylesheets/STYLESHEET_ZUID?action=publish",
      scriptsGETAll: "/web/scripts",
      scriptsGET: "/web/scripts/SCRIPT_ZUID",
      scriptsGETVersions: "/web/scripts/SCRIPT_ZUID/versions",
      scriptsGETVersion: "/web/scripts/SCRIPT_ZUID/versions/VERSION_NUMBER",
      scriptsPOST: "/web/scripts",
      scriptsPUT: "/web/scripts/SCRIPT_ZUID",
      scriptsPUTPublish: "/web/scripts/SCRIPT_ZUID?action=publish",
      siteHeadGET: "/web/headers",
      navGET: "/env/nav",
      searchGET: "/search/items?q=SEARCH_TERM", // Undocumented
      headTagsGETAll: "/web/headtags",
      headTagsGET: "/web/headtags/HEADTAG_ZUID",
      headTagsDELETE: "/web/headtags/HEADTAG_ZUID",
      headTagsPUT: "/web/headtags/HEADTAG_ZUID",
      headTagsPOST: "/web/headtags",
      auditsGETAll: "/env/audits",
      auditsGET: "/env/audits/AUDIT_ZUID",
      auditsGETParams: "/env/audits?AUDIT_SEARCH_PARAMS"
    };
  }

  async getModels() {
    return await this.getRequest(this.API.fetchModels);
  }
};
