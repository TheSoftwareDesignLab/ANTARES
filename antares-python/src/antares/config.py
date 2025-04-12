from pydantic_settings import BaseSettings, SettingsConfigDict


class AntaresSettings(BaseSettings):
    """
    Application-level configuration for the Antares Python client.
    Supports environment variables and `.env` file loading.
    """

    host: str = "localhost"
    http_port: int = 9000
    tcp_port: int = 9001
    timeout: float = 5.0
    auth_token: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="antares_",
        case_sensitive=False,
    )
