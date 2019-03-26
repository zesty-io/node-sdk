require("dotenv").config();

// Your ZESTY_INSTANCE_TOKEN should be stored outside of your codebase
// and loaded via an envrionment variable since this is a private secret
const ZESTY_INSTANCE_TOKEN = process.env.ZESTY_INSTANCE_TOKEN;
const ZESTY_INSTANCE_ZUID = process.env.ZESTY_INSTANCE_ZUID;

const sdk = require("@zesty-io/sdk");
const zesty = new sdk(ZESTY_INSTANCE_ZUID, ZESTY_INSTANCE_TOKEN);

const USER_ZUID = "5-5fd4c55-7ndknl";
const MODEL_ZUID = "6-522a74-nhfdbd";

const res = await zesty.instance.createItem(MODEL_ZUID, {
  data: {
    field1: "Hello Test 1",
    field2: "Hello Test 2"
  },
  web: {
    canonicalTagMode: 1,
    metaLinkText: "Hello Test 1",
    metaTitle: "Meta Title Text",
    metaKeywords: "meta,keyword,list",
    metaDescription: "This is the meta description."
  },
  meta: {
    contentModelZUID: MODEL_ZUID,
    createdByUserZUID: USER_ZUID
  }
});

console.log(util.inspect(res, false, null));
