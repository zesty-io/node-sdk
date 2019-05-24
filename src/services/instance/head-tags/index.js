"use strict";

module.exports = {
  API: {
    getWebHeaders: "/web/headers",
    getHeadTags: "/web/headtags",
    getHeadTag: "/web/headtags/HEADTAG_ZUID"
    // deleteHeadTag: "/web/headtags/HEADTAG_ZUID",
    // updateHeadTag: "/web/headtags/HEADTAG_ZUID",
    // createHeadTag: "/web/headtags"
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
    }
};
