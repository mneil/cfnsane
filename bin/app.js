#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const debug = require('debug')('cfnsane:cli');

const { Stack, cfnsane } = require('../lib/index');

const app = new cdk.App();
const stack = new Stack(app, 'Stack');

cfnsane(stack);
