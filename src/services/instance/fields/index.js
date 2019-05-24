"use strict";

module.exports = {
  API: {
    fetchModelFields: "/content/models/MODEL_ZUID/fields",
    fetchModelField: "/content/models/MODEL_ZUID/fields/FIELD_ZUID"
  },
  mixin: superclass =>
    class Field extends superclass {
      async getModelFields(modelZUID) {
        if (!modelZUID) {
          throw new Error(
            "SDK:Instance:getModelFields() missing required `modelZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchModelFields, {
            MODEL_ZUID: modelZUID
          })
        );
      }

      async getModelField(modelZUID, fieldZUID) {
        if (!modelZUID) {
          throw new Error(
            "SDK:Instance:getModelField() missing required `modelZUID` argument"
          );
        }
        if (!fieldZUID) {
          throw new Error(
            "SDK:Instance:getModelField() missing required `fieldZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchModelField, {
            MODEL_ZUID: modelZUID,
            FIELD_ZUID: fieldZUID
          })
        );
      }
    }
};
