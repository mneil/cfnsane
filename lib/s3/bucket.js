const Aspects = require("@aws-cdk/core").Aspects;

class BucketVersioningChecker {
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

 // Later, apply to the stack
 Aspects.of(stack).add(new BucketVersioningChecker());
