"use strict";

module.exports = {
  API: {
    getWebHeaders: "/web/headers",
    getHeadTags: "/web/headtags",
    getHeadTag: "/web/headtags/HEADTAG_ZUID",
    createHeadTag: "/web/headtags",
    updateHeadTag: "/web/headtags/HEADTAG_ZUID",
    patchHeadTag: "/web/headtags/HEADTAG_ZUID",
    deleteHeadTag: "/web/headtags/HEADTAG_ZUID"
  },
  mixin: superclass =>
    class extends superclass {
      async getWebHeaders() {
        return await this.getRequest(this.interpolate(this.API.getWebHeaders));
      }

      async getHeadTags() {
        return await this.getRequest(this.interpolate(this.API.getHeadTags));
      }

      async getHeadTag(headTagZUID) {
        if (!headTagZUID) {
          throw new Error(
            "SDK:Instance:HeadTags:getHeadTag() missing required `headTagZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchAuditLog, {
            HEADTAG_ZUID: headTagZUID
          })
        );
      }

      async createHeadTag(payload) {
        if(!payload){
          throw new Error(
            "SDK:Instance:createHeadTag() missing required `payload` argument"
          );
        }

        return await this.postRequest(
            this.API.createHeadTag,
            {
              payload
            }
        );
      }

      async updateHeadTag(headtagZUID, payload) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:updateHeadTag() missing required `redirectZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateHeadTag() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateHeadTag, {
            HEADTAG_ZUID: headtagZUID
          }), {
            payload
          }
        );
      }

      async patchHeadTag(headtagZUID, payload) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:patchHeadTag() missing required `redirectZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:patchHeadTag() missing required `payload` argument"
          );
        }
        return await this.patchRequest(
          this.interpolate(this.API.patchHeadTag, {
            HEADTAG_ZUID: headtagZUID
          }), {
            payload
          }
        );
      }

      async deleteHeadTag(headtagZUID) {
        if (!redirectZUID) {
          throw new Error(
            "SDK:Instance:patchHeadTag() missing required `redirectZUID` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.deleteHeadTag, {
            HEADTAG_ZUID: headtagZUID
          })
        );
      }
    }
};
