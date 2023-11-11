from pydantic import BaseSettings


class BaseFastAPISettings(BaseSettings):
    DEBUG: bool = False

    SENTRY_ENABLED: bool = True
    SENTRY_DSN: str = ""
    SENTRY_ENVIRONMENT: str = "local"
    SENTRY_TRACES_SAMPLE_RATE: float = 0.1
