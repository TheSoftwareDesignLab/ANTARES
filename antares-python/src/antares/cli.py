import asyncio

import typer
from rich.console import Console
from rich.theme import Theme

from antares import AntaresClient, ShipConfig
from antares.config_loader import load_config

app = typer.Typer(help="Antares Simulation CLI")

console = Console(
    theme=Theme(
        {
            "info": "green",
            "warn": "yellow",
            "error": "bold red",
        }
    )
)


def build_client(config_path: str | None, verbose: bool) -> AntaresClient:
    settings = load_config(config_path)

    if verbose:
        console.print(f"[info]Using settings: {settings.model_dump()}")

    return AntaresClient(
        base_url=settings.base_url,
        tcp_host=settings.tcp_host,
        tcp_port=settings.tcp_port,
        timeout=settings.timeout,
        auth_token=settings.auth_token,
    )


@app.command()
def reset(
    config: str = typer.Option(None, help="Path to config TOML file"),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
):
    """Reset the simulation."""
    client = build_client(config, verbose)
    client.reset_simulation()
    console.print("[info]✅ Simulation reset.")


@app.command()
def add_ship(
    x: float,
    y: float,
    config: str = typer.Option(None, help="Path to config TOML file"),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
):
    """Add a ship to the simulation at (x, y)."""
    client = build_client(config, verbose)
    ship = ShipConfig(initial_position=(x, y))
    client.add_ship(ship)
    console.print(f"[info]🚢 Added ship at ({x}, {y})")


@app.command()
def subscribe(
    config: str = typer.Option(None, help="Path to config TOML file"),
    verbose: bool = typer.Option(False, "--verbose", "-v"),
):
    """Subscribe to simulation data stream."""
    client = build_client(config, verbose)

    async def _sub():
        async for event in client.subscribe():
            console.print_json(data=event)

    asyncio.run(_sub())


if __name__ == "__main__":
    app()
