"use strict";

const moment = require("moment");
const Service = require("./service");

const UTC_FORMAT = "YYYY-MM-DD HH:mm:ss";

module.exports = class Instance extends Service {
  constructor(instanceZUID, token, options = {}) {
    if (!instanceZUID) {
      throw new Error(
        "SDK:Instance:constructor() missing required `instanceZUID` argument on instantiation"
      );
    }

    const baseAPI =
      options.instancesAPIURL ||
      process.env.ZESTY_INSTANCE_API ||
      `https://${instanceZUID}.api.zesty.io/v1`;

    // Instantiate Service class
    super(baseAPI, token, options);

    // Legacy API endpoints
    const sitesServiceURL =
      options.sitesServiceURL ||
      process.env.ZESTY_INSTANCE_LEGACY_API ||
      `https://svc.zesty.io/sites-service/${instanceZUID}`;

    this.legacy = new Service(sitesServiceURL, token);
    this.legacy.API = {
      publishItem: "/content/items/ITEM_ZUID/publish-schedule",
      unpublishItem: "/content/items/ITEM_ZUID/publish-schedule/PUBLISHING_ZUID"
      // deleteItem: "/content/sets/MODEL_ZUID/items/ITEM_ZUID"
    };

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

      createItem: "/content/models/MODEL_ZUID/items",
      updateItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID",

      // Settings
      fetchSettings: "/env/settings",
      fetchSetting: "/env/settings/SETTINGS_ID",

      // Templates
      // viewsGETAll: "/web/views",
      // viewsGET: "/web/views/VIEW_ZUID",
      // viewsGETVersions: "/web/views/VIEW_ZUID/versions",
      // viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
      // viewsPOST: "/web/views",
      // viewsPUT: "/web/views/VIEW_ZUID",
      // viewsPUTPublish: "/web/views/VIEW_ZUID?action=publish",

      // Stylesheets
      // stylesheetsGETAll: "/web/stylesheets",
      // stylesheetsGET: "/web/stylesheets/STYLESHEET_ZUID",
      // stylesheetsGETVersions: "/web/stylesheets/STYLESHEET_ZUID/versions",
      // stylesheetsGETVersion:
      //   "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER",
      // stylesheetsPOST: "/web/stylesheets",
      // stylesheetsPUT: "/web/stylesheets/STYLESHEET_ZUID",
      // stylesheetsPUTPublish: "/web/stylesheets/STYLESHEET_ZUID?action=publish",

      // Scripts
      // scriptsGETAll: "/web/scripts",
      // scriptsGET: "/web/scripts/SCRIPT_ZUID",
      // scriptsGETVersions: "/web/scripts/SCRIPT_ZUID/versions",
      // scriptsGETVersion: "/web/scripts/SCRIPT_ZUID/versions/VERSION_NUMBER",
      // scriptsPOST: "/web/scripts",
      // scriptsPUT: "/web/scripts/SCRIPT_ZUID",
      // scriptsPUTPublish: "/web/scripts/SCRIPT_ZUID?action=publish",

      // Document Tags
      // siteHeadGET: "/web/headers",
      // headTagsGETAll: "/web/headtags",
      // headTagsGET: "/web/headtags/HEADTAG_ZUID",
      // headTagsDELETE: "/web/headtags/HEADTAG_ZUID",
      // headTagsPUT: "/web/headtags/HEADTAG_ZUID",
      // headTagsPOST: "/web/headtags",

      // Audit Logs
      // auditsGETAll: "/env/audits",
      // auditsGET: "/env/audits/AUDIT_ZUID",
      // auditsGETParams: "/env/audits?AUDIT_SEARCH_PARAMS",

      // Misc.
      // navGET: "/env/nav",
      findItem: "/search/items?q=SEARCH_TERM" // Undocumented
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

  async getModels() {
    return await this.getRequest(this.API.fetchModels);
  }
  async getModel(modelZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getModel() missing required `modelZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchModel, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getModelFields(modelZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getModelFields() missing required `modelZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchModelFields, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getModelField(modelZUID, fieldZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getModelField() missing required `modelZUID` argument"
      );
    }
    if (!fieldZUID) {
      throw new Error(
        "SDK:Instance:getModelField() missing required `fieldZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchModelField, {
        MODEL_ZUID: modelZUID,
        FIELD_ZUID: fieldZUID
      })
    );
  }
  async getItems(modelZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItems() missing required `modelZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItems, {
        MODEL_ZUID: modelZUID
      })
    );
  }
  async getItem(modelZUID, itemZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItem() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:getItem() missing required `itemZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItem, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemPublishings(modelZUID, itemZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItemPublishings() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:getItemPublishings() missing required `itemZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItemPublishings, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemPublishing(modelZUID, itemZUID, publishZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItemPublishing() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:getItemPublishing() missing required `itemZUID` argument"
      );
    }
    if (!publishZUID) {
      throw new Error(
        "SDK:Instance:getItemPublishing() missing required `publishZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItemPublishing, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID,
        PUBLISH_ZUID: publishZUID
      })
    );
  }
  async getItemVersions(modelZUID, itemZUID) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItemVersions() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:getItemVersions() missing required `itemZUID` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItemVersions, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      })
    );
  }
  async getItemVersion(modelZUID, itemZUID, version) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:getItemVersion() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:getItemVersion() missing required `itemZUID` argument"
      );
    }
    if (!version) {
      throw new Error(
        "SDK:Instance:getItemVersion() missing required `version` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchItemVersion, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID,
        VERSION_NUMBER: version
      })
    );
  }

  async createItem(modelZUID, payload) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:createItem() missing required `modelZUID` argument"
      );
    }
    if (!payload) {
      throw new Error(
        "SDK:Instance:createItem() missing required `payload` argument"
      );
    }

    delete payload.meta; // New items can not set their own meta

    return await this.postRequest(
      this.interpolate(this.API.createItem, {
        MODEL_ZUID: modelZUID
      }),
      {
        payload
      }
    );
  }

  async updateItem(modelZUID, itemZUID, payload) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:updateItem() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:updateItem() missing required `itemZUID` argument"
      );
    }
    if (!payload) {
      throw new Error(
        "SDK:Instance:updateItem() missing required `payload` argument"
      );
    }
    return await this.putRequest(
      this.interpolate(this.API.updateItem, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      }),
      {
        payload
      }
    );
  }

  async publishItem(modelZUID, itemZUID, version) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:publishItem() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:publishItem() missing required `itemZUID` argument"
      );
    }
    if (!version) {
      throw new Error(
        "SDK:Instance:publishItem() missing required `version` argument"
      );
    }

    return await this.legacy.postRequest(
      this.legacy.interpolate(this.legacy.API.publishItem, {
        MODEL_ZUID: modelZUID,
        ITEM_ZUID: itemZUID
      }),
      {
        usesCookieAuth: true,
        payload: {
          version_num: version
        }
      }
    );
  }

  async unpublishItem(
    modelZUID,
    itemZUID,
    publishZUID,
    offlineAt = moment().format(UTC_FORMAT)
  ) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:unpublishItem() missing required `modelZUID` argument"
      );
    }
    if (!itemZUID) {
      throw new Error(
        "SDK:Instance:unpublishItem() missing required `itemZUID` argument"
      );
    }

    if (!publishZUID) {
      const res = await this.getItemPublishings(modelZUID, itemZUID);
      if (res.data.length) {
        publishZUID = res.data[0].ZUID;
      } else {
        throw new Error(
          `No publishing records found for itemZUID: ${itemZUID}`
        );
      }
    }

    const url = this.legacy.interpolate(this.legacy.API.unpublishItem, {
      MODEL_ZUID: modelZUID,
      ITEM_ZUID: itemZUID,
      PUBLISHING_ZUID: publishZUID
    });

    return await this.legacy.patchRequest(url, {
      usesCookieAuth: true,
      payload: {
        take_offline_at: offlineAt
      }
    });
  }

  async findItem(query) {
    if (!query) {
      throw new Error(
        "SDK:Instance:findItem() missing required `query` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.findItem, {
        SEARCH_TERM: query
      })
    );
  }

  async upsertItem(modelZUID, path, payload) {
    if (!modelZUID) {
      throw new Error(
        "SDK:Instance:upsertItem() missing required `modelZUID` argument"
      );
    }
    if (!path) {
      throw new Error(
        "SDK:Instance:upsertItem() missing required `path` argument"
      );
    }
    if (!payload) {
      throw new Error(
        "SDK:Instance:upsertItem() missing required `payload` argument"
      );
    }

    const res = await this.findItem(path);

    if (Array.isArray(res.data) && res.data.length) {
      const item = res.data.find(item => item.web.pathPart === path);
      if (item) {
        // Ensure required masterZUID is set for updates
        payload.meta.masterZUID = item.meta.ZUID;

        return await this.updateItem(modelZUID, item.meta.ZUID, payload);
      } else {
        return await this.createItem(modelZUID, payload);
      }
    } else {
      return await this.createItem(modelZUID, payload);
    }
  }

  async getSettings() {
    return await this.getRequest(this.API.fetchSettings);
  }

  async getSetting(id) {
    if (!id) {
      throw new Error(
        "SDK:Instance:getSetting() missing required `id` argument"
      );
    }
    return await this.getRequest(
      this.interpolate(this.API.fetchSetting, {
        SETTINGS_ID: id
      })
    );
  }
};
