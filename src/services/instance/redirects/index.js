"use strict";

module.exports = {
  API: {
    fetchRedirects: "/web/redirects",
    fetchRedirect: "/web/redirects/REDIRECT_ZUID",
    createRedirect: "/web/redirects",
    updateRedirect: "/web/redirects/REDIRECT_ZUID",
    patchRedirect: "/web/redirects/REDIRECT_ZUID",
    deleteRedirect: "/web/redirects/REDIRECT_ZUID"
  },
  mixin: superclass =>
    class Redirect extends superclass {
      async fetchRedirects() {
        return await this.getRequest(this.API.fetchRedirects)
      }

      async fetchRedirect(redirectZUID) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:fetchRedirect() missing required `redirectZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchRedirect, {
            REDIRECT_ZUID: redirectZUID
          })
        );
      }

      async createRedirect(payload) {
        if(!payload){
          throw new Error(
            "SDK:Instance:createRedirect() missing required `payload` argument"
          );
        }

        return await this.postRequest(
            this.API.createRedirect,
            {
              payload
            }
        );
      }

      async updateRedirect(redirectZUID, payload) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:updateRedirect() missing required `redirectZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateRedirect() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateRedirect, {
            REDIRECT_ZUID: redirectZUID
          }), {
            payload
          }
        );
      }

      async patchRedirect(redirectZUID, payload) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:patchRedirect() missing required `redirectZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:patchRedirect() missing required `payload` argument"
          );
        }
        return await this.patchRequest(
          this.interpolate(this.API.patchRedirect, {
            REDIRECT_ZUID: redirectZUID
          }), {
            payload
          }
        );
      }

      async deleteRedirect(redirectZUID) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:deleteRedirect() missing required `redirectZUID` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.deleteRedirect, {
            REDIRECT_ZUID: redirectZUID
          })
        );
      }
    }
};
