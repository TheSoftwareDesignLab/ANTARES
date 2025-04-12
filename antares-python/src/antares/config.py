from pydantic_settings import BaseSettings, SettingsConfigDict


class AntaresSettings(BaseSettings):
    """
    Application-level configuration for the Antares Python client.
    Supports environment variables and `.env` file loading.
    """

    base_url: str = "http://localhost:8000"
    tcp_host: str = "localhost"
    tcp_port: int = 9000
    timeout: float = 5.0
    auth_token: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="antares_",
        case_sensitive=False,
    )
