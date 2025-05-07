from pathlib import Path

import tomli

from antares.config import AntaresSettings


def load_config(path: str | Path | None = None) -> AntaresSettings:
    """Loads AntaresSettings from a TOML config file or defaults to .env + env vars."""
    if path is None:
        return AntaresSettings()

    config_path = Path(path).expanduser()
    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with config_path.open("rb") as f:
        data = tomli.load(f)

    return AntaresSettings(
        controller_bind_addr=data.get("antares.simulation.controller_bind_addr", "0.0.0.0:17394"),
        radar_bind_addr=data.get("antares.simulation.radar_bind_addr", "0.0.0.0:17396"),
    )
