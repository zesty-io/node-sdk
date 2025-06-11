"use strict";

module.exports = {
  API: {
    fetchLabels: "/env/labels",
    fetchLabel: "/env/labels/LABEL_ZUID",
    createLabel: "/env/labels",
    updateLabel: "/env/labels/LABEL_ZUID",
    deleteLabel: "/env/labels/LABEL_ZUID"
  },
  mixin: superclass =>
    class Label extends superclass {
      async fetchLabels() {
        return await this.getRequest(this.API.fetchLabels);
      }

      async fetchLabel(id) {
        if (!id) {
          throw new Error(
            "SDK:Instance:fetchLabel() missing required `id` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchLabel, {
            LABEL_ZUID: id
          })
        );
      }

      async createLabel(payload){
        if(!payload){
          throw new Error(
            "SDK:Instance:createLabel() missing required `payload` argument"
          );
        }

        return await this.postRequest(
          this.API.createLabel,
          {
            payload
          }
        );
      }

      async updateLabel(id, payload) {
        if (!id) {
          throw new Error(
            "SDK:Instance:updateLabel() missing required `id` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateLabel() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateLabel, {
            LABEL_ZUID: id
          }),
          {
            payload
          }
        );
      }

      async deleteLabel(id) {
        if (!id) {
          throw new Error(
            "SDK:Instance:deleteLabel() missing required `id` argument"
          );
        }
        return await this.deleteRequest(
          this.interpolate(this.API.deleteLabel, {
            LABEL_ZUID: id
          })
        );
      }
    }
};
