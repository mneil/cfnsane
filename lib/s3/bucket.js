const s3 = require('@aws-cdk/aws-s3');
const Aspect = require('../aspect');

class Bucket extends Aspect{
    resource = s3.CfnBucket;

    blockPublicAccess(node) {
        node.publicAccessBlockConfiguration = new s3.BlockPublicAccess({
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
        });
    }
    sanity(node) {
        if (!node.publicAccessBlockConfiguration){
            this.blockPublicAccess(node)
        }
    }
}

module.exports = Bucket;
