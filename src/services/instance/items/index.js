"use strict";

const moment = require("moment");
const UTC_FORMAT = "YYYY-MM-DD HH:mm:ss";

module.exports = {
  API: {
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
    deleteItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID",


    publishItem: "/content/items/ITEM_ZUID/publish-schedule",
    unpublishItem: "/content/items/ITEM_ZUID/publish-schedule/PUBLISHING_ZUID",

    // NOTE should this be in a separate `Search` module?
    findItem: "/search/items?q=SEARCH_TERM" // Undocumented
  },
  legacy: {
    API: {
      // TODO migrate legacy endpoints to new api
      publishItem: "/content/items/ITEM_ZUID/publish-schedule",
      unpublishItem: "/content/items/ITEM_ZUID/publish-schedule/PUBLISHING_ZUID"
    }
  },
  mixin: superclass =>
    class Item extends superclass {
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

        return await this.postRequest(
          this.interpolate(this.API.publishItem, {
            MODEL_ZUID: modelZUID,
            ITEM_ZUID: itemZUID
          }),
          {
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

        // !!TODO needs to consume new API
        const url = this.legacy.interpolate(this.legacy.API.unpublishItem, {
          MODEL_ZUID: modelZUID,
          ITEM_ZUID: itemZUID,
          PUBLISHING_ZUID: publishZUID
        });
 
        // !!TODO needs to consume new API

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

      async deleteItem(modelZUID, itemZUID) {
        return await this.deleteRequest(
          this.interpolate(this.API.deleteItem, {
            MODEL_ZUID: modelZUID,
            ITEM_ZUID: itemZUID
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
    }
};
