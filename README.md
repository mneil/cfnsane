# CFNSane

Supercharge your cloudformation with sane, explicit defaults for resources.

Given a simple Cloudformation template containing a bucket

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: my-bucket
```

CFNSane will produce the equivelant template:

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: MyBucket
      PublicAccessBlockConfiguration:
        BlockPublicAcls: True
        BlockPublicPolicy: True
        IgnorePublicAcls: True
        RestrictPublicBuckets: True
```

## Why CFNSane

[Cloudformation](https://aws.amazon.com/cloudformation/) is a declaritive DSL to
configure your Infrastructure as Code (IaC). It is the defacto way to create
and lifecycle resources on Amazon Web Services (AWS). Writing Cloudformation often
means writing tons of repetitive YAML or JSON.

To solve this problem DevOps teams turn to more declaritive solutions like the
[Cloud Developer Kit (CDK)](https://aws.amazon.com/cdk/), [Terraform](https://www.terraform.io/),
[Pulumi](https://www.pulumi.com/), [Troposphere](https://github.com/cloudtools/troposphere),
or other tool(s).

Software engineers want flexibility in their tooling. CFNSane works with existing solutions and processes to supercharge your IaC by pre or post processing the template and automatically configuring default values. Create your own defaults or use community provided learned best practices.

Application teams want to deploy a bucket into the cloud as fast as possible. Infrastructure teams want to provide templates and patterns for best-practices within an organization. Security teams want to ensure that certain preventative measures are taken on resources. CFNSane helps each of these teams.

## Quick Start

Install CFNSane using pip from PyPi

```bash
npm install -g cfnsane
```

Process an existing template (YAML or JSON)

```bash
cfnsane template.yml -o out.yml
```

See available commands by running `cfnsane --help` or simply `cfnsane`.

### Library

You may wish to use Cfnsane to create your own sane defaults for AWS resources. Cfnsane uses the AWS CDK under the hook. You can write AWS CDK like normal and attach cfnsane to your stack or individual contructs to enforce sane defaults.

```javascript
const cfnsane = require('cfnsane');
const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

/**
 * Stack ingests a template from disk anc creates
 * a CDK Stack
 */
class Stack extends cdk.Stack {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        new s3.Bucket(this, 'MyBucket', {bucketName: 'my-bucket'})
    }
}

const app = new cdk.App();
const stack = new Stack(app, 'Stack');

cfnsane.attach(stack);
```

Now use the CDK like normal. Running `cdk synth` from the example above will create a stack with a bucket and explicitly set block public access configuration for you.
