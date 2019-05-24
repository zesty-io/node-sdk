"use strict";

const Service = require("../service");
const Account = require("../account");

module.exports = class Media extends Service {
  constructor(instanceZUID, token, options = {}) {
    super(instanceZUID, token, options);

    this.baseAPI =
      options.mediaAPIURL ||
      process.env.ZESTY_MEDIA_API ||
      `https://svc.zesty.io`;

    this.API = {
      fetchBins: "/media-manager-service/site/SITE_ID/bins",
      fetchBin: "/media-manager-service/bin/BIN_ZUID",
      updateBin: "/media-manager-service/bin/BIN_ZUID"

      // todo
      // filesPOST: "/media-storage-service/upload/STORAGE_DRIVER/STORAGE_NAME",
      // filesGET: "/media-manager-service/file/FILE_ID",
      // filesGETAll: "/media-manager-service/bin/BIN_ZUID/files",
      // filesPATCH: "/media-manager-service/file/FILE_ID",
      // filesDELETE: "/media-manager-service/file/FILE_ID",
      // groupsGET: "/media-manager-service/group/GROUP_ID",
      // groupsGETAll: "/media-manager-service/bin/BIN_ZUID/groups",
      // groupsPOST: "/media-manager-service/group",
      // groupsPATCH: "/media-manager-service/group/GROUP_ID",
      // groupsDELETE: "/media-manager-service/group/GROUP_ID"
    };

    // Needed to support lookup of instance ZID for legacy API support
    if (token) {
      this.account = new Account(instanceZUID, token);
    }
  }

  async getBins() {
    const siteId = await this.account.getSiteId();
    return await this.getRequest(
      this.interpolate(this.API.fetchBins, {
        SITE_ID: siteId
      })
    );
  }
  async getBin(binZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchBin, {
        BIN_ZUID: binZUID
      })
    );
  }

  async updateBin(binZUID, payload) {
    const uri = this.interpolate(this.API.updateBin, { BIN_ZUID: binZUID });
    return await this.patchRequest(uri, {
      isFormData: true,
      payload
    });
  }
};
