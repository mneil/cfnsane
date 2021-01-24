const cdk = require('@aws-cdk/core');
const cfn_inc = require('@aws-cdk/cloudformation-include');
const s3 = require('./s3');

class Stack extends cdk.Stack {
  constructor(scope, id, props = {}) {
    super(scope, id, props);

    new cfn_inc.CfnInclude(this, props.name || 'Template', {
      templateFile: props.template || 'my-template.yaml',
    });
  }
}
/**
 * cfnsane is an entrypoint to enable all of the available
 * aspects within cfnsane.
 * @param {*} construct: A CDK Construct, Stack, or App
 */
function cfnsane(construct) {
  s3(construct);
}

module.exports = {
  Stack,
  cfnsane,
}
