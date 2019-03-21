"use strict";

const request = require("request");

module.exports = class Request {
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
        "When extending the Request class you must provide a `baseAPI` property which forms the base, protocol://domain/path, of every API request."
      );
    }

    const URL = `${this.baseAPI}${uri}`;

    return new Promise((resolve, reject) => {
      const opts = {
        method: params.method,
        uri: URL,
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
        // this.logResponse(response);

        if (error) {
          // this.logError(error);
          reject({
            statusCode: response.statusCode,
            error
          });
        }

        // Add response status code
        const enrichedResponse = { statusCode: response.statusCode, ...body };

        if (response.statusCode === params.successCode) {
          resolve(
            params.responseFormatter
              ? params.responseFormatter(enrichedResponse)
              : enrichedResponse
          );
        } else {
          // this.logError(enrichedResponse);
          reject(
            params.responseFormatter
              ? params.responseFormatter(enrichedResponse)
              : enrichedResponse
          );
        }
      });
    });
  }
};
