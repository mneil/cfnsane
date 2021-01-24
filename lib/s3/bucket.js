const s3 = require('@aws-cdk/aws-s3');

class Bucket {
    visit(node) {
     // See that we're dealing with a CfnBucket
     if ( node instanceof s3.CfnBucket) {

       // Check for versioning property, exclude the case where the property
       // can be a token (IResolvable).
       if ( !node.versioningConfiguration
         || !Tokenization.isResolvable(node.versioningConfiguration)
             && node.versioningConfiguration.status !== 'Enabled') {
         node.node.addError('Bucket versioning is not enabled');
       }
     }
   }
 }

 module.exports = Bucket;
