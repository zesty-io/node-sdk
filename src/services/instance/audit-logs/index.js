"use strict";

module.exports = {
  API: {
    fetchAuditLogs: "/env/audits",
    fetchAuditLog: "/env/audits/AUDIT_ZUID",
    searchAuditLogs: "/env/audits?AUDIT_SEARCH_PARAMS"
  },
  mixin: superclass =>
    class extends superclass {
      async getAuditLogs() {
        return await this.getRequest(this.interpolate(this.API.fetchAuditLogs));
      }

      async getAuditLog(auditZUID) {
        if (!auditZUID) {
          throw new Error(
            "SDK:Instance:AuditLogs:getAuditLog() missing required `auditZUID` argument"
          );
        }
        return await this.getRequest(
          this.interpolate(this.API.fetchAuditLog, {
            AUDIT_ZUID: auditZUID
          })
        );
      }

      async searchAuditLogs(query) {
        return await this.getRequest(
          this.interpolate(this.API.searchAuditLogs, {
            AUDIT_SEARCH_PARAMS: query
          })
        );
      }
    }
};
