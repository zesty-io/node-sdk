"use strict";

const Service = require("./service");

module.exports = class Media extends Service {
  constructor(instanceZUID, token, options = {}) {
    super(instanceZUID, token, options);

    this.baseAPI =
      options.mediaAPIURL ||
      process.env.ZESTY_MEDIA_API ||
      `https://svc.zesty.io`;

    this.mediaAPIEndpoints = {
      binsGETAll: "/media-manager-service/site/SITE_ID/bins",
      binsGET: "/media-manager-service/bin/BIN_ID",
      binsPATCH: "/media-manager-service/bin/BIN_ID",
      filesPOST: "/media-storage-service/upload/STORAGE_DRIVER/STORAGE_NAME",
      filesGET: "/media-manager-service/file/FILE_ID",
      filesGETAll: "/media-manager-service/bin/BIN_ID/files",
      filesPATCH: "/media-manager-service/file/FILE_ID",
      filesDELETE: "/media-manager-service/file/FILE_ID",
      groupsGET: "/media-manager-service/group/GROUP_ID",
      groupsGETAll: "/media-manager-service/bin/BIN_ID/groups",
      groupsPOST: "/media-manager-service/group",
      groupsPATCH: "/media-manager-service/group/GROUP_ID",
      groupsDELETE: "/media-manager-service/group/GROUP_ID"
    };
  }
};
