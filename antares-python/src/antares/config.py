from pydantic_settings import BaseSettings, SettingsConfigDict


class AntaresSettings(BaseSettings):
    """
    Application-level configuration for the Antares Python client.
    Supports environment variables and `.env` file loading.
    """

    controller_bind_addr: str = "0.0.0.0:17394"
    radar_bind_addr: str = "0.0.0.0:17396"
    timeout: float = 5.0

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="antares_",
        case_sensitive=False,
    )
