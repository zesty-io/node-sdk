"use strict";

module.exports = {
  API: {
    fetchLangs: "/env/langs?type=TYPE",
    createLang: "/env/langs",
    updateLang: "/env/langs/LANGUAGE_CODE?action=ACTION",
    deleteLang: "/env/langs/LANGUAGE_CODE?softDelete=DELETE_ACTION"
  },
  mixin: superclass =>
    class Setting extends superclass {
      async fetchLangs(type = "") {
        return await this.getRequest(
          this.interpolate(this.API.fetchLangs, {
            TYPE: type
          })
        );
      }

      async createLang(payload){

        if(!payload){
          throw new Error(
            "SDK:Instance:createLang() missing required `payload` argument"
          );
        }

        return await this.postRequest(
          this.API.createLang,
          {
            payload
          }
        );
      }

      async updateLang(id, action) {
        if (!id) {
          throw new Error(
            "SDK:Instance:updateLang() missing required `id` argument"
          );
        }

        if (!action) {
          throw new Error(
            "SDK:Instance:updateLang() missing required `action` argument"
          );
        }

        return await this.putRequest(
          this.interpolate(this.API.updateLang, {
            LANGUAGE_CODE: id,
            ACTION: action
          })
        );
      }

      async deleteLang(id, deleteAction = "false") {
        if (!id) {
          throw new Error(
            "SDK:Instance:deleteLang() missing required `id` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.deleteLang, {
            LANGUAGE_CODE: id,
            DELETE_ACTION: deleteAction
          })
        );
      }
    }
};
