# Antares Python Client

[![CI](https://github.com/TheSoftwareDesignLab/ANTARES/actions/workflows/python-ci.yml/badge.svg)](https://github.com/TheSoftwareDesignLab/ANTARES/actions/workflows/python-ci.yml)
[![codecov](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/TheSoftwareDesignLab/ANTARES)
[![PyPI version](https://img.shields.io/pypi/v/antares-python.svg)](https://pypi.org/project/antares-python/)
[![License](https://img.shields.io/github/license/TheSoftwareDesignLab/ANTARES)](LICENSE)

> ✨ A modern Python interface for the Antares simulation engine ✨

Antares Python Client is a developer-friendly library and CLI tool that allows you to interact with the Antares simulation engine via HTTP and TCP protocols.

- Provides a high-level Python API to control the simulation
- Automatically maps Python objects to Antares-native requests
- Supports configuration via `.env` and `.toml` files
- Offers a CLI for scripting and manual control
- Built with Pydantic 2, Typer, and fully type-annotated

Inspired by tools like PySpark, this library acts as a thin but powerful façade over the Antares backend.


## 🌟 Features

- Add ships with complex motion patterns to the simulation
- Subscribe to live simulation events over TCP
- Launch the Antares binary locally with config
- Configure everything via `.env` or `.toml`
- Clean CLI with rich output and JSON support


## 🚀 Installation

### Requirements

- Python >= 3.13 (tested with 3.13)
- `uv` for isolated dev environments

### Install from PyPI

```bash
pip install antares-python
```

### Install in editable mode (for development)

```bash
git clone https://github.com/TheSoftwareDesignLab/ANTARES.git
cd ANTARES/antares-python
uv venv
source .venv/bin/activate
uv pip install -e .
```


## 🚧 CLI Usage (`antares-cli`)

After installing, the CLI tool `antares-cli` becomes available.

### Available Commands

| Command       | Description                                      |
|---------------|--------------------------------------------------|
| `add-ship`    | Add a ship with specific motion type             |
| `reset`       | Reset the simulation                             |
| `subscribe`   | Subscribe to simulation event stream             |
| `start`       | Start the Antares binary with optional config    |

### Common Options

| Option        | Description                                     |
|---------------|-------------------------------------------------|
| `--config`    | Path to `.toml` config file                     |
| `--verbose`   | Enable detailed output                          |
| `--json`      | Output results in JSON format                   |

Example:

```bash
antares-cli add-ship --type line --x 0 --y 0 --angle 0.5 --speed 5.0
```


## 📚 Python Usage Example

```python
import asyncio
from antares.client import AntaresClient
from antares.models.ship import LineShip, CircleShip, RandomShip, StationaryShip
from antares.models.track import Track


async def main():
    # Create the Antares client using environment config or .env file
    client = AntaresClient()

    # Define ships of each supported type
    ships = [
        StationaryShip(initial_position=(0.0, 0.0), type="stationary"),
        RandomShip(initial_position=(10.0, -10.0), max_speed=15.0, type="random"),
        CircleShip(initial_position=(-30.0, 20.0), radius=25.0, speed=3.0, type="circle"),
        LineShip(initial_position=(5.0, 5.0), angle=0.78, speed=4.0, type="line"),
    ]

    # Add each ship to the simulation
    for ship in ships:
        client.add_ship(ship)
        print(f"✅ Added {ship.type} ship at {ship.initial_position}")

    print("\n📡 Subscribing to simulation events...\n")

    # Listen to simulation events (TCP stream)
    async for event in client.subscribe():
        if isinstance(event, Track):
            print(
                f"📍 Track #{event.id} - {event.name} at ({event.lat}, {event.long}) → {event.speed} m/s"
            )


if __name__ == "__main__":
    # Run the main async function
    asyncio.run(main())
```


## 🧭 Ship Types

Ships are classified based on their motion pattern. The `type` field determines which parameters are required. Here's a summary:

| Type        | Required Fields                            | Description                                 |
|-------------|---------------------------------------------|---------------------------------------------|
| `stationary`| `initial_position`                          | Does not move at all                        |
| `random`    | `initial_position`, `max_speed`             | Moves randomly, up to a max speed           |
| `circle`    | `initial_position`, `radius`, `speed`       | Moves in a circular pattern                 |
| `line`      | `initial_position`, `angle`, `speed`        | Moves in a straight line                    |

Each ship type corresponds to a specific Pydantic model:

- `StationaryShip`
- `RandomShip`
- `CircleShip`
- `LineShip`

You can also use the generic `ShipConfig` union to parse from dynamic input like TOML or JSON.


## ⚙️ Configuration

The client supports two configuration methods:

### `.env` File

The `.env` file allows you to define environment variables:

```dotenv
ANTARES_CONTROLLER_BIND_ADDR=0.0.0.0:17394
ANTARES_RADAR_BIND_ADDR=0.0.0.0:17396
ANTARES_TIMEOUT=5.0
```

➡️ See `template.env` for a complete example.

### `.toml` Config File

To configure the client and ships via a TOML file:

```toml
[antares.radar]
bind_addr = "0.0.0.0:17396"

[antares.radar.detector]
range = 1000.0
speed = 0.0
angle = 0.0
start_coordinates = [4.0, -72.0]

[antares.radar.broadcast]
type = "tcp"

[antares.simulation]
emission_interval = 20
controller_bind_addr = "0.0.0.0:17394"

[[antares.simulation.initial_ships]]
type = "line"
initial_position = [0.0, 0.0]
angle = 0.785
speed = 5.0

[[antares.simulation.initial_ships]]
type = "circle"
initial_position = [30.0, -30.0]
radius = 20.0
speed = 4.0

[[antares.simulation.initial_ships]]
type = "random"
initial_position = [-20.0, 20.0]
max_speed = 10.0

[[antares.simulation.initial_ships]]
type = "stationary"
initial_position = [50.0, 50.0]
```

➡️ See `config.example.toml` for a full working example.

You can pass the config to any CLI command with:

```bash
antares-cli add-ship --config path/to/config.toml
```

Or use it in Python with:

```python
from antares.config_loader import load_config
settings = load_config("config.toml")
```

## 🧪 Development & Testing

This project uses modern Python tooling for fast, isolated, and productive workflows.

### Setup

```bash
uv venv
source .venv/bin/activate
uv pip install -e .[dev]
```

### Available Tasks (via [`task`](https://taskfile.dev))

| Task           | Description                                 |
|----------------|---------------------------------------------|
| `task check`   | Run linters (ruff, mypy) and formatter check |
| `task test`    | Run full test suite                         |
| `task format`  | Auto-format code with ruff + black          |
| `task build`   | Build the wheel and source dist             |
| `task publish` | Publish to PyPI (requires version bump)     |

### Run tests manually

```bash
pytest
```

### View test coverage

```bash
pytest --cov=antares --cov-report=term-missing
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

