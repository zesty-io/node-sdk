"use strict";

require("dotenv").config();

const test = require("ava");

const Instance = require("./")


// 
// INSTANCE
// 

// 
// INSTANCE CONSTRUCTOR
// 

// test failed instance creation without 
test.serial("instance:constructor() with no instanceZUID", t => {
    try {
        new Instance();
    } catch (err) {
        t.is(
            err.message,
            "SDK:Instance:constructor() missing required `instanceZUID` argument on instantiation"
        );
    }
})

// test successful instance creation using default URLs
test.serial("instance:constructor default URLs", t => {
    const instance = new Instance(
        process.env.ZESTY_INSTANCE_ZUID,
        process.env.ZESTY_TOKEN,
        {}
    );

    t.is(
        instance.baseAPI,
        process.env.ZESTY_INSTANCE_API
    );
});

// 
// INSTANCE FORMAT PATH
// 

// test failed formatPath without path
test.serial("formatPath with no path parameter", t => {
    const instance = new Instance(
        process.env.ZESTY_INSTANCE_ZUID,
        process.env.ZESTY_TOKEN,
        {}
    );
    try {
      const res = instance.formatPath()  
    } catch (err) {
        t.is(
            err.message,
            "SDK:Instance:formatPath() missing required `path` argument"
        );
    }
})