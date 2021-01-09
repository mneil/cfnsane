"""
Handles a list of resources that we are overloading.

Current use it is simply list the __subclasses__ of this
class and iterate over them to infer the resource_type
and class we should use to generate that type
"""
import inspect


# class MetaResource(type):

#     def __new__(cls, name, bases, dct):
#         print(inspect.getmembers(cls))
#         x = super().__new__(cls, name, bases, dct)
#         return x

class Resource():
    """
    Base class for all resource definitions that
    will overload troposphere objects
    """
    ignore_attributes = ("props", "__annotations__")

    @classmethod
    def get_members(cls):
        members = inspect.getmembers(cls)
        return members

    @classmethod
    def sane_defaults(cls):
        members = {}
        for member, value in cls.get_members():
            if isinstance(value, dict) and member not in Resource.ignore_attributes:
                members[member] = value
        return members
