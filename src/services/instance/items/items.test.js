require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

const {
  TEST_MODEL_ZUID,
  TEST_ITEM_ZUID,
  TEST_ITEM_VERSION,
  TEST_PUBLISH_ZUID
} = process.env;
const TEST_ITEM_JSON = JSON.parse(
  fs.readFileSync(`./test/fixtures/${TEST_ITEM_ZUID}.json`).toString()
);

test.beforeEach(authContext);

test("fetchItems:200", async t => {
  const res = await t.context.instance.getItems(TEST_MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("fetchItem:200", async t => {
  const res = await t.context.instance.getItem(TEST_MODEL_ZUID, TEST_ITEM_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.ZUID, TEST_ITEM_ZUID);
  t.is(res.data.meta.contentModelZUID, TEST_MODEL_ZUID);
});
test("getItemPublishings:200", async t => {
  const res = await t.context.instance.getItemPublishings(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].itemZUID, TEST_ITEM_ZUID);
});
test.skip("getItemPublishing:200", async t => {
  const res = await t.context.instance.getItemPublishing(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_PUBLISH_ZUID
  );
  t.is(res.statusCode, 200);
});
test("getItemVersions:200", async t => {
  const res = await t.context.instance.getItemVersions(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
test("getItemVersion:200", async t => {
  const res = await t.context.instance.getItemVersion(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_ITEM_VERSION
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.contentModelZUID, TEST_MODEL_ZUID);
  t.is(res.data.meta.ZUID, TEST_ITEM_ZUID);
  t.is(Number(res.data.meta.version), Number(TEST_ITEM_VERSION));
});
test("createItem:200", async t => {
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const res = await t.context.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.instance.formatPath(title)
    }
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

test("updateItem:200", async t => {
  const res = await t.context.instance.updateItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

test("publishItem:200", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.instance.formatPath(title)
    }
  });

  t.is(created.statusCode, 201);
  t.truthy(created.data.ZUID);

  // Lookup new item
  const found = await t.context.instance.findItem(created.data.ZUID);
  t.is(found.statusCode, 200);
  t.truthy(found.data.length);

  // pluck first record
  const item = found.data[0];

  // Publish new item
  const published = await t.context.instance.publishItem(
    TEST_MODEL_ZUID,
    item.meta.ZUID,
    item.meta.version
  );

  t.is(published.statusCode, 200);
  t.is(published.data.item_zuid, item.meta.ZUID);
  t.is(Number(published.data.version_num), Number(item.meta.version));
});

test("unpublishItem:200", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.instance.formatPath(title)
    }
  });

  t.is(created.statusCode, 201);
  t.truthy(created.data.ZUID);

  // Lookup new item
  const found = await t.context.instance.findItem(created.data.ZUID);
  t.is(found.statusCode, 200);
  t.truthy(found.data.length);

  // pluck first record
  const item = found.data[0];

  // Publish new item
  const published = await t.context.instance.publishItem(
    TEST_MODEL_ZUID,
    item.meta.ZUID,
    item.meta.version
  );

  t.is(published.statusCode, 200);
  t.is(published.data.item_zuid, item.meta.ZUID);
  t.is(Number(published.data.version_num), Number(item.meta.version));

  // Unpublish item
  const unpublished = await t.context.instance.unpublishItem(
    TEST_MODEL_ZUID,
    published.data.item_zuid
  );

  t.is(unpublished.statusCode, 200);
  t.is(unpublished.message, "Entry updated");
});

test("findItem:200", async t => {
  const res = await t.context.instance.findItem(TEST_ITEM_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(typeof res.data[0].web === "object");
  t.truthy(typeof res.data[0].meta === "object");
  t.truthy(typeof res.data[0].data === "object");
  t.is(res.data[0].meta.ZUID, TEST_ITEM_ZUID);
});

// Upsert: update existing item
test("upsertItem:200", async t => {
  const EXISTING_PATH = "node-sdk-updateitem";
  const res = await t.context.instance.upsertItem(
    TEST_MODEL_ZUID,
    EXISTING_PATH,
    TEST_ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

// Upsert: create new item
test("upsertItem:201", async t => {
  const title = `node-sdk:upsertItem:${moment().valueOf()}`;
  const pathPart = t.context.instance.formatPath(title);
  const res = await t.context.instance.upsertItem(TEST_MODEL_ZUID, pathPart, {
    data: {
      title
    },
    meta: {
      contentModelZUID: "6-aa7788-9dhmdf",
      masterZUID: "7-780b5a8-823sn7",
      ZUID: "7-780b5a8-823sn7"
    },
    web: {
      createdByUserZUID: "5-44ccc74-tr1vmph",
      parentZUID: "6-aa7788-9dhmdf",
      pathPart
    }
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});
