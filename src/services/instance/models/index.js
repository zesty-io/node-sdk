"use strict";

module.exports = {
  API: {
    fetchModels: "/content/models",
    fetchModel: "/content/models/MODEL_ZUID",
    createModel:"/content/models"
  },
  mixin: superclass =>
    class Model extends superclass {
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

      async createModel(payload){

        if (!payload) {
          throw new Error(
            "SDK:Instance:createModel() missing required `payload` argument"
          );
        }

        return await this.postRequest(
          this.API.createModel,
          {
            payload
          }
        );

      }
    }
};
