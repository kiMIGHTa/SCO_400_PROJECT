from datetime import timedelta
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-&r6eebgukc7az&*gsb4bl1wg357-1921r$bulo9xw5v_l%y'

# SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173","http://localhost:5174",  # Vite default port
]

CORS_ALLOW_CREDENTIALS = True  # Allow cookies for authentication


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_daraja',
    'django_extensions',



    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    "rest_framework_simplejwt.token_blacklist",

    'v1',
    'users',
    'restaurant',
    'food',
    'cart',
    'order',
    'payment',
]

AUTH_USER_MODEL = "users.CustomUser"

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
}


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'CORE.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'CORE.wsgi.application'

# Email SMTP Configuration
# settings.py (Temporary for testing)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'kimaitaduzit@gmail.com'  # Your Gmail
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')  # 16-char app password from .env
DEFAULT_FROM_EMAIL = 'kimaitaduzit@gmail.com'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
# EMAIL_HOST = 'smtp-relay.brevo.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = '88fa46003@smtp-brevo.com'  # Your SMTP login
# EMAIL_HOST_PASSWORD = 'v0c17CTzIjpV4WBQ'  # Your SMTP password
# DEFAULT_FROM_EMAIL = 'notifications@brevo.com'  # Pre-verified sender
# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases



# Replace the SQLite DATABASES configuration with PostgreSQL:



# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static")]

# # This production code might break development mode, so we check whether we're in DEBUG mode
# if not DEBUG:
#     # Tell Django to copy static assets into a path called `staticfiles` (this is specific to Render)
#     STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
#     # Enable the WhiteNoise storage backend, which compresses static files to reduce disk use
#     # and renames the files with unique names for each version to support long-term caching
#     STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


MEDIA_URL = "/media/"
MEDIA_ROOT = os.path.join(BASE_DIR, "media")

# === M-Pesa Daraja API Config ===
# MPESA_CONFIG = {
#     "CONSUMER_KEY": os.getenv("MPESA_CONSUMER_KEY"),
#     "CONSUMER_SECRET": os.getenv("MPESA_CONSUMER_SECRET"),
#     "SHORTCODE": os.getenv("MPESA_SHORTCODE"),
#     "PASSKEY": os.getenv("MPESA_PASSKEY"),
#     "CALLBACK_URL": os.getenv("MPESA_CALLBACK_URL"),
#     "BASE_URL": os.getenv("MPESA_BASE_URL"),
#     "ACCESS_TOKEN_URL": os.getenv("MPESA_ACCESS_TOKEN_URL"),
#     "STK_PUSH_URL": os.getenv("MPESA_STK_PUSH_URL"),
#     "STK_QUERY_URL": os.getenv("MPESA_STK_QUERY_URL"),
# }