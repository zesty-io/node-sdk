"use strict";

const FormData = require("form-data");
const Service = require("../service");
const Account = require("../account");

module.exports = class Media extends Service {
  constructor(instanceZUID, token, options = {}) {
    const baseAPI =
      options.mediaAPIURL ||
      process.env.ZESTY_MEDIA_API ||
      `https://svc.zesty.io`;

    super(baseAPI, token);

    this.API = {
      fetchBin: "/media-manager-service/bin/BIN_ZUID",
      fetchBins: "/media-manager-service/site/SITE_ID/bins",
      updateBin: "/media-manager-service/bin/BIN_ZUID",

      fetchFile: "/media-manager-service/file/FILE_ZUID",
      fetchFiles: "/media-manager-service/bin/BIN_ZUID/files",
      createFile:
        "/media-storage-service/upload/STORAGE_PROVIDER/STORAGE_LOCATION",
      updateFile: "/media-manager-service/file/FILE_ZUID",
      deleteFile: "/media-manager-service/file/FILE_ZUID",

      fetchGroup: "/media-manager-service/group/GROUP_ZUID",
      fetchGroups: "/media-manager-service/bin/BIN_ZUID/groups",
      createGroup: "/media-manager-service/group",
      updateGroup: "/media-manager-service/group/GROUP_ZUID",
      deleteGroup: "/media-manager-service/group/GROUP_ZUID",
    };

    // Needed to support lookup of instance ZUID for legacy API support
    if (token) {
      this.account = new Account(instanceZUID, token);
    }
  }

  getFormData(data) {
    const payload = new FormData();
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        payload.append(prop, data[prop]);
      }
    }

    return payload;
  }

  async getBins() {
    const siteId = await this.account.getSiteId();

    if (!siteId) {
      throw new Error("Failed to resolve instance ZUID");
    }

    return this.getRequest(
      this.interpolate(this.API.fetchBins, {
        SITE_ID: siteId,
      })
    );
  }
  async getBin(binZUID) {
    return this.getRequest(
      this.interpolate(this.API.fetchBin, {
        BIN_ZUID: binZUID,
      })
    );
  }

  async updateBin(binZUID, data) {
    let payload = this.getFormData(data);

    return this.patchRequest(
      this.interpolate(this.API.updateBin, {
        BIN_ZUID: binZUID,
      }),
      {
        isFormData: true,
        payload,
      }
    );
  }

  async getFile(fileZUID) {
    return this.getRequest(
      this.interpolate(this.API.fetchFile, {
        FILE_ZUID: fileZUID,
      })
    );
  }
  async getFiles(binZUID) {
    return this.getRequest(
      this.interpolate(this.API.fetchFiles, {
        BIN_ZUID: binZUID,
      })
    );
  }

  /**
   *
   * @param {*} binZUID
   * @param {*} stream Blob @see https://developer.mozilla.org/en-US/docs/Web/API/Blob
   * @param {*} JSON {
   *  group_id: ZUID
   *  user_id: ZUID
   *  title: String
   *  filename: String
   * }
   */
  async createFile(
    binZUID,
    stream,
    opts = {
      groupZUID,
      userZUID,
      contentType: "",
      title: "",
      fileName: "",
    }
  ) {
    if (!binZUID) {
      throw new Error("Missing required `binZUID` argument");
    }
    if (!stream) {
      throw new Error("Missing required `stream` argument");
    }

    const bin = await this.getBin(binZUID);

    if (!bin || !Array.isArray(bin.data) || !bin.data[0]) {
      throw new Error(`We could not find the requested bin ${binZUID}`);
    }

    // Media service expects a multpart/form-data body
    const payload = new FormData();
    payload.append("bin_id", binZUID);
    payload.append("file", stream);

    // When no group is provided set it to the bin
    if (opts.groupZUID) {
      payload.append("group_id", opts.groupZUID);
    } else {
      payload.append("group_id", binZUID);
    }

    if (opts.userZUID) {
      payload.append("user_id", opts.userZUID);
    }
    if (opts.title) {
      payload.append("title", opts.title);
    }
    if (opts.fileName) {
      payload.append("filename", opts.fileName);
    }

    return this.postRequest(
      this.interpolate(this.API.createFile, {
        STORAGE_PROVIDER: bin.data[0].storage_driver,
        STORAGE_LOCATION: bin.data[0].storage_name,
      }),
      {
        isFormData: true,
        payload,
      }
    );
  }

  async updateFile(fileZUID, data) {
    if (!fileZUID) {
      throw new Error("Missing required `fileZUID` argument");
    }
    return this.patchRequest(
      this.interpolate(this.API.updateFile, {
        FILE_ZUID: fileZUID,
      }),
      {
        isFormData: true,
        payload: this.getFormData(data),
      }
    );
  }

  async deleteFile(fileZUID) {
    if (!fileZUID) {
      throw new Error("Missing required `fileZUID` argument");
    }
    return this.deleteRequest(
      this.interpolate(this.API.deleteFile, {
        FILE_ZUID: fileZUID,
      })
    );
  }

  async getGroup(groupZUID) {
    return this.getRequest(
      this.interpolate(this.API.fetchGroup, {
        GROUP_ZUID: groupZUID,
      })
    );
  }

  async getGroups(binZUID) {
    return this.getRequest(
      this.interpolate(this.API.fetchGroups, {
        BIN_ZUID: binZUID,
      })
    );
  }

  async createGroup(
    payload = {
      name: "",
      binZUID,
      groupZUID,
    }
  ) {
    if (!payload.binZUID) {
      throw new Error("Missing required `payload.binZUID` argument");
    }

    return this.postRequest(this.API.createGroup, {
      payload: {
        name: payload.name,
        bin_id: payload.binZUID,
        group_id: payload.groupZUID,
      },
    });
  }

  async updateGroup(
    groupZUID,
    payload = {
      name: "",
    }
  ) {
    if (!groupZUID) {
      throw new Error("Missing required `groupZUID` argument");
    }
    if (!payload.name) {
      throw new Error("Missing required `payload.name` argument");
    }

    return this.patchRequest(
      this.interpolate(this.API.updateGroup, {
        GROUP_ZUID: groupZUID,
      }),
      {
        payload: {
          name: payload.name,
          bin_id: payload.binZUID,
          group_id: payload.groupZUID,
        },
      }
    );
  }

  async deleteGroup(groupZUID) {
    if (!groupZUID) {
      throw new Error("Missing required `groupZUID` argument");
    }
    return this.deleteRequest(
      this.interpolate(this.API.deleteGroup, {
        GROUP_ZUID: groupZUID,
      })
    );
  }
};
