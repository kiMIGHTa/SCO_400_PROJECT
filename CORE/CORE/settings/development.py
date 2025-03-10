"""
THESE ARE THE SETTINGS FOR DEVELOPMENT ENVIRONMENT ONLY. 

THIS FILE CAN BE ALTERED TO FIT YOUR DEV NEEDS.
"""

from .shared import *


DEBUG = True

ALLOWED_HOSTS = ["*"]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

