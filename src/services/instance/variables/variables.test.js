require("dotenv").config();

const fs = require("fs");
const test = require("ava");
const moment = require("moment");

const authContext = require("../../../../test/helpers/auth-context");

test.before(authContext);

test("fetchStylesheetVariables:200", async t => {
    const res = await t.context.sdk.instance.fetchStylesheetVariables();

    t.is(res.statusCode, 200);
    t.truthy(Array.isArray(res.data));
    t.truthy(res.data.length > 0);
});

test("fetchStylesheetVariable:200", async t => {
    const res = await t.context.sdk.instance.fetchStylesheetVariable(
    process.env.TEST_VARIABLE_ZUID
    );

    t.is(res.statusCode, 200);
    t.truthy(typeof res.data === "object");
    t.is(res.data.ZUID, process.env.TEST_VARIABLE_ZUID);
});

test("createStylesheetVariable:201", async t => {
    const name = `node-sdk_createStylesheetVariable_${moment().valueOf()}`
  
    const res = await t.context.sdk.instance.createStylesheetVariable(
        {
            referenceName: name,
            name: name,
            value: "#fff",
            type: "dropdown",
            sort: 1,
            description: "colors",
            category: 1,
            options: {
                "#0d6efd": "primary-color",
                "#0dcaf0": "info-color",
                "#198754": "success-color",
                "#212529": "dark-color",
                "#6c757d": "secondary-color",
                "#dc3545 ": "danger-color",
                "#f8f9fa": "light-color",
                "#ffc107": "warning-color"
            }
        }
    );

    t.is(res.statusCode, 201);
    t.truthy(res.data.ZUID);
});

test("updateStylesheetVariable:200", async(t) => {
  const res = await t.context.sdk.instance.updateStylesheetVariable(
    process.env.TEST_VARIABLE_ZUID,
    {
        options: {
            "#000": "primary-color"
        }
    }
  )
  t.is(res.statusCode, 200);
  t.truthy(res.data.ZUID);
});

test("deleteStylesheetVariable:200", async(t) => {
    const name = `node-sdk_createStylesheetVariable_${moment().valueOf()}`
  
    let res = await t.context.sdk.instance.createStylesheetVariable(
        {
            referenceName: name,
            name: name,
            value: "#fff",
            type: "dropdown",
            sort: 1,
            description: "colors",
            category: 1,
            options: {
                "#0d6efd": "primary-color",
                "#0dcaf0": "info-color",
                "#198754": "success-color",
                "#212529": "dark-color",
                "#6c757d": "secondary-color",
                "#dc3545 ": "danger-color",
                "#f8f9fa": "light-color",
                "#ffc107": "warning-color"
            }
        }
    );

    t.is(res.statusCode, 201);
    t.truthy(res.data.ZUID);

    const newStyleSheetVariableZUID = res.data.ZUID;

    res = await t.context.sdk.instance.deleteStylesheetVariable(
        newStyleSheetVariableZUID
    );

    t.is(res.statusCode, 200);
});