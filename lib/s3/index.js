const {Aspects} = require('@aws-cdk/core');
const debug = require('debug')('cfnsane:s3');
const Bucket = require('./bucket');

function s3(construct){
    debug('attach');
    Aspects.of(construct).add(new Bucket());
}

module.exports = s3;
