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

test.serial("fetchItems:200", async t => {
  const res = await t.context.sdk.instance.getItems(TEST_MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// test items retrieval without specifying model ZUID
test.serial("getItems with no modelZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItems();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItems() missing required `modelZUID` argument");
  }
})

test.serial("fetchItem:200", async t => {
  const res = await t.context.sdk.instance.getItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(typeof res.data === "object");
  t.is(res.data.meta.ZUID, TEST_ITEM_ZUID);
  t.is(res.data.meta.contentModelZUID, TEST_MODEL_ZUID);
});

// test single item retrieval without specifying a model ZUID
test.serial("getItem with no model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItem() missing required `modelZUID` argument");
  }
});

// test single item retrieval without specifying an item ZUID
test.serial("getItem with no item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItem(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItem() missing required `itemZUID` argument");
  }
});

test.serial("getItemPublishings:200", async t => {
  const res = await t.context.sdk.instance.getItemPublishings(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].itemZUID, TEST_ITEM_ZUID);
});

// test item publishings retrieval without model ZUID
test.serial("getItemPublishings with no model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemPublishings();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemPublishings() missing required `modelZUID` argument");
  }
});

// test item publishings retrieval without item ZUID
test.serial("getItemPublishings with no item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemPublishings(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemPublishings() missing required `itemZUID` argument");
  }
});

test.serial("getItemPublishing:200", async t => {
  const res = await t.context.sdk.instance.getItemPublishing(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_PUBLISH_ZUID
  );
  t.is(res.statusCode, 200);
});

//  test item publishing without a model ZUID
test.serial("getItemPublishing with no model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemPublishing();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemPublishing() missing required `modelZUID` argument");
  }
  
});

//  test item publishing without an item ZUID
test.serial("getItemPublishing with no itemZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemPublishing(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemPublishing() missing required `itemZUID` argument");
  }
});

//  test item publishing without a publish ZUID
test.serial("getItemPublishing with no publishZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemPublishing(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemPublishing() missing required `publishZUID` argument");
  }
})

test.serial("getItemVersions:200", async t => {
  const res = await t.context.sdk.instance.getItemVersions(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// test item versions retrieval without specifying a model ZUID
test.serial("getItemVersions without model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemVersions();
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemVersions() missing required `modelZUID` argument");
  }
});

// test item versions retrieval without specifying an item ZUID
test.serial("getItemVersions without item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemVersions(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemVersions() missing required `itemZUID` argument");
  }
});

test.serial("getItemVersion:200", async t => {
  const res = await t.context.sdk.instance.getItemVersion(
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

// test item version retrieval without specifying a model ZUID
test.serial("getItemVersion with missing model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemVersion();  
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemVersion() missing required `modelZUID` argument");
  }
});

// test item version retrieval without specifying an item ZUID
test.serial("getItemVersion with missing item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.getItemVersion(
      TEST_MODEL_ZUID
    );  
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemVersion() missing required `itemZUID` argument");
  }
});

// test item version retrieval without specifying a version
test.serial("getItemVersion with missing version", async t => {
  try {
    const res = await t.context.sdk.instance.getItemVersion(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    );  
  } catch (err) {
    t.is(err.message, "SDK:Instance:getItemVersion() missing required `version` argument");
  }
});

test.serial("createItem:200", async t => {
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const res = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
    }
  });

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

// test item creation without a model ZUID
test.serial("createItem with missing model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.createItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:createItem() missing required `modelZUID` argument");
  }
});

// test item creation without a payload
test.serial("createItem with missing payload", async t => {
  try {
    const res = await t.context.sdk.instance.createItem(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:createItem() missing required `payload` argument");
  }
});

test.serial("updateItem:200", async t => {
  const res = await t.context.sdk.instance.updateItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

// test item update without a model ZUID
test.serial("updateItem with missing model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.updateItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:updateItem() missing required `modelZUID` argument");
  }
});


// test item update without an item ZUID
test.serial("updateItem with missing item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.updateItem(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:updateItem() missing required `itemZUID` argument");
  }
});


// test item update without a payload
test.serial("updateItem with missing payload", async t => {
  try {
    const res = await t.context.sdk.instance.updateItem(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:updateItem() missing required `payload` argument");
  }
});

test.serial("publishItem:200", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
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

  t.is(published.statusCode, 200);
  t.is(published.data.item_zuid, item.meta.ZUID);
  t.is(Number(published.data.version_num), Number(item.meta.version));
});

// test item publishing without model ZUID
test.serial("publishItem without a model ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.publishItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:publishItem() missing required `modelZUID` argument");
  }
});

// test item publishing without item ZUID
test.serial("publishItem without a item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.publishItem(
      TEST_MODEL_ZUID
    )
  } catch (err) {
    t.is(err.message, "SDK:Instance:publishItem() missing required `itemZUID` argument");
  }
});

