"""
VidyaFloww ASGI Configuration

Exposes the ASGI callable as a module-level variable named ``application``.
Supports both HTTP and WebSocket protocols via Django Channels.
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

django_asgi_app = get_asgi_application()

# TODO: Import WebSocket URL patterns from platform.notifications when implemented
# from platform.notifications import routing as notifications_routing

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(
                    # TODO: Add WebSocket URL patterns here
                    # notifications_routing.websocket_urlpatterns,
                    []
                )
            )
        ),
    }
)
