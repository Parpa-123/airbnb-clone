from pathlib import Path

import os

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY")

DEBUG = True

ALLOWED_HOSTS = [

    'localhost',

    'localhost:5173',

    '127.0.0.1',

    'genna-granitelike-sherill.ngrok-free.dev',

]

INSTALLED_APPS = [

    'django.contrib.admin',

    'django.contrib.auth',

    'django.contrib.contenttypes',

    'django.contrib.sessions',

    'django.contrib.messages',

    'django.contrib.staticfiles',

    'channels',

    'corsheaders',

    'rest_framework',

    'rest_framework_simplejwt',

    'users',

    'listings',

    'bookings',

    'wishlist',

    'chat',

    'phonenumber_field',

    'drf_spectacular',

    'django_filters',

    'reviews',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'conf.urls'

TEMPLATES = [

    {

        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {

            'context_processors': [

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',

            ],

        },

    },

]

ASGI_APPLICATION = 'conf.asgi.application'

DATABASES = {

    'default': {

        'ENGINE': 'django.db.backends.sqlite3',

        'NAME': BASE_DIR / 'db.sqlite3',

    }

}

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    },
}

if os.getenv("REDIS_URL"):
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [{
                    "address": os.getenv("REDIS_URL"),
                    "socket_connect_timeout": 30,
                    "socket_timeout": 30,
                    "retry_on_timeout": True,
                    "health_check_interval": 30,
                }],
            },
        },
    }

AUTH_PASSWORD_VALIDATORS = [

    {

        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',

    },

    {

        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',

    },

]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {

    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',

    'DEFAULT_PAGINATION_CLASS': 'conf.pagination.DefaultPagePagination',

    'PAGE_SIZE': 20,

    'DEFAULT_AUTHENTICATION_CLASSES': (

        'rest_framework_simplejwt.authentication.JWTAuthentication',

    ),

    'DEFAULT_FILTER_BACKENDS': (

        'django_filters.rest_framework.DjangoFilterBackend',

    ),

    'DEFAULT_THROTTLE_CLASSES': (
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ),

    'DEFAULT_THROTTLE_RATES': {
        'anon': '120/min',
        'user': '300/min',
        'auth_signup': '30/min',
        'auth_login': '60/min',
        'auth_refresh': '90/min',
        'chat_room_create': '60/min',
        'chat_rooms_list': '120/min',
        'chat_messages_list': '240/min',
        'booking_create': '30/min',
        'booking_list': '120/min',
        'booking_detail': '180/min',
        'booking_detail_retrieve': '120/min',
        'booking_destroy': '30/min',
        'booking_payment_create_order': '30/min',
        'booking_payment_verify': '120/min',
        'webhook_cashfree': '120/min',
    },

}

SPECTACULAR_SETTINGS = {

    'TITLE': 'Airbnb Clone API',

    'DESCRIPTION': 'API documentation for your project',

    'VERSION': '1.0.0',

}

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]

CORS_ALLOWED_ORIGINS = [

    "http://localhost:5173",

    "http://127.0.0.1:5173",

]

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

PHONENUMBER_DEFAULT_REGION = "IN"

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

CASHFREE_APP_ID = os.getenv("CASHFREE_APP_ID")

CASHFREE_SECRET_KEY = os.getenv("CASHFREE_SECRET_KEY")

CASHFREE_ENV = os.getenv("CASHFREE_ENV", "TEST")

CASHFREE_BASE_URL = os.getenv("CASHFREE_BASE_URL")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

BOOKING_HOLD_MINUTES = int(os.getenv("BOOKING_HOLD_MINUTES", "10"))
BOOKING_PAYMENT_HOLD_EXTENSION_MINUTES = int(
    os.getenv("BOOKING_PAYMENT_HOLD_EXTENSION_MINUTES", "20")
)
