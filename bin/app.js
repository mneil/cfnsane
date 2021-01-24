#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { Stack } = require('../lib/index');
const debug = require('debug')('cfnsane:cli')

const app = new cdk.App();
new Stack(app, 'Stack');
