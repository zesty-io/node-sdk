"use strict";

module.exports = {
  API: {
    getViews: "/web/views",
    getView: "/web/views/VIEW_ZUID",
    // viewsGETVersions: "/web/views/VIEW_ZUID/versions",
    // viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
    createView: "/web/views"
    // updateView: "/web/views/VIEW_ZUID",
    // publishView: "/web/views/VIEW_ZUID?action=publish",
  },
  mixin: superclass =>
    class extends superclass {
      validate(payload) {
        const supportedTypes = ["snippet", "ajax-json", "ajax-html", "404"];

        if (!payload.code) {
          throw new Error(
            "Your provide payload is missing a required `code` property. This should be stylesheet code."
          );
        }
        if (!payload.filename) {
          throw new Error(
            "Your provide payload is missing a required `filename` property. This is the filename this code should belong to."
          );
        }

        if (!payload.type) {
          throw new Error(
            'Your provide payload is missing a required `type` property. This is the value to represent the files http `Content-Type`. e.g. "text/css", "text/less"'
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
        this.validate(payload);
        return await this.postRequest(this.API.createView, { payload });
      }
    }
};
