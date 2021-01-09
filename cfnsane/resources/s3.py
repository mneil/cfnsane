from troposphere.s3 import Bucket as TSBucket

from cfnsane.meta import Resource

class Bucket(TSBucket, Resource):

    resource_type: str = "AWS::S3::Bucket"

    PublicAccessBlockConfiguration = {
        "BlockPublicAcls": True,
        "BlockPublicPolicy": True,
        "IgnorePublicAcls": True,
        "RestrictPublicBuckets": True,
    }
