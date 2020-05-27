require("dotenv").config();

const fs = require("fs");
const path = require("path");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../test/helpers/auth-context");
test.beforeEach(authContext);

test.serial("getBins:200", async (t) => {
  const res = await t.context.sdk.media.getBins();
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("getBin:200", async (t) => {
  const res = await t.context.sdk.media.getBin(process.env.TEST_BIN_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].id, process.env.TEST_BIN_ZUID);
});

test.serial("updateBin:200", async (t) => {
  const binName = `Test ${moment().valueOf()}`;

  const res = await t.context.sdk.media.updateBin(process.env.TEST_BIN_ZUID, {
    name: binName,
  });

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].id, process.env.TEST_BIN_ZUID);
  t.is(res.data[0].name, binName);
});

test.serial("createFile:201", async (t) => {
  const stream = fs.createReadStream(
    path.resolve(__dirname, "../../../test/fixtures/midgar-transit-map.jpg")
  );

  const opts = {
    title: "Midgar Mass Transit Map",
    fileName: "midgar-transit-map.jpg",
  };

  const res = await t.context.sdk.media.createFile(
    process.env.TEST_BIN_ZUID,
    stream,
    opts
  );

  t.is(res.statusCode, 201);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.truthy(res.data[0].filename);
  t.is(res.data[0].bin_id, process.env.TEST_BIN_ZUID);
  t.is(res.data[0].type, "file");
  t.is(
    res.data[0].url,
    `https://dg1wqtbj.media.zestyio.com/${res.data[0].filename}`
  );
});

// test creating a file without specifying bin ZUID
test.serial("createFile with no bin ZUID", async (t) => {
  try {
    const res = await t.context.sdk.media.createFile(
      null,
      null,
      {}
    );
  } catch (err) {
    t.is(err.message, "Missing required `binZUID` argument");
  }
});

// test creating a file without specifying a stream
test.serial("createFile with no stream", async (t) => {
  try {
    const res = await t.context.sdk.media.createFile(
      process.env.TEST_BIN_ZUID,
      null,
      {}
    );
  } catch (err) {
    t.is(err.message, "Missing required `stream` argument");
  }
});

test.serial("createFile with a bad binZUID", async (t) => {
  const BAD_BIN_ZUID = "1-ABCDEF-123456";
  const stream = fs.createReadStream(
    path.resolve(__dirname, "../../../test/fixtures/midgar-transit-map.jpg")
  );
  const opts = {
    title: "Midgar Mass Transit Map",
    fileName: "midgar-transit-map.jpg",
  };

  try {
    const res = await t.context.sdk.media.createFile(
      BAD_BIN_ZUID,
      stream,
      opts
    );
  } catch (err) {
    t.is(err.message, `We could not find the requested bin ${BAD_BIN_ZUID}`);
  }
})

test.serial("updateFile:200", async (t) => {
  const fileName = `test-${moment().valueOf()}.jpg`;

  const res = await t.context.sdk.media.updateFile(process.env.TEST_FILE_ZUID, {
    filename: fileName,
    title: fileName,
  });

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
  t.is(res.data[0].filename, fileName);
  t.is(res.data[0].url, `https://dg1wqtbj.media.zestyio.com/${fileName}`);
});

// test successfully updating a file with no file ZUID
test.serial("updateFile with no fileZUID", async (t) => {
  try {
    const res = await t.context.sdk.media.updateFile()
  } catch (err) {
    t.is(err.message, "Missing required `fileZUID` argument");
  }
});

// test successfully getting file
test.serial("getFile:200", async t => {
  const res = await t.context.sdk.media.getFile(
    process.env.TEST_FILE_ZUID
  );

  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

// test successfully getting file without a file ZUID
test.serial("getFile:404", async t => {
  const missingFileZUID = await t.context.sdk.media.getFile();
  // to follow the convention from the other tests
  // we are checking the status code and message
  t.is(missingFileZUID.statusCode, 404);
  t.is(missingFileZUID.message, "File not found");
});

// test successfully getting files for a given bin
test.serial("getFiles:200", async t => {
  const res = await t.context.sdk.media.getFiles(
    process.env.TEST_BIN_ZUID
  );
  
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("deleteFile:200", async (t) => {
  const stream = fs.createReadStream(
    path.resolve(__dirname, "../../../test/fixtures/midgar-transit-map.jpg")
  );

  const opts = {
    title: "Midgar Mass Transit Map",
    fileName: "midgar-transit-map.jpg",
  };

  const file = await t.context.sdk.media.createFile(
    process.env.TEST_BIN_ZUID,
    stream,
    opts
  );

  t.is(file.statusCode, 201);
  t.truthy(Array.isArray(file.data));
  t.truthy(file.data.length > 0);
  t.truthy(file.data[0].id);

  const res = await t.context.sdk.media.deleteFile(file.data[0].id);

  t.is(res.statusCode, 200);
});

// delete file with no fileZUID
test.serial("deleteFile with no file ZUID", async (t) => {
  try {
    const res = await t.context.sdk.media.deleteFile();
  } catch (err) {
    t.is(err.message, "Missing required `fileZUID` argument");
  }
});

test.serial("group", async (t) => {
  t.log(`createGroup`);
  const payload = {
    name: `test-${moment().valueOf()}`,
    binZUID: process.env.TEST_BIN_ZUID,
  };

  const created = await t.context.sdk.media.createGroup(payload);
  t.is(created.statusCode, 201);
  t.truthy(Array.isArray(created.data));
  t.truthy(created.data.length > 0);
  t.truthy(created.data[0].id);
  t.is(created.data[0].name, payload.name);

  // Reparent group from bin to sub-group
  t.log(`updateGroup`);
  const updated = await t.context.sdk.media.updateGroup(created.data[0].id, {
    name: "updated",
    groupZUID: process.env.TEST_GROUP_ZUID,
  });
  t.is(updated.statusCode, 200);
  t.truthy(Array.isArray(updated.data));
  t.truthy(updated.data.length > 0);

  t.log(`deleteGroup`);
  const deleted = await t.context.sdk.media.deleteGroup(created.data[0].id);
  t.is(deleted.statusCode, 200);
});

// test create group with no payload
test.serial("create group with no payload", async (t) => {
  try {
    const res = await t.context.sdk.media.createGroup({})
  } catch (err) {
    t.is(err.message, "Missing required `payload.binZUID` argument");
  }
})

// test updating group with no group ZUID
test.serial("update group with no group ZUID", async (t) => {
  try {
    const res = await t.context.sdk.media.updateGroup();
  } catch (err) {
    t.is(err.message, "Missing required `groupZUID` argument");
  }
});

// test updating group with no payload ZUID
test.serial("update group with no payload ZUID", async (t) => {
  try {
    const res = await t.context.sdk.media.updateGroup(
      process.env.TEST_GROUP_ZUID
    );
  } catch (err) {
    t.is(err.message, "Missing required `payload.name` argument");
  }
});

// test deleting group with no group ZUID
test.serial("deleteGroup with no group ZUID", async t => {
  try {
    const res = await t.context.sdk.media.deleteGroup();
  } catch (err) {
    t.is(err.message, "Missing required `groupZUID` argument");
  }
});

test.serial("getGroups:200", async (t) => {
  const res = await t.context.sdk.media.getGroups(process.env.TEST_BIN_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});

test.serial("getGroup:200", async (t) => {
  const res = await t.context.sdk.media.getGroup(process.env.TEST_GROUP_ZUID);
  t.is(res.statusCode, 200);
  t.truthy(Array.isArray(res.data));
  t.truthy(res.data.length > 0);
});
