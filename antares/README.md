# Antares Simulator

**Antares** is a high-performance simulation engine for naval radar scenarios, written in Rust. It generates dynamic environments with ships, emitters, and wave conditions, and feeds simulated radar data to subscribers via TCP and WebSocket. The simulator is designed for modular experimentation, real-time control, and seamless integration with visualization tools such as [Antares Web](https://thesoftwaredesignlab.github.io/ANTARES/antares-web).

## Prerequisites

Make sure you have [Rust](https://www.rust-lang.org/tools/install) installed. You can install Rust and Cargo using:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Running the Simulator

To launch the simulator with the default settings:

```bash
cargo run
```

To run the simulator with a custom configuration:

```bash
cargo run -- --config path/to/config.toml
```

You can use `config.example.toml` as a starting point.

## Building for Release

For optimized builds suitable for production or deployment:

```bash
cargo build --release
```

## Project Structure

```
antares/
├── src/                     # Source code
│   ├── config.rs            # Global configuration loader
│   ├── controller.rs        # Simulation runtime controller
│   ├── main.rs              # Entry point
│   ├── radar/               # Radar logic and broadcasting
│   │   ├── detector/        # Radar detection and plotting
│   │   ├── tracker/         # Track generation and filtering
│   │   ├── broadcaster/     # Data output via TCP/WebSocket
│   ├── simulation/          # Simulation models
│   │   ├── emitters/        # Emitter and ship definitions
│   │   ├── environment/     # Environmental effects (e.g. waves)
│   │   ├── movement/        # Movement patterns and strategies
│   │   └── simulation.rs    # Simulation loop
├── Cargo.toml               # Project metadata and dependencies
└── Cargo.lock               # Version lockfile
```

## Learn More

For demos, examples, and system overview, visit the official platform website:
👉 [https://thesoftwaredesignlab.github.io/ANTARES/antares-simulator](https://thesoftwaredesignlab.github.io/ANTARES/antares-simulator)

