"use strict";

module.exports = {
  API: {
    getViews: "/web/views",
    getView: "/web/views/VIEW_ZUID"
    // viewsGETVersions: "/web/views/VIEW_ZUID/versions",
    // viewsGETVersion: "/web/views/VIEW_ZUID/versions/VERSION_NUMBER",
    // viewsPOST: "/web/views",
    // viewsPUT: "/web/views/VIEW_ZUID",
    // viewsPUTPublish: "/web/views/VIEW_ZUID?action=publish",
  },
  mixin: superclass =>
    class extends superclass {
      async getViews() {
        return await this.getRequest(this.API.getViews);
      }
      async getView(viewZUID) {
        return await this.getRequest(
          this.interpolate(this.API.getView, {
            VIEW_ZUID: viewZUID
          })
        );
      }
    }
};
