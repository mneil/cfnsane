from cfnsane.meta import Resource


class MockResource(Resource):
    SomeAttribute = {
        "Foo": "bar",
        "integer": 1,
        "IgnorePublicAcls": True,
        "RestrictPublicBuckets": True,
    }

def test_resource_init():
    assert MockResource.sane_defaults() == {
        "SomeAttribute": {
            "Foo": "bar",
            "integer": 1,
            "IgnorePublicAcls": True,
            "RestrictPublicBuckets": True,
        }
    }
