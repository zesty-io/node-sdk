"use strict";

module.exports = {
  API: {
    fetchSettings: "/env/settings",
    fetchSetting: "/env/settings/SETTINGS_ZUID",
    createSetting: "/env/settings",
    updateSetting: "/env/settings/SETTINGS_ZUID",
    patchSetting: "/env/settings/SETTINGS_ZUID",
    deleteSetting: "/env/settings/SETTINGS_ZUID"
  },
  mixin: superclass =>
    class Setting extends superclass {
      async getSettings() {
        return await this.getRequest(this.API.fetchSettings);
      }

      async getSetting(id) {
        if (!id) {
          throw new Error(
            "SDK:Instance:getSetting() missing required `id` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchSetting, {
            SETTINGS_ZUID: id
          })
        );
      }

      async createSetting(payload){

        if(!payload){
          throw new Error(
            "SDK:Instance:createSetting() missing required `payload` argument"
          );
        }

        return await this.postRequest(
          this.API.createSetting,
          {
            payload
          }
        );
      }

      async updateSetting(id, payload) {
        if (!id) {
          throw new Error(
            "SDK:Instance:updateSetting() missing required `id` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateSetting() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateSetting, {
            SETTINGS_ZUID: id
          }),
          {
            payload
          }
        );
      }

      async patchSetting(id, payload) {
        if (!id) {
          throw new Error(
            "SDK:Instance:patchSetting() missing required `id` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:patchSetting() missing required `payload` argument"
          );
        }
        return await this.patchRequest(
          this.interpolate(this.API.patchSetting, {
            SETTINGS_ZUID: id
          }),
          {
            payload
          }
        );
      }

      async deleteSetting(id) {
        if (!id) {
          throw new Error(
            "SDK:Instance:deleteSetting() missing required `id` argument"
          );
        }
        return await this.deleteRequest(
          this.interpolate(this.API.deleteSetting, {
            SETTINGS_ZUID: id
          })
        );
      }
    }
};
