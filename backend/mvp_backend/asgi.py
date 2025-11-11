"""
ASGI config for the MVP backend project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mvp_backend.settings')

application = get_asgi_application()
