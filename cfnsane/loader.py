"""
Load a dictionary, string, bytes, bytearray, or readable stream into
a python dictionary
"""
import copy
import json
import logging
from typing import Any, Dict, Union, IO, Set

from yaml import load, YAMLError
from troposphere import Template
from troposphere.template_generator import TemplateGenerator
from cfnsane.meta import Resource
import cfnsane.resources

from cfnsane.yaml import CfnYamlLoader

Logger = logging.getLogger("cfnsane")
TroposphereObject = Union[bytes, IO[bytes], str, IO[str]]


class LoadError(Exception):
    """
    Unable to load
    dictionary, string, bytes, bytearray, or readable stream into
    a python dictionary
    """

class Load(TemplateGenerator):
    """
    Loads a Troposphere object from a dictionary, string, bytes,
    bytearray, or readable into a python dictionary
    """

    def __init__(self, obj: TroposphereObject):
        super().__init__({})
        # a dict of tropo resources and any subclass of Resource
        # with the resource_type (cfn) as the key and value as the type
        self._resources = None
        # a set of classes (resource) we can convert objects to
        self._members = None
        # all the objects converted to troposphere
        self.resources = {}
        # the thing to be converted to troposphere
        self.data = {}
        self._read(obj)

    @property
    def inspect_resources(self) -> Dict[str, Resource]:
        if self._resources is not None:
            return self._resources
        self._resources = super().inspect_resources
        subs = Resource.__subclasses__()
        for sub in subs:
            self._resources.update({sub.resource_type: sub})
        return self._resources

    @property
    def inspect_members(self) -> Set[Resource]:
        """
        Returns the list of all troposphere members we are able to
        construct
        """
        if self._members is not None:
            return self._members

        self._members: set = super().inspect_members
        subs = Resource.__subclasses__()
        for sub in subs:
            self._members.add(sub)
        return self._members

    def _read(self, obj: TroposphereObject):
        """
        Given a TroposphereObject this method will
        decode it to a python dictionary and set
        self.data to that dictionary
        """
        # Don't convert existing dict
        if isinstance(obj, dict):
            self.data = obj
            Logger.debug("read type dict")
            return
        try:
            # try to load it as YAML from disk or string
            self.data = load(obj, Loader=CfnYamlLoader)
            Logger.debug("read type YAML")
            return
        except YAMLError:
            Logger.debug("read unable to load YAML")
        try:
            # Convert a json str or bytes
            if isinstance(obj, (str, bytes, bytearray)):
                self.data = json.loads(obj)
                Logger.debug("read type json str, bytes, or bytearray")
            else:
                # Load json from a reader
                self.data = json.load(obj)
                Logger.debug("read type json reader")
        except json.JSONDecodeError:
            Logger.debug("read unable to load JSON")

        Logger.error("Loader.read unable to read to dict")
        raise LoadError("Unable to load %s to dict" % type(obj))

    def convert(self):
        """
        convert self.data into troposphere objects and stores
        them in self.resources
        """
        for logical_id, definition in self.data.items():
            resource_type = self._get_resource_type_cls(logical_id, definition)
            resource_definition = copy.deepcopy(definition)
            if hasattr(resource_type, "sane_defaults"):
                resource_definition["Properties"].update(resource_type.sane_defaults())
            self.resources[logical_id] = self._convert_definition(
                resource_definition, logical_id, resource_type
            )

    def render(self) -> Template:
        """
        render self.resources into a troposphere template
        """
        self.convert()
        template = Template()
        for value in self.resources.values():
            template.add_resource(value)

        return template
