"use strict";

module.exports = {
  API: {
    fetchLinks: "/content/links",
    fetchLink: "/content/links/LINK_ZUID",
    createLink: "/content/links",
    updateLink: "/content/links/LINK_ZUID",
    patchLink: "/content/links/LINK_ZUID",
    deleteLink: "/content/links/LINK_ZUID"
  },
  mixin: superclass =>
    class Field extends superclass {
      async fetchLinks() {
        return await this.getRequest(this.API.fetchLinks)
      }

      async fetchLink(linkZUID) {
        if (!linkZUID) {
          throw new Error(
            "SDK:Instance:fetchLink() missing required `linkZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchLink, {
            LINK_ZUID: linkZUID
          })
        );
      }

      async createLink(payload) {
        if(!payload){
          throw new Error(
            "SDK:Instance:createLink() missing required `payload` argument"
          );
        }

        return await this.postRequest(
            this.API.createLink,
            {
              payload
            }
        );
      }

      async updateLink(linkZUID, payload) {
        if (!linkZUID) {
          throw new Error(
            "SDK:Instance:updateLink() missing required `linkZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:updateLink() missing required `payload` argument"
          );
        }
        return await this.putRequest(
          this.interpolate(this.API.updateLink, {
            LINK_ZUID: linkZUID
          }), {
            payload
          }
        );
      }

      async patchLink(linkZUID, payload) {
        if (!linkZUID) {
          throw new Error(
            "SDK:Instance:patchLink() missing required `linkZUID` argument"
          );
        }

        if (!payload) {
          throw new Error(
            "SDK:Instance:patchLink() missing required `payload` argument"
          );
        }
        return await this.patchRequest(
          this.interpolate(this.API.patchLink, {
            LINK_ZUID: linkZUID
          }), {
            payload
          }
        );
      }

      async deleteLink(linkZUID) {
        if (!linkZUID) {
          throw new Error(
            "SDK:Instance:deleteLink() missing required `linkZUID` argument"
          );
        }

        return await this.deleteRequest(
          this.interpolate(this.API.deleteLink, {
            LINK_ZUID: linkZUID
          })
        );
      }
    }
};
