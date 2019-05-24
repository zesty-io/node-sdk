require("dotenv").config();

const Auth = require("../../src/services/auth");
const Instance = require("../../src/services/instance");
const Account = require("../../src/services/account");
const Media = require("../../src/services/media");

/**
 * Attaches an authed Instance on the test context
 */
module.exports = async t => {
  try {
    const auth = new Auth();
    const session = await auth.login(
      process.env.ZESTY_USER_EMAIL,
      process.env.ZESTY_USER_PASSWORD
    );

    if (session.statusCode != 200) {
      t.log("AUTH FAILED", session);
    }

    t.context.instance = new Instance(
      process.env.ZESTY_INSTANCE_ZUID,
      session.token
    );

    t.context.account = new Account(
      process.env.ZESTY_INSTANCE_ZUID,
      session.token
    );

    t.context.media = new Media(process.env.ZESTY_INSTANCE_ZUID, session.token);
  } catch (error) {
    throw error;
  }
};
