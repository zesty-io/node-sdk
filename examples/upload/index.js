/**
 * Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
 * and loaded via an envrionment variable since this is a private secret
 */
require("dotenv").config({
  path: "../../.env", // Change this path to your .env file location
});

const fs = require("fs");
const path = require("path");
const util = require("util");
const sdk = require("@zesty-io/sdk");

(async function main() {
  const zesty = new sdk(
    process.env.ZESTY_INSTANCE_ZUID,
    process.env.ZESTY_INSTANCE_TOKEN
  );

  const BIN_ZUID = process.env.UPLOAD_BIN_ZUID; // Change this to your media bin ZUID

  const stream = fs.createReadStream(
    path.resolve(__dirname, "./zesty-io-logo.svg") // You can change this to your own file
  );

  const opts = {
    title: "Zesty.io Logo",
    fileName: "/logo.svg", // Note: The file name can be different than uploaded files existing name
  };

  const res = await zesty.media.createFile(BIN_ZUID, stream, opts);

  console.log(util.inspect(res, false, null));
})();
