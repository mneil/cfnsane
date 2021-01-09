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
pip install cfnsane
```

Process an existing template (YAML or JSON)

```bash
cfnsane template.yml -o out.yml
```

See available commands by running `cfnsane --help` or simply `cfnsane`.

### Library

You may wish to use CFNSane to create your own sane defaults for AWS resources. Writing new resources is simple. For example you could make your own s3 Bucket resource to block public access and set versioning to Enabled.

```python
from troposphere.s3 import Bucket
from cfnsane import Resource


class MyBucket(Bucket, Resource):

    PublicAccessBlockConfiguration = {
        "BlockPublicAcls": True,
        "BlockPublicPolicy": True,
        "IgnorePublicAcls": True,
        "RestrictPublicBuckets": True,
    }

    VersioningConfiguration = {
      "Status": "Enabled",
    }
```

That's it. Now any bucket you define in your templates will have these settings by default. This example overloads the Troposphere Bucket resource. This is the recommended way to extend a vanilla resource with no prerequisites. You could also have extended the `cfnsane.s3.Bucket` resource instead to build on top of the pre-existing defaults defined by this package.
