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
    const res = await zesty.instance.patchItem(MODEL_ZUID, ITEM_ZUID, {
      data: {
        "field_1": "Hello Test 1", // Change this to your item fields
      },
    });

    console.log(util.inspect(res, false, null));
  } catch (err) {
    console.trace(err);
  }
})();
