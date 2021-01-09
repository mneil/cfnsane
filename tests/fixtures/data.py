from contextlib import nullcontext

from yaml import load

from cfnsane.resources import Bucket
from cfnsane.yaml import CfnYamlLoader


class SelfRef(dict):
   def __getitem__(self, item):
       value = dict.__getitem__(self, item)
       if not isinstance(value, str):
           return value
       return value % self

def templates():
    """
    Creates templates inline or from fixtures/templates that can be tested
    by the application
    """
    return {
        "from_dict_empty": {
            "template": {},
            "expect": nullcontext({
                "load": {},
                "types": {},
                "template": {"Resources": {}},
            }),
        },
        "from_dict_ok": {
            "template": {
                "MyBucket": {
                    "Type": "AWS::S3::Bucket",
                    "Properties": {
                        "BucketName": "foo",
                    },
                },
            },
            "expect": nullcontext({
                "load": {
                    "MyBucket": {
                        "Type": "AWS::S3::Bucket",
                        "Properties": {
                            "BucketName": "foo",
                        },
                    },
                },
                "types": {
                    "MyBucket": Bucket,
                },
                "template": {
                    "Resources": {
                         "MyBucket": {
                            "Type": "AWS::S3::Bucket",
                            "Properties": {
                                "BucketName": "foo",
                                "PublicAccessBlockConfiguration": {
                                    "BlockPublicAcls": "true",
                                    "BlockPublicPolicy": "true",
                                    "IgnorePublicAcls": "true",
                                    "RestrictPublicBuckets": "true",
                                }
                            },
                        },
                    }
                }
            }),
        },
        "from_template_ok": {
            "template": open("./tests/fixtures/templates/in/bucket.yml", "r"),
            "expect": nullcontext({
                "load": {
                    "MyBucket": {
                        "Type": "AWS::S3::Bucket",
                        "Properties": {
                            "BucketName": "my-bucket",
                        },
                    },
                },
                "types": {
                    "MyBucket": Bucket,
                },
                "template": load(
                    open("./tests/fixtures/templates/out/bucket.yml", "r"),
                    Loader=CfnYamlLoader
                )
            }),
        },
    }
