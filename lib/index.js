const cdk = require('@aws-cdk/core');
const cfn_inc = require('@aws-cdk/cloudformation-include');

class Stack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const template = new cfn_inc.CfnInclude(this, 'Template', {
      templateFile: 'my-template.yaml',
    });
  }
}

module.exports = { Stack }
