import json

import pytest

from cfnsane import loader
from cfnsane.resources.bucket import Bucket


def test_read(case):
    with case["expect"] as expect:
        loaded = loader.Load(case["template"])
        to_dict = json.loads(json.dumps(loaded.data))
        assert to_dict == expect['load']

def test_resource_init():
    assert Bucket.sane_defaults() == {
        "PublicAccessBlockConfiguration": {
            "BlockPublicAcls": True,
            "BlockPublicPolicy": True,
            "IgnorePublicAcls": True,
            "RestrictPublicBuckets": True,
        }
    }


def test_convert(case):
    with case["expect"] as expect:
        loaded = loader.Load(case["template"])
        loaded.convert()
        types = {key: type(resource) for key, resource in loaded.resources.items()}
        assert types == expect['types']

def test_render(case):
    with case["expect"] as expect:
        loaded = loader.Load(case["template"])
        template = loaded.render()
        assert template.to_dict() == expect['template']
