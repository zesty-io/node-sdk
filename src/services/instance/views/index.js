"use strict";

module.exports = {
  API: {
    getViews: "/web/views",
    getView: "/web/views/VIEW_ZUID",
    // viewsGETVersions: "/web/views/VIEW_ZUID/versions",
    // viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
    createView: "/web/views",
    updateView: "/web/views/VIEW_ZUID",
    publishView: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER"
  },
  mixin: superclass =>
    class extends superclass {
      validateView(payload) {
        const supportedTypes = ["snippet", "ajax-json", "ajax-html", "404"];

        if (!payload.code) {
          throw new Error(
            "Your provide payload is missing a required `code` property. This should be view code."
          );
        }

        if (!payload.filename) {
          throw new Error(
            "Your provide payload is missing a required `filename` property. This is the filename this code should belong to."
          );
        }

        if (!payload.type) {
          throw new Error(
            `Your provide payload is missing a required \`type\` property. This determines the type of view it is. Allowed types are ${supportedTypes.join(
              ", "
            )}`
          );
        }

        if (!supportedTypes.includes(payload.type)) {
          throw new Error(
            `The provided \`type\` (${
              payload.type
            }) property is not supported. Allowed types are ${supportedTypes.join(
              ", "
            )}`
          );
        }
      }

      async getViews() {
        return await this.getRequest(this.API.getViews);
      }
      async getView(viewZUID) {
        return await this.getRequest(
          this.interpolate(this.API.getView, {
            VIEW_ZUID: viewZUID
          })
        );
      }
      async getView(viewZUID) {
        return await this.getRequest(
          this.interpolate(this.API.getView, {
            VIEW_ZUID: viewZUID
          })
        );
      }
      async createView(payload) {
        this.validateView(payload);
        return await this.postRequest(this.API.createView, { payload });
      }

      async updateView(viewZUID, payload) {
        // this.validateView(payload);
        return await this.putRequest(
          this.interpolate(this.API.updateView, {
            VIEW_ZUID: viewZUID
          }),
          {
            payload
          }
        );
      }

      async publishView(viewZUID, version) {
        return await this.postRequest(
          this.interpolate(this.API.publishView, {
            VIEW_ZUID: viewZUID,
            VERSION_NUMBER: version
          })
        );
      }
    }
};
