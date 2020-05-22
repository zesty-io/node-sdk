require("dotenv").config();

const test = require("ava");
const authContext = require("../../../../test/helpers/auth-context");

test.beforeEach(authContext);

test.serial("getAuditLogs:200", async t => {
  const res = await t.context.sdk.instance.getAuditLogs();

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("getAuditLog:200", async t => {
  const res = await t.context.sdk.instance.getAuditLog(
    process.env.TEST_AUDIT_LOG_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.ZUID, process.env.TEST_AUDIT_LOG_ZUID);
});

// tests audit log retrieval without an audit ZUID 
test.serial("getAuditLog no audit ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getAuditLog();  
  } catch (err) {
    t.is(err.message, "SDK:Instance:AuditLogs:getAuditLog() missing required `auditZUID` argument") 
  }
});

test.serial("searchAuditLogs:200", async t => {
  const res = await t.context.sdk.instance.searchAuditLogs(
    "?limit=5&order=created&dir=desc&action=4"
  );

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
