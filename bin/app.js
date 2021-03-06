#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { Stack, attach } = require('../lib/index');

/**
 * Given an object returns another object
 * by filtering out any keys in the object
 * that start with CFNSANE_ and removing
 * the prefix and lowercasing the rest.
 * @param {object} env
 */
function loadConfig(env) {
    let loaded = {}
    for (const [key, value] of Object.entries(env)) {
        if (!key.startsWith('CFNSANE_')){
            continue;
        };
        normalizedKey = key.replace('CFNSANE_', '');
        loaded[normalizedKey.toLowerCase()] = value;
    }
    return loaded;
}
const config = loadConfig(process.env);
const app = new cdk.App();
const stack = new Stack(app, 'Stack', config);

attach(stack);
