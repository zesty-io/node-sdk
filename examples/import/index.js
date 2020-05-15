/**
 * Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
 * and loaded via an envrionment variable as this is a private secret
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

  const USER_ZUID = process.env.IMPORT_USER_ZUID; // Change this to your users ZUID
  const MODEL_ZUID = process.env.IMPORT_MODEL_ZUID; // Change this to the model ZUID on your instance

  try {
    const res = await zesty.instance.createItem(MODEL_ZUID, {
      data: {
        field_1: "Hello Test 1", // Change this to your model fields
      },
      web: {
        canonicalTagMode: 1,
        metaLinkText: "Hello Test 1",
        metaTitle: "Meta Title Text",
        metaKeywords: "meta,keyword,list",
        metaDescription: "This is the meta description.",
      },
      meta: {
        contentModelZUID: MODEL_ZUID,
        createdByUserZUID: USER_ZUID,
      },
    });

    console.log(util.inspect(res, false, null));
  } catch (err) {
    console.trace(err);
  }
})();
