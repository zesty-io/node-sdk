"use strict";

module.exports = class Instance {
  constructor(instanceZUID, token, options = {}) {
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
