/**
 * Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
 * and loaded via an environment variable as this is a private secret
 */
require("dotenv").config({
  path: "../../.env", // Change this path to your .env file location
});

const util = require("util");
const sdk = require("@zesty-io/sdk");

(async function main() {
  const zesty = new sdk(
    process.env.ZESTY_INSTANCE_ZUID,
    process.env.ZESTY_INSTANCE_TOKEN
  );

  try {
    const res = await zesty.instance.createRedirect({
      path: "/redirect-to-zesty", // Change this to the path of your redirect
      targetType: "external", // Change this to the target type of your redirect
      target: "https://www.zesty.io/", // Change this to the target of your redirect
      code: 301 // Change this to the status code of the redirect (301 or 302)
    });

    console.log(util.inspect(res, false, null));
  } catch (err) {
    console.trace(err);
  }
})();
