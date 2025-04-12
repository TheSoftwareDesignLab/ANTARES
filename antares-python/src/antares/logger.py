import logging
from pathlib import Path

from rich.logging import RichHandler


def setup_logging(log_file: str = "antares.log", level: int = logging.INFO) -> None:
    """Configure logging to both rich console and a file."""
    Path(log_file).parent.mkdir(parents=True, exist_ok=True)

    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="[%Y-%m-%d %H:%M:%S]",
        handlers=[
            RichHandler(rich_tracebacks=True, show_path=False),
            logging.FileHandler(log_file, encoding="utf-8"),
        ],
    )
