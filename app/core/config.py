import os
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "postgresql+psycopg2://postgres:password@db:5432/recruitdb"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3001")
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", "30")
    )
    PASSWORD_RESET_URL_BASE: str = os.getenv("PASSWORD_RESET_URL_BASE", FRONTEND_URL)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "no-reply@careercoachai.local")
    SMTP_FROM_NAME: str = os.getenv("SMTP_FROM_NAME", "CareerCoachAI")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() not in {
        "0",
        "false",
        "no",
        "off",
    }
    AI_PRIMARY_PROVIDER: str = os.getenv("AI_PRIMARY_PROVIDER", "gemini")
    AI_FALLBACK_PROVIDER: str = os.getenv("AI_FALLBACK_PROVIDER", "ollama")
    AI_HEAVY_PROVIDERS: str = os.getenv("AI_HEAVY_PROVIDERS", "gemini,ollama")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL_NAME: str = os.getenv("GEMINI_MODEL_NAME", "gemini-2.5-flash")
    GEMINI_API_URL: str = os.getenv(
        "GEMINI_API_URL",
        "https://generativelanguage.googleapis.com/v1beta",
    )
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
    OLLAMA_MODEL_NAME: str = os.getenv("OLLAMA_MODEL_NAME", "llama3.2")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads/resumes")

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
