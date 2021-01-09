"""
Load cloudformation into Troposphere and synthesize into
a template
"""
import os

from cfnsane.meta import Resource

NAMESPACE = "AWS"
