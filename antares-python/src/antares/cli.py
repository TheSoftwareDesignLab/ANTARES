import asyncio
import json
import logging
import shutil
import subprocess
from pathlib import Path
from typing import NoReturn

import typer
from pydantic import ValidationError
from rich.console import Console
from rich.theme import Theme

from antares import AntaresClient
from antares.config_loader import load_config
from antares.errors import ConnectionError, SimulationError, SubscriptionError
from antares.logger import setup_logging
from antares.models.ship import CircleShip, LineShip, RandomShip, ShipConfig, StationaryShip

app = typer.Typer(name="antares-cli", help="Antares CLI for ship simulation", no_args_is_help=True)
console = Console(theme=Theme({"info": "green", "warn": "yellow", "error": "bold red"}))


@app.command()
def start(
    executable: str = typer.Option("antares", help="Path to the Antares executable"),
    config: str | None = typer.Option(None, help="Path to the TOML configuration file"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose output"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
) -> None:
    """
    Start the Antares simulation engine in the background.

    This command attempts to locate and launch the Antares executable either from the system's PATH
    or from the provided path using the --executable option. If a config path is provided, it is
    passed to the executable via --config.

    This command does not use the Python client and directly invokes the native binary.
    """
    # Locate executable (either absolute path or in system PATH)
    path = shutil.which(executable) if not Path(executable).exists() else executable
    if path is None:
        msg = f"Executable '{executable}' not found in PATH or at specified location."
        console.print(f"[error]{msg}")
        raise typer.Exit(1)

    # Prepare command
    command = [path]
    if config:
        command += ["--config", config]

    if verbose:
        console.print(f"[info]Starting Antares with command: {command}")

    try:
        process = subprocess.Popen(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        msg = f"Failed to start Antares: {e}"
        if json_output:
            typer.echo(json.dumps({"error": msg}), err=True)
        else:
            console.print(f"[error]{msg}")
        raise typer.Exit(2) from e

    msg = f"Antares started in background with PID {process.pid}"
    if json_output:
        typer.echo(json.dumps({"message": msg, "pid": process.pid}))
    else:
        console.print(f"[success]{msg}")


@app.command()
def reset(
    config: str = typer.Option(None, help="Path to the TOML configuration file"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose output"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
) -> None:
    """
    Reset the current simulation state.
    """
    client = build_client(config, verbose, json_output)
    try:
        client.reset_simulation()
        msg = "✅ Simulation reset."
        typer.echo(json.dumps({"message": msg}) if json_output else msg)
    except (ConnectionError, SimulationError) as e:
        handle_error(str(e), code=2, json_output=json_output)


@app.command()
def add_ship(  # noqa: PLR0913
    type: str = typer.Option(..., help="Type of ship: 'line', 'circle', 'random', or 'stationary'"),
    x: float = typer.Option(..., help="Initial X coordinate of the ship"),
    y: float = typer.Option(..., help="Initial Y coordinate of the ship"),
    angle: float = typer.Option(None, help="(line) Movement angle in radians"),
    speed: float = typer.Option(None, help="(line/circle) Constant speed"),
    radius: float = typer.Option(None, help="(circle) Radius of the circular path"),
    max_speed: float = typer.Option(None, help="(random) Maximum possible speed"),
    config: str = typer.Option(None, help="Path to the TOML configuration file"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose output"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
) -> None:
    """
    Add a ship to the simulation, specifying its motion pattern and parameters.
    """
    client = build_client(config, verbose, json_output)

    base_args = {"initial_position": (x, y)}

    ship: ShipConfig | None = None
    try:
        if type == "line":
            ship = LineShip(**base_args, angle=angle, speed=speed)  # type: ignore[arg-type]
        elif type == "circle":
            ship = CircleShip(**base_args, radius=radius, speed=speed)  # type: ignore[arg-type]
        elif type == "random":
            ship = RandomShip(**base_args, max_speed=max_speed)  # type: ignore[arg-type]
        elif type == "stationary":
            ship = StationaryShip(**base_args)  # type: ignore[arg-type]
        else:
            raise ValueError(f"Invalid ship type: {type!r}")

    except (ValidationError, ValueError, TypeError) as e:
        handle_error(f"Invalid ship parameters: {e}", code=2, json_output=json_output)

    try:
        client.add_ship(ship)
        msg = f"🚢 Added {type} ship at ({x}, {y})"
        typer.echo(json.dumps({"message": msg}) if json_output else msg)
    except (ConnectionError, SimulationError) as e:
        handle_error(str(e), code=2, json_output=json_output)


@app.command()
def subscribe(
    config: str = typer.Option(None, help="Path to the TOML configuration file"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose output"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
    log_file: str = typer.Option("antares.log", help="Path to log file"),
) -> None:
    """
    Subscribe to simulation events and print them to the console.
    """
    setup_logging(log_file=log_file, level=logging.DEBUG if verbose else logging.INFO)
    logger = logging.getLogger("antares.cli")

    client = build_client(config, verbose, json_output)

    async def _sub() -> None:
        try:
            async for event in client.subscribe():
                if json_output:
                    typer.echo(event.model_dump_json())
                else:
                    console.print(f"[info]Received event: {event}")
                logger.debug("Received event: %s", event)
        except SubscriptionError as e:
            handle_error(str(e), code=3, json_output=json_output)

    asyncio.run(_sub())


def handle_error(message: str, code: int, json_output: bool = False) -> NoReturn:
    """
    Handle errors by logging and printing them to the console.
    """
    logger = logging.getLogger("antares.cli")
    if json_output:
        typer.echo(json.dumps({"error": message}), err=True)
    else:
        console.print(f"[error]{message}")
    logger.error("Exiting with error: %s", message)
    raise typer.Exit(code)


def build_client(config_path: str | None, verbose: bool, json_output: bool) -> AntaresClient:
    """
    Build the Antares client using the provided configuration file.
    """

    try:
        settings = load_config(config_path)
        if verbose:
            console.print(f"[info]Using settings: {settings.model_dump()}")
        return AntaresClient(
            controller_bind_addr=settings.controller_bind_addr,
            radar_bind_addr=settings.radar_bind_addr,
            timeout=settings.timeout,
        )
    except Exception as e:
        handle_error(f"Failed to load configuration: {e}", code=1, json_output=json_output)
