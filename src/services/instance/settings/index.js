"use strict";

module.exports = {
  API: {
    fetchSettings: "/env/settings",
    fetchSetting: "/env/settings/SETTINGS_ZUID"
  },
  mixin: superclass =>
    class Setting extends superclass {
      async getSettings() {
        return await this.getRequest(this.API.fetchSettings);
      }

      async getSetting(ZUID) {
        if (!ZUID) {
          throw new Error(
            "SDK:Instance:getSetting() missing required `ZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchSetting, {
            SETTINGS_ZUID: ZUID
          })
        );
      }
    }
};
