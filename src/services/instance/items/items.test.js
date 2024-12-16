require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const {
  TEST_MODEL_ZUID,
  TEST_ITEM_ZUID,
  TEST_ITEM_VERSION,
  TEST_PUBLISH_ZUID,
} = process.env;
const TEST_ITEM_JSON = JSON.parse(
  fs.readFileSync(`./test/fixtures/${TEST_ITEM_ZUID}.json`).toString()
);

test.before(authContext);

test("fetchItems:200", async (t) => {
  const res = await t.context.sdk.instance.getItems(TEST_MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("fetchItem:200", async (t) => {
  const res = await t.context.sdk.instance.getItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.ZUID, TEST_ITEM_ZUID);
  t.is(res.data.meta.contentModelZUID, TEST_MODEL_ZUID);
});

test("getItemPublishings:200", async (t) => {
  const res = await t.context.sdk.instance.getItemPublishings(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].itemZUID, TEST_ITEM_ZUID);
});

test("getItemPublishing:200", async (t) => {
  const res = await t.context.sdk.instance.getItemPublishing(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_PUBLISH_ZUID
  );
  t.is(res.statusCode, 200);
});

test("getItemVersions:200", async (t) => {
  const res = await t.context.sdk.instance.getItemVersions(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test("getItemVersion:200", async (t) => {
  const allItemVersions = await t.context.sdk.instance.getItemVersions(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(allItemVersions.statusCode, 200);
  t.truthy(Array.isArray(allItemVersions.data));
  t.truthy(allItemVersions.data.length > 0);

  const res = await t.context.sdk.instance.getItemVersion(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    allItemVersions.data[0].meta.version
  );

  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.contentModelZUID, TEST_MODEL_ZUID);
  t.is(res.data.meta.ZUID, TEST_ITEM_ZUID);
  t.is(Number(res.data.meta.version), Number(allItemVersions.data[0].meta.version));
});

test.serial("createItem:201", async (t) => {
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title,
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title),
    }
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  // Delete item
  const newItemZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    newItemZUID
  );

  t.is(res.statusCode, 200);
});

test.serial("updateItem:200", async (t) => {
  const res = await t.context.sdk.instance.updateItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_ITEM_JSON
  );
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

test.serial("patchItem:200", async (t) => {
  const title = `node-sdk_patchItem_${moment().valueOf()}`
  const res = await t.context.sdk.instance.patchItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    {
      "data": {
        "title": title
      }
    }
  );
  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

test.serial("publishItem:201", async (t) => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title,
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title),
    }
  });

  t.is(created.statusCode, 201);
  t.truthy(created.data.ZUID);

  // Lookup new item
  const found = await t.context.sdk.instance.findItem(created.data.ZUID);
  t.is(found.statusCode, 200);
  t.truthy(found.data.length);

  // pluck first record
  const item = found.data[0];

  // Publish new item
  const published = await t.context.sdk.instance.publishItem(
    TEST_MODEL_ZUID,
    item.meta.ZUID,
    item.meta.version
  );

  t.is(published.statusCode, 201);
  t.is(published.data.itemZUID, item.meta.ZUID);
  t.is(Number(published.data.version), Number(item.meta.version));

  // Delete item
  const newItemZUID = created.data.ZUID;

  const deleted = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    newItemZUID
  );

  t.is(deleted.statusCode, 200);
});

test("publishItems:200", async (t) => {
  const res = await t.context.sdk.instance.getItems(TEST_MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);

  const responses = await t.context.sdk.instance.publishItems(res.data);
  t.truthy(Array.isArray(responses));

  // did we get back the same amount of responses as the total items on the model
  t.is(responses.length, res.data.length);
});

test("unpublishItem:200", async (t) => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title,
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title),
    }
  });

  t.is(created.statusCode, 201);
  t.truthy(created.data.ZUID);

  // Lookup new item
  const found = await t.context.sdk.instance.findItem(created.data.ZUID);
  t.is(found.statusCode, 200);
  t.truthy(found.data.length);

  // pluck first record
  const item = found.data[0];

  // Publish new item
  const published = await t.context.sdk.instance.publishItem(
    TEST_MODEL_ZUID,
    item.meta.ZUID,
    item.meta.version,
    "now",
    moment().add(20, 's')
  );

  t.is(published.statusCode, 201);
  t.is(published.data.itemZUID, item.meta.ZUID);
  t.is(Number(published.data.version), Number(item.meta.version));

  // Unpublish item
  const unpublished = await t.context.sdk.instance.unpublishItem(
    TEST_MODEL_ZUID,
    published.data.itemZUID,
    published.data.ZUID
  );

  t.is(unpublished.statusCode, 200);

  // Delete item
  const newItemZUID = created.data.ZUID;

  const deleted = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    newItemZUID
  );

  t.is(deleted.statusCode, 200);
});

test("findItem:200", async (t) => {
  const res = await t.context.sdk.instance.findItem(TEST_ITEM_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(typeof res.data[0].web === "object");
  t.truthy(typeof res.data[0].meta === "object");
  t.truthy(typeof res.data[0].data === "object");
  t.is(res.data[0].meta.ZUID, TEST_ITEM_ZUID);
});

// Upsert: update existing item
test("upsertItem:200", async (t) => {
  const EXISTING_PATH = "nodesdktest";
  const res = await t.context.sdk.instance.upsertItem(
    TEST_MODEL_ZUID,
    EXISTING_PATH,
    {
      "data": {
        "title": EXISTING_PATH
      },
      "meta": {
        "masterZUID": "7-fed58fc7cd-kskgwm"
      },
      "web": {
        "pathPart": `node-sdk-test-model-${moment().valueOf()}`,
      }
    }
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

// Upsert: create new item
test("upsertItem:201", async (t) => {
  const title = `node-sdk:upsertItem:${moment().valueOf()}`;
  const pathPart = t.context.sdk.instance.formatPath(title);
  let res = await t.context.sdk.instance.upsertItem(
    TEST_MODEL_ZUID,
    pathPart,
    {
      data: {
        title,
      },
      meta: {
        contentModelZUID: "6-aa7788-9dhmdf",
        masterZUID: "7-780b5a8-823sn7",
        ZUID: "7-780b5a8-823sn7",
      },
      web: {
        createdByUserZUID: "5-44ccc74-tr1vmph",
        pathPart,
      },
    }
  );

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  // Delete item
  const newItemZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    newItemZUID
  );

  t.is(res.statusCode, 200);
});

test("deleteItem:200", async (t) => {
  const title = `node-sdk:deleteItem:${moment().valueOf()}`;
  let res = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title,
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title),
    },
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);

  const newItemZUID = res.data.ZUID;

  res = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    newItemZUID
  );

  t.is(res.statusCode, 200);
});