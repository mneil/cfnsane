#!/usr/bin/env node
const cdk = require('@aws-cdk/core');
const { Stack, attach } = require('../lib/index');

const app = new cdk.App();
const stack = new Stack(app, 'Stack');

attach(stack);
