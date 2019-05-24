"use strict";

module.exports = {
  API: {
    fetchModels: "/content/models",
    fetchModel: "/content/models/MODEL_ZUID"
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
    }
};
