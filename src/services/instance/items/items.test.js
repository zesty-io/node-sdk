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

// 
// CONTENT ITEMS
// 

// 
// CONTENT ITEMS GET
// 

// test successful content items retrieval 
test.serial("fetchItems:200", async t => {
  const res = await t.context.sdk.instance.getItems(TEST_MODEL_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// test successful content items retrieval with no content model ZUID
test.serial("getItems with no modelZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItems()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItems() missing required `modelZUID` argument"
  );
});

// 
// CONTENT ITEM GET
// 

// test successful content item retrieval
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

// test failed item retrieval with no content model ZUID
test.serial("getItem with no model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItem() missing required `modelZUID` argument"
  );
});

// test failed item retrieval with no content item ZUID
test.serial("getItem with no item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.getItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:getItem() missing required `itemZUID` argument"
  );
});

// 
// CONTENT ITEM PUBLISHINGS GET
// 

// test successful item publishings retrieval
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

// test failed item publishings retrieval with no content model ZUID
test.serial("getItemPublishings with no model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemPublishings()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItemPublishings() missing required `modelZUID` argument"
  );
});

// test failed item publishings retrieval with no content item ZUID
test.serial("getItemPublishings with no item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemPublishings(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:getItemPublishings() missing required `itemZUID` argument"
  );
});

// 
// CONTENT ITEM PUBLISHING GET
// 

// test successful item publishing retrieval
test.serial("getItemPublishing:200", async t => {
  const res = await t.context.sdk.instance.getItemPublishing(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_PUBLISH_ZUID
  );
  t.is(res.statusCode, 200);
});

//  test failed item publishing without a model ZUID
test.serial("getItemPublishing with no model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemPublishing()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItemPublishing() missing required `modelZUID` argument"
  );
});

//  test failed item publishing without an item ZUID
test.serial("getItemPublishing with no itemZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemPublishing(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:getItemPublishing() missing required `itemZUID` argument"
  );
});

//  test failed item publishing without a publish ZUID
test.serial("getItemPublishing with no publishZUID", async t => {
  const noPublishZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemPublishing(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    )
  );
  t.is(
    noPublishZUID.message,
    "SDK:Instance:getItemPublishing() missing required `publishZUID` argument"
  );
});

// 
// CONTENT ITEM VERSIONS GET
// 

// test successful item versions retrieval
test.serial("getItemVersions:200", async t => {
  const res = await t.context.sdk.instance.getItemVersions(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID
  );
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// test failed item versions retrieval without specifying a model ZUID
test.serial("getItemVersions without model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemVersions()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItemVersions() missing required `modelZUID` argument"
  )
});

// test failed item versions retrieval without specifying an item ZUID
test.serial("getItemVersions without item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemVersions(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:getItemVersions() missing required `itemZUID` argument"
  );
});

// 
// CONTENT ITEM VERSION GET
// 

// test successful item version retrieval
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

// test failed item version retrieval without specifying a model ZUID
test.serial("getItemVersion with missing model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemVersion()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:getItemVersion() missing required `modelZUID` argument"
  );
});

// test failed item version retrieval without specifying an item ZUID
test.serial("getItemVersion with missing item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.getItemVersion(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:getItemVersion() missing required `itemZUID` argument"
  );
});

// test failed item version retrieval without specifying a version
test.serial("getItemVersion with missing version", async t => {
  const noVersion = await t.throwsAsync(
    t.context.sdk.instance.getItemVersion(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    )
  );
  t.is(
    noVersion.message,
    "SDK:Instance:getItemVersion() missing required `version` argument"
  );
});

// 
// CONTENT ITEM CREATE
// 

// test successful item creation
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

// test failed item creation without a model ZUID
test.serial("createItem with missing model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.createItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:createItem() missing required `modelZUID` argument"
  );
});

// test failed item creation without a payload
test.serial("createItem with missing payload", async t => {
  const noPayload = await t.throwsAsync(
    t.context.sdk.instance.createItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noPayload.message,
    "SDK:Instance:createItem() missing required `payload` argument"
  )
});

// 
// CONTENT ITEM UPDATE
// 

// test successful item update
test.serial("updateItem:200", async t => {
  const res = await t.context.sdk.instance.updateItem(
    TEST_MODEL_ZUID,
    TEST_ITEM_ZUID,
    TEST_ITEM_JSON
  );

  t.is(res.statusCode, 200);
  t.is(res.data.ZUID, TEST_ITEM_ZUID);
});