// test item publishing without version
test.serial("publishItem without a version", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
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

  try {
    const res = await t.context.sdk.instance.publishItem(
      TEST_MODEL_ZUID,
      item.meta.ZUID
    )
  } catch (err) {
    t.is(err.message, "SDK:Instance:publishItem() missing required `version` argument");
  }
});

test.serial("unpublishItem:200", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
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

  t.is(published.statusCode, 200);
  t.is(published.data.item_zuid, item.meta.ZUID);
  t.is(Number(published.data.version_num), Number(item.meta.version));

  // Unpublish item
  const unpublished = await t.context.sdk.instance.unpublishItem(
    TEST_MODEL_ZUID,
    published.data.item_zuid
  );

  t.is(unpublished.statusCode, 200);
  t.is(unpublished.message, "Entry updated");
});

// test item unpublishing without a model ZUID
test.serial("unpublishedItem without a model ZUID", async t => {
  try {
    const res = await  t.context.sdk.instance.unpublishItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:unpublishItem() missing required `modelZUID` argument");
  }
});

// test item unpublishing without an item ZUID
test.serial("unpublishedItem without an item ZUID", async t => {
  try {
    const res = await t.context.sdk.instance.unpublishItem(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:unpublishItem() missing required `itemZUID` argument");
  }
});

// test item unpublishing without a publish ZUID
test.serial("unpublishedItem without a publish ZUID", async t => {
  // Create a new item
  const title = `node-sdk:createItem:${moment().valueOf()}`;
  const created = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
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
  
  try {
    // note need to create an ITEM ZUID
    const res = await t.context.sdk.instance.unpublishItem(
      TEST_MODEL_ZUID,
      created.data.ZUID
    );
  } catch (err) {
    t.is(err.message, `No publishing records found for itemZUID: ${created.data.ZUID}`);
  }
});

test.serial("findItem:200", async t => {
  const res = await t.context.sdk.instance.findItem(TEST_ITEM_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(typeof res.data[0].web === "object");
  t.truthy(typeof res.data[0].meta === "object");
  t.truthy(typeof res.data[0].data === "object");
  t.is(res.data[0].meta.ZUID, TEST_ITEM_ZUID);
});

// test findItem without a query
test.serial("findItem without a query", async t => {
  try {
    const res = await t.context.sdk.instance.findItem(

    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:findItem() missing required `query` argument");
  }
});

// Upsert: update existing item
test.serial("upsertItem:200", async t => {
  const EXISTING_PATH = "node-sdk-updateitem";
  const res = await t.context.sdk.instance.upsertItem(
    TEST_MODEL_ZUID,
    EXISTING_PATH,
    TEST_ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

// Upsert: create new item
test.serial("upsertItem:201", async t => {
  const title = `node-sdk:upsertItem:${moment().valueOf()}`;
  const pathPart = t.context.sdk.instance.formatPath(title);
  const res = await t.context.sdk.instance.upsertItem(
    TEST_MODEL_ZUID,
    pathPart,
    {
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
        pathPart
      }
    }
  );

  t.is(res.statusCode, 201);
  t.truthy(res.data.ZUID);
});

// test upsert without a model ZUID
test.serial("upsertItem without a model ZUID",  async t => {
  try {
    const res = await t.context.sdk.instance.upsertItem();
  } catch (err) {
    t.is(err.message, "SDK:Instance:upsertItem() missing required `modelZUID` argument");
  }
});

// test upsert without a path
test.serial("upsertItem without a path",  async t => {
  try {
    const res = await t.context.sdk.instance.upsertItem(
      TEST_MODEL_ZUID
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:upsertItem() missing required `path` argument");
  }
});

// test upsert without a payload
test.serial("upsertItem without a payload",  async t => {
  const title = `node-sdk:upsertItem:${moment().valueOf()}`;
  const pathPart = t.context.sdk.instance.formatPath(title);

  try {
    const res = await t.context.sdk.instance.upsertItem(
      TEST_MODEL_ZUID,
      pathPart
    );
  } catch (err) {
    t.is(err.message, "SDK:Instance:upsertItem() missing required `payload` argument");
  }
});

test.serial("deleteItem:200", async t => {
  const title = `node-sdk:deleteItem:${moment().valueOf()}`;
  const item = await t.context.sdk.instance.createItem(TEST_MODEL_ZUID, {
    data: {
      title: title
    },
    web: {
      pathPart: t.context.sdk.instance.formatPath(title)
    }
  });

  t.is(item.statusCode, 201);
  t.truthy(item.data.ZUID);

  const res = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    item.data.ZUID
  );

  t.is(res.statusCode, 200);
});
