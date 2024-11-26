require("dotenv").config();

const SDK = require("../../src/sdk");

/**
 * Attaches an authenticated SDK on the test context
 */
module.exports = async (t) => {
  try {
    let token;

    if (process.env.ZESTY_INSTANCE_TOKEN) {
      token = process.env.ZESTY_INSTANCE_TOKEN;
    } else {
      const auth = new SDK.Auth();
      const session = await auth.login(
        process.env.ZESTY_USER_EMAIL,
        process.env.ZESTY_USER_PASSWORD
      );

      if (!session.token) {
        throw new Error(JSON.stringify(session));
      }

      token = session.token;
    }

    t.context.sdk = new SDK(process.env.ZESTY_INSTANCE_ZUID, token);
  } catch (error) {
    throw error;
  }
};
