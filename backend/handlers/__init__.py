import os
from trender.aiohttp_template import setup_template_loader
from ..utils import TEMPLATE_PATH


def setup_templates():
    setup_template_loader(TEMPLATE_PATH)
