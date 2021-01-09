from troposphere.s3 import Bucket as TSBucket

from cfnsane import NAMESPACE, Resource

class Bucket(TSBucket, Resource):

    resource_type: str = f"{NAMESPACE}::S3::Bucket"

    PublicAccessBlockConfiguration = {
        "BlockPublicAcls": True,
        "BlockPublicPolicy": True,
        "IgnorePublicAcls": True,
        "RestrictPublicBuckets": True,
    }
