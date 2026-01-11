import os
import dj_database_url
from .settings import *
from .settings import BASE_DIR

ALLOWED_HOSTS = [os.environ.get('RENDER_EXTERNAL_HOSTNAME')] if os.environ.get('RENDER_EXTERNAL_HOSTNAME') else []
CSRF_TRUSTED_ORIGINS = [f"https://{os.environ.get('RENDER_EXTERNAL_HOSTNAME')}"] if os.environ.get('RENDER_EXTERNAL_HOSTNAME') else []

# CORS settings for frontend
CORS_ALLOWED_ORIGINS = [
    "https://airbnb-clone-2-ogpo.onrender.com",
]
CORS_ALLOW_CREDENTIALS = True

DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY')

# Frontend URL for Cashfree redirects
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://airbnb-clone-2-ogpo.onrender.com')


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ.get('DATABASE_URL'),
        conn_max_age=600, 
        conn_health_checks=True
    )
}

# Cloudinary configuration for production
INSTALLED_APPS += [
    'cloudinary',
    'cloudinary_storage',
]

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

