"use strict";

module.exports = {
  API: {
    fetchStylesheets: "/web/stylesheets",
    fetchStylesheet: "/web/stylesheets/STYLESHEET_ZUID",
    // stylesheetsGETVersions: "/web/stylesheets/STYLESHEET_ZUID/versions",
    // stylesheetsGETVersion: "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER",
    createStylesheet: "/web/stylesheets",
    updateStylesheet: "/web/stylesheets/STYLESHEET_ZUID",
    deleteStylesheet: "/web/stylesheets/STYLESHEET_ZUID",
    publishStylesheet:
      "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER"
  },
  mixin: superclass =>
    class extends superclass {
      validate(payload) {
        const supportedTypes = [
          "text/css",
          "text/less",
          "text/scss",
          "text/sass"
        ];

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
              pyaload.type
            }) property is not supported. Allowed types are ${supportedTypes.join(
              ", "
            )}`
          );
        }
      }

      async getStylesheets() {
        return await this.getRequest(this.API.fetchStylesheets);
      }
      async getStylesheet(stylesheetZUID) {
        return await this.getRequest(
          this.interpolate(this.API.fetchStylesheet, {
            STYLESHEET_ZUID: stylesheetZUID
          })
        );
      }
      async updateStylesheet(stylesheetZUID, payload) {
        this.validate(payload);
        return await this.putRequest(
          this.interpolate(this.API.updateStylesheet, {
            STYLESHEET_ZUID: stylesheetZUID
          }),
          {
            payload
          }
        );
      }
      async createStylesheet(payload) {
        this.validate(payload);
        return await this.postRequest(this.API.createStylesheet, { payload });
      }
      async deleteStylesheet(stylesheetZUID) {
        return await this.deleteRequest(
          this.interpolate(this.API.deleteStylesheet, {
            STYLESHEET_ZUID: stylesheetZUID
          })
        );
      }
      async publishStylesheet(stylesheetZUID, version) {
        return await this.postRequest(
          this.interpolate(this.API.publishStylesheet, {
            STYLESHEET_ZUID: stylesheetZUID,
            VERSION_NUMBER: version
          })
        );
      }
    }
};
