"use strict";

module.exports = {
  API: {
    fetchModelFields: "/content/models/MODEL_ZUID/fields",
    fetchModelField: "/content/models/MODEL_ZUID/fields/FIELD_ZUID",
    createFieldPath: "/content/models/MODEL_ZUID/fields"
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

      async createField(modelZUID, payload){

        if (!modelZUID) {
          throw new Error(
            "SDK:Instance:createField() missing required `modelZUID` argument"
          );
        }

        if(!payload){
          throw new Error(
            "SDK:Instance:createField() missing required `payload` argument"
          );
        }

        return await this.postRequest(
          this.interpolate(this.API.createFieldPath, {
            MODEL_ZUID: modelZUID,
          }),{
            payload
          }
          
        );
      }
    }
};
