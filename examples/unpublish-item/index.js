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

  const MODEL_ZUID = process.env.IMPORT_MODEL_ZUID; // Change this to the model ZUID on your instance
  const ITEM_ZUID = process.env.IMPORT_ITEM_ZUID; // Change this to the item ZUID on your instance

  try {
    const getItemRes = await zesty.instance.findItem(ITEM_ZUID);
    const item = getItemRes.data[0];

    const publishItemRes = await zesty.instance.publishItem(
      MODEL_ZUID,
      item.meta.ZUID,
      item.meta.version
    );

    const unpublishItemRes = await zesty.instance.unpublishItem(
      MODEL_ZUID,
      publishItemRes.data.itemZUID,
      publishItemRes.data.ZUID
    );

    console.log(util.inspect(unpublishItemRes, false, null));
  } catch (err) {
    console.trace(err);
  }
})();
