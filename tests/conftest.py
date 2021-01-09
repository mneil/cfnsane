"""
Setup for all tests
"""
from tests.fixtures import data

def pytest_generate_tests(metafunc):
    """
    Generate tests: Parametrize tests that have args
    """
    if "case" in metafunc.fixturenames:
        templates = data.templates()
        metafunc.parametrize("case", templates.values(), ids=templates.keys())
