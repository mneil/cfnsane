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
