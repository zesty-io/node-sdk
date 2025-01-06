"use strict";

module.exports = {
  API: {
    fetchLangs: "/env/langs",
    createLang: "/env/langs",
    updateLang: "/env/langs/LANGUAGE_CODE?action=ACTION",
    deleteLang: "/env/langs/LANGUAGE_CODE?softDelete=DELETE_ACTION"
  },
  mixin: superclass =>
    class Setting extends superclass {
      async fetchLangs() {
        return await this.getRequest(this.API.fetchLangs);
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

      async deleteLang(id, deleteAction) {
        if (!id) {
          throw new Error(
            "SDK:Instance:deleteLang() missing required `id` argument"
          );
        }

        if (!deleteAction) {
            throw new Error(
              "SDK:Instance:deleteLang() missing deleteAction `action` argument"
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
