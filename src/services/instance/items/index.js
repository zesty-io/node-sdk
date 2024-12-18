"use strict";

const moment = require("moment");
const UTC_FORMAT = "YYYY-MM-DD HH:mm:ss";

module.exports = {
  API: {
    fetchItems:
      "/content/models/MODEL_ZUID/items?page=PAGE&limit=LIMIT&lang=LANG&_active=ACTIVE",
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
    patchItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID",
    deleteItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID",

    publishItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings",
    unpublishItem: "/content/models/MODEL_ZUID/items/ITEM_ZUID/publishings/VERSION_ZUID",

    // NOTE should this be in a separate `Search` module?
    findItem: "/search/items?q=SEARCH_TERM", // Undocumented
  },
  mixin: (superclass) =>
    class Item extends superclass {
      async getItems(
        modelZUID,
        opt = {
          lang: "en-US",
          limit: 5000,
          page: 1,
          _active: 0
        }
      ) {
        if (!modelZUID) {
          throw new Error(
            "SDK:Instance:getItems() missing required `modelZUID` argument"
          );
        }

        let run = true;
        let results = [];
        let currentPage = opt.page;
        let res;

        // Because the API is paginated we need to page
        // through this models items building up the complete
        // set of items to return
        while (run) {
          res = await this.getRequest(
            this.interpolate(this.API.fetchItems, {
              MODEL_ZUID: modelZUID,
              ACTIVE: opt._active,
              PAGE: currentPage,
              LIMIT: opt.limit,
              LANG: opt.lang,
            })
          );

          if (res.statusCode !== 200) {
            throw res;
          }

          if (!res.data.length) {
            run = false;
          } else {
            currentPage++;
            results.push(...res.data);
          }
        }

        res.data = results;

        return res;
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
            ITEM_ZUID: itemZUID,
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
            ITEM_ZUID: itemZUID,
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
            PUBLISH_ZUID: publishZUID,
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
            ITEM_ZUID: itemZUID,
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
            VERSION_NUMBER: version,
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
            MODEL_ZUID: modelZUID,
          }),
          {
            payload,
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
            ITEM_ZUID: itemZUID,
          }),
          {
            payload,
          }
        );
      }

      async patchItem(modelZUID, itemZUID, payload) {
        if (!modelZUID) {
          throw new Error(
            "SDK:Instance:patchItem() missing required `modelZUID` argument"
          );
        }
        if (!itemZUID) {
          throw new Error(
            "SDK:Instance:patchItem() missing required `itemZUID` argument"
          );
        }
        if (!payload) {
          throw new Error(
            "SDK:Instance:patchItem() missing required `payload` argument"
          );
        }
        return await this.patchRequest(
          this.interpolate(this.API.patchItem, {
            MODEL_ZUID: modelZUID,
            ITEM_ZUID: itemZUID,
          }),
          {
            payload,
          }
        );
      }

      async publishItem(
        modelZUID,
        itemZUID,
        version,
        publishAt = "now",
        unpublishAt = "never"
      ) {
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
            ITEM_ZUID: itemZUID,
          }),
          {
            payload: {
              version: version,
              publishAt: publishAt,
              unpublishAt: unpublishAt,
            },
          }
        );
      }

      async publishItems(items) {
        if (!Array.isArray(items)) {
          throw new Error(
            "SDK:Instance:publishItems() requires `items` argument to be an array"
          );
        }
        if (!items.length) {
          throw new Error(
            "SDK:Instance:publishItems() `items` array did not contain any items"
          );
        }

        // GCP begins rejecting requests from a single IP
        // after a certain threshold. 100 seems to be the magic number
        const limit = 100;
        const iterations = Math.floor(items.length / limit);

        let results = [];
        let run = true;
        let index = 0;

        console.log("publish groups: ", iterations);

        while (run) {
          const start = index * limit;
          const chunk = items.slice(start, start + limit);

          console.log("publish group: ", index);

          const requests = chunk.map((item) => {
            return this.publishItem(
              item.meta.contentModelZUID,
              item.meta.ZUID,
              item.meta.version
            );
          });

          await Promise.all(requests).catch((err) => {
            console.error(err);
            run = false;
          });

          // capture all requests to be returned
          results.push(...requests);

          if (iterations === index) {
            run = false;
            break;
          }

          index++;
        }

        return results;
      }

      async unpublishItem(modelZUID, itemZUID, versionZUID) {
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
        if (!versionZUID) {
          throw new Error(
            "SDK:Instance:unpublishItem() missing required `versionZUID` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.unpublishItem, {
            MODEL_ZUID: modelZUID,
            ITEM_ZUID: itemZUID,
            VERSION_ZUID: versionZUID
          })
        );
      }

      async findItem(query) {
        if (!query) {
          throw new Error(
            "SDK:Instance:findItem() missing required `query` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.findItem, {
            SEARCH_TERM: query,
          })
        );
      }

      async deleteItem(modelZUID, itemZUID) {
        return await this.deleteRequest(
          this.interpolate(this.API.deleteItem, {
            MODEL_ZUID: modelZUID,
            ITEM_ZUID: itemZUID,
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
          const item = res.data.find((item) => item.web.pathPart === path);
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
    },
};
