from contextlib import nullcontext

def templates():
    """
    Creates templates inline or from fixtures/templates that can be tested
    by the application
    """
    return {
        "from_dict_empty": {
            "template": {},
            "expect": nullcontext({}),
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
                "MyBucket": {
                    "Type": "AWS::S3::Bucket",
                    "Properties": {
                        "BucketName": "foo",
                    },
                },
            }),
        },
        "from_template_ok": {
            "template": open("./tests/fixtures/templates/in/bucket.yml", "r"),
            "expect": nullcontext({
                "MyBucket": {
                    "Type": "AWS::S3::Bucket",
                    "Properties": {
                        "BucketName": "foo",
                    },
                },
            }),
        },
    }
