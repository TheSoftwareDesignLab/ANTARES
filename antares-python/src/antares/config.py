from pydantic_settings import BaseSettings, SettingsConfigDict


class AntaresSettings(BaseSettings):
    """
    Application-level configuration for the Antares Python client.
    Supports environment variables and `.env` file loading.
    """

    base_url: str
    tcp_host: str = "localhost"
    tcp_port: int = 9000
    timeout: float = 5.0
    auth_token: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="ANTARES_",
        case_sensitive=False,
    )
