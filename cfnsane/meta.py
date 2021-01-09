"""
Handles a list of resources that we are overloading.

Current use it is simply list the __subclasses__ of this
class and iterate over them to infer the resource_type
and class we should use to generate that type
"""
class Resource():
    pass
