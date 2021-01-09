import pytest

from cfnsane import loader


def test_read(case):
    with case["expect"] as expect:
        loaded = loader.Load(case["template"])
        assert loaded.data == expect

def test_resources(case):
    with case["expect"] as expect:
        loaded = loader.Load(case["template"])
        loaded.convert()
        assert loaded.resources == expect
