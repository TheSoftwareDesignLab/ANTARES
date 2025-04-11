from pydantic import BaseSettings, Field


class AntaresSettings(BaseSettings):
    """
    Application-level configuration for the Antares Python client.
    Supports environment variables and `.env` file loading.
    """

    base_url: str = Field(..., env="ANTARES_BASE_URL")
    tcp_host: str = Field("localhost", env="ANTARES_TCP_HOST")
    tcp_port: int = Field(9000, env="ANTARES_TCP_PORT")
    timeout: float = Field(5.0, env="ANTARES_TIMEOUT")
    auth_token: str | None = Field(None, env="ANTARES_AUTH_TOKEN")

    class Config:
        env_file = ".env"
        case_sensitive = False
