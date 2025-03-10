"""
THESE ARE THE SETTINGS FOR STAGING AND PRODUCTION ENVIRONMENT ONLY. 
DO NOT ALTER THESE SETTINGS UNLESS SPECIFICALLY MEANT FOR STAGING OR PRODUCTION ENVIRONMENT OR YOU WILL BE FIRED!
"""

from .shared import *
import dj_database_url

# SECURITY WARNING: don't run with debug turned on in production!
# TODO: set to False later
DEBUG = True


DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600
    )
}


"""
THESE ARE THE SETTINGS FOR STAGING AND PRODUCTION ENVIRONMENT ONLY. 
DO NOT ALTER THESE SETTINGS UNLESS SPECIFICALLY MEANT FOR STAGING OR PRODUCTION ENVIRONMENT
"""


