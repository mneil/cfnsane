const {Aspects} = require('@aws-cdk/core');
const Bucket = require('./bucket');

function s3(construct){
    Aspects.of(construct).add(new Bucket());
}

module.exports = s3;
