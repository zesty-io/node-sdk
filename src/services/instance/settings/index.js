"use strict";

module.exports = {
  API: {
    fetchSettings: "/env/settings",
    fetchSetting: "/env/settings/SETTINGS_ID"
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
            SETTINGS_ID: id
          })
        );
      }
    }
};
