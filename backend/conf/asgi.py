import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns
from chat.middleware import JWTAuthMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE',

                       'conf.deployment_settings' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'conf.settings')

application = ProtocolTypeRouter({
        "http": get_asgi_application(),
        "websocket": JWTAuthMiddleware(
            URLRouter(websocket_urlpatterns)
        ),
    })
