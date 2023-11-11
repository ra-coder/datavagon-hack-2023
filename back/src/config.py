from typing import Literal

from pydantic import BaseSettings, Extra, SecretStr


class Settings(BaseSettings):
    # All variables MUST have possibility to be overwritten by environment variables
    DB_DSN: SecretStr = SecretStr("")
    PORT: int = 8000  # Used only in local development
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    DEBUG: bool = False

    class Config:
        case_sensitive = True
        extra = Extra.ignore


settings = Settings()
