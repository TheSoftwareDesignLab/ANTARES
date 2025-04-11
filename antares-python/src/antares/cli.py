import asyncio
import json
import logging

import typer
from rich.console import Console
from rich.theme import Theme

from antares import AntaresClient, ShipConfig
from antares.config_loader import load_config
from antares.errors import ConnectionError, SimulationError, SubscriptionError
from antares.logger import setup_logging

app = typer.Typer(name="antares", help="Antares CLI for ship simulation", no_args_is_help=True)
console = Console(theme=Theme({"info": "green", "warn": "yellow", "error": "bold red"}))


def handle_error(message: str, code: int, json_output: bool = False):
    logger = logging.getLogger("antares.cli")
    if json_output:
        typer.echo(json.dumps({"error": message}), err=True)
    else:
        console.print(f"[error]{message}")
    logger.error("Exiting with error: %s", message)
    raise typer.Exit(code)


def build_client(config_path: str | None, verbose: bool, json_output: bool) -> AntaresClient:
    setup_logging(level=logging.DEBUG if verbose else logging.INFO)
    logger = logging.getLogger("antares.cli")

    try:
        settings = load_config(config_path)
        if verbose:
            console.print(f"[info]Using settings: {settings.model_dump()}")
            logger.debug("Loaded settings: %s", settings.model_dump())
        return AntaresClient(
            base_url=settings.base_url,
            tcp_host=settings.tcp_host,
            tcp_port=settings.tcp_port,
            timeout=settings.timeout,
            auth_token=settings.auth_token,
        )
    except Exception as e:
        handle_error(f"Failed to load configuration: {e}", code=1, json_output=json_output)


@app.command()
def reset(
    config: str = typer.Option(None),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
):
    client = build_client(config, verbose, json_output)
    try:
        client.reset_simulation()
        msg = "✅ Simulation reset."
        typer.echo(json.dumps({"message": msg}) if json_output else msg)
    except (ConnectionError, SimulationError) as e:
        handle_error(str(e), code=2, json_output=json_output)


@app.command()
def add_ship(
    x: float = typer.Option(..., help="X coordinate of the ship"),
    y: float = typer.Option(..., help="Y coordinate of the ship"),
    config: str = typer.Option(None, help="Path to the configuration file"),
    verbose: bool = typer.Option(False, "--verbose", "-v", help="Enable verbose output"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
):
    client = build_client(config, verbose, json_output)
    try:
        ship = ShipConfig(initial_position=(x, y))
        client.add_ship(ship)
        msg = f"🚢 Added ship at ({x}, {y})"
        typer.echo(json.dumps({"message": msg}) if json_output else msg)
    except (ConnectionError, SimulationError) as e:
        handle_error(str(e), code=2, json_output=json_output)


@app.command()
def subscribe(
    config: str = typer.Option(None),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
    json_output: bool = typer.Option(False, "--json", help="Output in JSON format"),
    log_file: str = typer.Option("antares.log", help="Path to log file"),
):
    setup_logging(log_file=log_file, level=logging.DEBUG if verbose else logging.INFO)
    logger = logging.getLogger("antares.cli")

    client = build_client(config, verbose, json_output)

    async def _sub():
        try:
            async for event in client.subscribe():
                if json_output:
                    typer.echo(json.dumps(event))
                else:
                    console.print_json(data=event)
                logger.debug("Received event: %s", event)
        except SubscriptionError as e:
            handle_error(str(e), code=3, json_output=json_output)

    asyncio.run(_sub())
