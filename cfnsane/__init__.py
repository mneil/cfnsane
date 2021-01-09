"""
Load cloudformation into Troposphere and synthesize into
a template
"""
import os
import pkgutil
import sys

import troposphere

from cfnsane.meta import Resource

# Allow users to import all cfnsane resources
# from the top level package. Any that do not exist
# will fall back to the Troposphere equivelant
__path__.append(os.path.join(os.path.dirname(__file__), 'resources'))
__path__.append(os.path.dirname(troposphere.__file__))
