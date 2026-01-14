import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE',

                       'conf.deployment_settings' if 'RENDER_EXTERNAL_HOSTNAME' in os.environ else 'conf.settings')

application = get_wsgi_application()
