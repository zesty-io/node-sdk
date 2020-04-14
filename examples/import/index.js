/**
 * Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
 * and loaded via an envrionment variable since this is a private secret
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

  const USER_ZUID = "5-5fd4c55-7ndknl"; // Change this to your users ZUID
  const MODEL_ZUID = "6-c6ecf28ba3-n7g1qx"; // Change this to the model ZUID on your instance

  const res = await zesty.instance.createItem(MODEL_ZUID, {
    data: {
      field_1: "Hello Test 1", // Change this to your models field
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
})();
