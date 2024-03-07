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
    publishStylesheet: "/web/stylesheets/STYLESHEET_ZUID/versions/VERSION_NUMBER",
    createStylesheetVariable: "/web/stylesheets/variables",
    fetchStylesheetVariables: "/web/stylesheets/variables",
    fetchStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID",
    updateStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID",
    patchStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID",
    deleteStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID"
  },
  mixin: superclass =>
    class extends superclass {
      validateStylesheet(payload) {
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
              payload.type
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
        this.validateStylesheet(payload);
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
        this.validateStylesheet(payload);
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
      async createStylesheetVariable(payload){
        if (!payload) {
          throw new Error(
            "SDK:Instance:createStylesheetVariable() missing required `payload` argument"
          );
        }

        return await this.postRequest(this.API.createStylesheetVariable, { payload })
      }

      async fetchStylesheetVariables(){
        return await this.getRequest(this.API.fetchStylesheetVariables)
      }

      async fetchStylesheetVariable(variableZUID){
        if (!variableZUID) {
          throw new Error(
            "SDK:Instance:fetchStylesheetVariable() missing required `variableZUID` argument"
          );
        }

        return await this.getRequest(
          this.interpolate(this.API.fetchStylesheetVariable, {
            VARIABLE_ZUID: variableZUID
          })
        );
      }

      async updateStylesheetVariable(variableZUID, payload){
        if (!variableZUID) {
          throw new Error(
            "SDK:Instance:updateStylesheetVariable() missing required `variableZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateStylesheetVariable() missing required `payload` argument"
          );
        }

        return await this.putRequest(
          this.interpolate(this.API.updateStylesheetVariable, {
            VARIABLE_ZUID: variableZUID
          }), {
            payload
          }
        );
      }

      async patchStylesheetVariable(variableZUID, payload){
        if (!variableZUID) {
          throw new Error(
            "SDK:Instance:patchStylesheetVariable() missing required `variableZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:patchStylesheetVariable() missing required `payload` argument"
          );
        }

        return await this.patchRequest(
          this.interpolate(this.API.updateStylesheetVariable, {
            VARIABLE_ZUID: variableZUID
          }), {
            payload
          }
        );
      }

      async deleteStylesheetVariable(variableZUID){
        if (!variableZUID) {
          throw new Error(
            "SDK:Instance:deleteStylesheetVariable() missing required `variableZUID` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.deleteStylesheetVariable, {
            VARIABLE_ZUID: variableZUID
          })
        );
      }
    }
};
