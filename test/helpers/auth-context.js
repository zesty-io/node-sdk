require("dotenv").config();

const Auth = require("../../src/services/auth");
const Instance = require("../../src/services/instance");

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

    if (session.statusCode !== 200) {
      t.log(session);
    }

    t.context.instance = new Instance(
      process.env.ZESTY_INSTANCE_ZUID,
      session.token
    );
  } catch (error) {
    throw error;
  }
};
