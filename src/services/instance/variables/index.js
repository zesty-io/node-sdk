"use strict";

module.exports = {
  API: {
    createStylesheetVariable: "/web/stylesheets/variables",
    fetchStylesheetVariables: "/web/stylesheets/variables",
    fetchStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID",
    updateStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID",
    deleteStylesheetVariable: "/web/stylesheets/variables/VARIABLE_ZUID"
  },
  mixin: superclass =>
    class extends superclass {
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
