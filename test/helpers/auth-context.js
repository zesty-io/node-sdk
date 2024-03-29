require("dotenv").config();

const SDK = require("../../src/sdk");

/**
 * Attaches an authenticated SDK on the test context
 */
module.exports = async t => {
  try {
    const auth = new SDK.Auth();
    const session = await auth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    );

    if (!session.token) {
      throw new Error(JSON.stringify(session));
    }

    t.context.sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID, session.token);
  } catch (error) {
    throw error;
  }
};
