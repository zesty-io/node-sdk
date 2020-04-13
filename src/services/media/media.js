"use strict";

const FormData = require("form-data");
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
      updateBin: "/media-manager-service/bin/BIN_ZUID",

      fetchFile: "/media-manager-service/file/FILE_ID",
      fetchFiles: "/media-manager-service/bin/BIN_ZUID/files",
      createFile:
        "/media-storage-service/upload/STORAGE_PROVIDER/STORAGE_LOCATION",
      updateFile: "/media-manager-service/file/FILE_ZUID",
      deleteFile: "/media-manager-service/file/FILE_ZUID"

      // todo
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

  async updateBin(binZUID, data) {
    let payload = this.getFormData(data);

    return await this.patchRequest(
      this.interpolate(this.API.updateBin, {
        BIN_ZUID: binZUID
      }),
      {
        isFormData: true,
        payload
      }
    );
  }

  async getFile(fileZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchFile, {
        FILE_ZUID: fileZUID
      })
    );
  }
  async getFiles(binZUID) {
    return await this.getRequest(
      this.interpolate(this.API.fetchFiles, {
        BIN_ZUID: binZUID
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
      fileName: ""
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

    // When no group is provide set it to the bin
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

    return await this.postRequest(
      this.interpolate(this.API.createFile, {
        STORAGE_PROVIDER: bin.data[0].storage_driver,
        STORAGE_LOCATION: bin.data[0].storage_name
      }),
      {
        isFormData: true,
        payload
      }
    );
  }

  async updateFile(fileZUID, data) {
    if (!fileZUID) {
      throw new Error("Missing required `fileZUID` argument");
    }
    return await this.patchRequest(
      this.interpolate(this.API.updateFile, {
        FILE_ZUID: fileZUID
      }),
      {
        isFormData: true,
        payload: this.getFormData(data)
      }
    );
  }

  async deleteFile(fileZUID) {
    if (!fileZUID) {
      throw new Error("Missing required `fileZUID` argument");
    }
    return await this.deleteRequest(
      this.interpolate(this.API.deleteFile, {
        FILE_ZUID: fileZUID
      })
    );
  }
};
