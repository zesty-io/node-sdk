"use strict";

module.exports = {
  API: {
    fetchItemLabelings: "/content/models/MODEL_ZUID/items/ITEM_ZUID/labels",
    fetchItemLabeling: "/content/models/MODEL_ZUID/items/ITEM_ZUID/labels/LABEL_ZUID",
    updateItemLabelings: "/content/models/MODEL_ZUID/items/ITEM_ZUID/labels/LABEL_ZUID",
  },
  mixin: superclass =>
    class ItemLabelings extends superclass {
      async fetchItemLabelings(modelZuid, itemZuid) {
        if (!modelZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `modelZuid` argument"
          );
        }

        if (!itemZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `itemZuid` argument"
          );
        }

        return await this.getRequest(
          this.interpolate(this.API.fetchItemLabelings, {
            MODEL_ZUID: modelZuid,
            ITEM_ZUID: itemZuid
          })
        );
      }

      async fetchItemLabeling(modelZuid, itemZuid, labelZuid) {
        if (!modelZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `modelZuid` argument"
          );
        }

        if (!itemZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `itemZuid` argument"
          );
        }

        if (!labelZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `labelZuid` argument"
          );
        }

        return await this.getRequest(
          this.interpolate(this.API.fetchItemLabeling, {
            MODEL_ZUID: modelZuid,
            ITEM_ZUID: itemZuid,
            LABEL_ZUID: labelZuid
          })
        );
      }

      async updateItemLabelings(modelZuid, itemZuid, labelZuid, payload) {
        if (!modelZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `modelZuid` argument"
          );
        }

        if (!itemZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `itemZuid` argument"
          );
        }

        if (!labelZuid) {
          throw new Error(
            "SDK:Instance:fetchItemLabeling() missing required `labelZuid` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateItemLabelings() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateItemLabelings, {
            MODEL_ZUID: modelZuid,
            ITEM_ZUID: itemZuid,
            LABEL_ZUID: labelZuid
          }),
          {
            payload,
          }
        );
      }
    }
};
