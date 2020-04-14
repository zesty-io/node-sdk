"use strict";

const fetch = require("node-fetch");
const cookie = require("cookie");

module.exports = class Service {
  constructor(baseAPI, token) {
    if (!baseAPI) {
      throw new Error(
        "SDK:Service:constructor() missing required `baseAPI` argument on instantiation"
      );
    }

    if (!token) {
      throw new Error(
        "SDK:Service:constructor() missing required `token` argument on instantiation. All API requests have to be authenticated"
      );
    }

    this.baseAPI = baseAPI;
    this.token = token;

    this.cookieName = process.env.ZESTY_COOKIE || "APP_SID";
  }

  interpolate(url, replacementObject) {
    if (!url) {
      throw new Error("A url must be provided to interpolate");
    }
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
      ...params,
      method: "GET",
    });
  }

  async deleteRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request(uri, {
      ...params,
      method: "DELETE",
    });
  }

  async putRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request(uri, {
      ...params,
      method: "PUT",
    });
  }

  async postRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 201;
    }

    return this.request(uri, {
      ...params,
      method: "POST",
    });
  }

  async patchRequest(uri, params = {}) {
    if (!params.hasOwnProperty("successCode")) {
      params.successCode = 200;
    }

    return this.request(uri, {
      ...params,
      method: "PATCH",
    });
  }

  request(path, params) {
    if (!path) {
      throw new Error("Missing required `path`. Can not make request.");
    }

    const uri = `${this.baseAPI}${path}`;
    const opts = {
      method: params.method,
      headers: {},
    };

    if (params.payload) {
      if (params.isFormData) {
        opts.body = params.payload;
        opts.headers = params.payload.getHeaders();
      } else {
        opts.body = JSON.stringify(params.payload);
        opts.headers["Content-Type"] = "application/json";
      }
    }

    // DEPRECATED
    if (params.usesCookieAuth) {
      opts.headers["Cookie"] = cookie.serialize(this.cookieName, this.token);
    }

    // DEPRECATED
    if (params.usesXAuthHeader) {
      opts.headers["X-Auth"] = this.token;
    }

    // Default authorization strategy
    opts.headers["Authorization"] = `Bearer ${this.token}`;

    return fetch(uri, opts)
      .then((res) => {
        return res.json().then((data) => {
          if (res.status != 200 && res.status != 201) {
            console.error(data);
          }
          return {
            statusCode: res.status,
            ...data,
          };
        });
      })
      .then((json) => {
        return params.responseFormatter ? params.responseFormatter(json) : json;
      });
  }
};