// test failed item update with no a model ZUID
test.serial("updateItem with missing model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.updateItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:updateItem() missing required `modelZUID` argument"
  );
});


// test failed item update with no item ZUID
test.serial("updateItem with missing item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.updateItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:updateItem() missing required `itemZUID` argument"
  );
});


// test failed item update with no payload
test.serial("updateItem with missing payload", async t => {
  const noPayload = await t.throwsAsync(
    t.context.sdk.instance.updateItem(
      TEST_MODEL_ZUID,
      TEST_ITEM_ZUID
    )
  );
  t.is(
    noPayload.message,
    "SDK:Instance:updateItem() missing required `payload` argument"
  );
});

// 
// CONTENT ITEM PUBLISH
// 

// test successful item publishing
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

// test failed item publishing with no model ZUID
test.serial("publishItem without a model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.publishItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:publishItem() missing required `modelZUID` argument"
  );
});

// test failed item publishing with no item ZUID
test.serial("publishItem without a item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.publishItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:publishItem() missing required `itemZUID` argument"
  );
});

// test failed item publishing with no version
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

  // attempt to publish a newly created item with no version number
  const noVersion = await t.throwsAsync(
    t.context.sdk.instance.publishItem(
      TEST_MODEL_ZUID,
      item.meta.ZUID
    )
  );
  t.is(
    noVersion.message,
    "SDK:Instance:publishItem() missing required `version` argument"
  );
});

// 
// CONTENT ITEM UNPUBLISH
// 

// test successful item unpublish
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

// test failed item unpublishing with no model ZUID
test.serial("unpublishedItem without a model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.unpublishItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:unpublishItem() missing required `modelZUID` argument"
  );
});

// test item unpublishing without an item ZUID
test.serial("unpublishedItem without an item ZUID", async t => {
  const noItemZUID = await t.throwsAsync(
    t.context.sdk.instance.unpublishItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noItemZUID.message,
    "SDK:Instance:unpublishItem() missing required `itemZUID` argument"
  );
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
  
  const noPublishZUID = await t.throwsAsync(
    t.context.sdk.instance.unpublishItem(
      TEST_MODEL_ZUID,
      created.data.ZUID
    )
  );
  t.is(
    noPublishZUID.message,
    `No publishing records found for itemZUID: ${created.data.ZUID}`
  );
});

// 
// CONTENT ITEM FIND
// 

// test successful findItem
test.serial("findItem:200", async t => {
  const res = await t.context.sdk.instance.findItem(TEST_ITEM_ZUID);

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(typeof res.data[0].web === "object");
  t.truthy(typeof res.data[0].meta === "object");
  t.truthy(typeof res.data[0].data === "object");
  t.is(res.data[0].meta.ZUID, TEST_ITEM_ZUID);
});

// test failed findItem with no query
test.serial("findItem without a query", async t => {
  const noQuery = await t.throwsAsync(
    t.context.sdk.instance.findItem()
  );
  t.is(
    noQuery.message,
    "SDK:Instance:findItem() missing required `query` argument"
  );
});

// 
// CONTENT ITEM UPSERT
// 

// test successful upsert: update existing item
// upsert will update an existing item because pathPart already exists
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

// test successful upsert of a new item
// upsert will create new item because path is unique
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

// test failed upsert with no model ZUID
test.serial("upsertItem without a model ZUID", async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.upsertItem()
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:upsertItem() missing required `modelZUID` argument"
  );
});

// test failed upsert with no path
test.serial("upsertItem without a path",  async t => {
  const noModelZUID = await t.throwsAsync(
    t.context.sdk.instance.upsertItem(
      TEST_MODEL_ZUID
    )
  );
  t.is(
    noModelZUID.message,
    "SDK:Instance:upsertItem() missing required `path` argument"
  );
});

// test failed upsert with no payload
test.serial("upsertItem without a payload",  async t => {
  const title = `node-sdk:upsertItem:${moment().valueOf()}`;
  const pathPart = t.context.sdk.instance.formatPath(title);
  const noPayload = await t.throwsAsync(
    t.context.sdk.instance.upsertItem(
      TEST_MODEL_ZUID,
      pathPart
    )
  );
  t.is(
    noPayload.message,
    "SDK:Instance:upsertItem() missing required `payload` argument"
  );
});

// test successful item delete
test.serial("deleteItem:200", async t => {
  // create a new item
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

  // delete item
  const res = await t.context.sdk.instance.deleteItem(
    TEST_MODEL_ZUID,
    item.data.ZUID
  );

  t.is(res.statusCode, 200);
});