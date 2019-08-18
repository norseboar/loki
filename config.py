import os


class Config(object):
    ENV = None
    DEBUG = False
    API_KEY = os.environ['LOKI_API_KEY']
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    TESTING = False


class ProductionConfig(Config):
    ENV = 'production'


class StageConfig(Config):
    DEBUG = True
    ENV = 'stage'
    TESTING = True


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'
    TESTING = True
