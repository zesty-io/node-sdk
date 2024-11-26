/**
 * Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
 * and loaded via an environment variable as this is a private secret
 */
require("dotenv").config({
  path: "../../.env", // Change this path to your .env file location
});

const util = require("util");
const moment = require("moment");
const sdk = require("@zesty-io/sdk");

(async function main() {
  const zesty = new sdk(
    process.env.ZESTY_INSTANCE_ZUID,
    process.env.ZESTY_INSTANCE_TOKEN
  );

  const USER_ZUID = process.env.IMPORT_USER_ZUID; // Change this to your users ZUID
  const MODEL_ZUID = process.env.IMPORT_MODEL_ZUID; // Change this to the model ZUID on your instance

  try {
    const createItemRes = await zesty.instance.createItem(MODEL_ZUID, {
      data: {
        title: "Hello Test 1", // Change this to your model fields
      },
      web: { // Change meta and path data
        canonicalTagMode: 1,
        metaLinkText: "Hello Test 1",
        metaTitle: "Meta Title Text",
        metaKeywords: "meta,keyword,list",
        metaDescription: "This is the meta description.",
        pathPart: "/hello-test-1"
      },
      meta: {
        contentModelZUID: MODEL_ZUID,
        createdByUserZUID: USER_ZUID,
      },
    });

    const getItemRes = await zesty.instance.findItem(createItemRes.data.ZUID);
    const item = getItemRes.data[0];

    const publishItemRes = await zesty.instance.publishItem(
      MODEL_ZUID,
      item.meta.ZUID,
      item.meta.version
    );

    console.log(util.inspect(publishItemRes, false, null));
  } catch (err) {
    console.trace(err);
  }
})();
