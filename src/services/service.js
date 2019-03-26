"use strict";

const request = require("request");

module.exports = class Service {
  constructor(instanceZUID, token, options = {}) {
    if (!instanceZUID) {
      throw new Error(
        "Service is missing required `instanceZUID` argument on instantiation"
      );
    }

    if (!token) {
      throw new Error(
        "Service is missing required `token` argument on instantiation. All API requests have to be authenticated"
      );
    }

    this.instanceZUID = instanceZUID;
    this.token = token;
    this.options = options;
  }

  interpolate(url, replacementObject) {
    for (const key in replacementObject) {
      url = url.replace(key, replacementObject[key]);
    }

    return url;
  }

  async getRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request(uri, {
      method: "GET",
      ...params
    });
  }

  async deleteRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request({
      method: "DELETE",
      ...params
    });
  }

  async putRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request({
      method: "PUT",
      ...params
    });
  }

  async postRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 201;
    }

    return this.request({
      method: "POST",
      ...params
    });
  }

  async patchRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request({
      method: "PATCH",
      ...params
    });
  }

  request(uri, params) {
    if (!this.baseAPI) {
      throw new Error(
        "When extending the Request class you must set a `baseAPI` property which forms the base, protocol://domain/path, of every API request."
      );
    }
    if (!this.token) {
      throw new Error(
        "When extending the Request class you must set a `token` property. All API request are authenticated."
      );
    }

    return new Promise((resolve, reject) => {
      const opts = {
        method: params.method,
        uri: `${this.baseAPI}${uri}`,
        json: true,
        auth: {
          bearer: this.token
        }
      };

      if (params.usesXAuthHeader) {
        opts.headers = {
          "X-Auth": this.token
        };
      } else {
        opts.auth = {
          bearer: this.token
        };
      }

      if (params.payload) {
        if (params.isFormPayload) {
          opts.formData = params.payload;
        } else {
          opts.body = params.payload;
        }
      }

      // Use the "request" module to make request
      request(opts, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          // Add response status code
          const enrichedBody = { statusCode: response.statusCode, ...body };
          const formattedBody = params.responseFormatter
            ? params.responseFormatter(enrichedBody)
            : enrichedBody;

          resolve(formattedBody);
        }
      });
    });
  }
};
