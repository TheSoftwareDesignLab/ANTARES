# Naval Radar - Simulator

The Naval Radar Simulator is a robust project designed to simulate radar systems, generate radar data, and emulate real-world scenarios involving radar detection and tracking.

## **Features**

- **Configurable Radar Simulation**:
  - Define radar parameters like range, resolution, and target detection.
- **Dynamic Simulation**:
  - Simulates target movements (linear, random, circular, stationary) and environmental effects.
- **Communication Protocol**:
  - Implements TCP interfaces for communication between radar components.
- **Realistic Tracking**:
  - Includes tracking algorithms for managing targets.

## **Setup Instructions**

1. **Install Rust**
   Make sure you have Rust and cargo installed. If not, you can install them following the instructions on the [Rust website](https://www.rust-lang.org/tools/install).

2. **Go to the Project Directory**

   ```bash
   cd naval-radar-simulator
   ```

3. **Build the Project**
   There are 2 ways to build the project:

   - **Development Build**:
     ```bash
     cargo build
     ```
   - **Release Build**:
     ```bash
     cargo build --release
     ```

   It is recommended to use the release build for better performance. Use the development build for debugging and testing.

4. **Run the Simulator**
   Run the simulator with a configuration file:

   For the release build:

   ```bash
    ./target/release/naval-radar-simulator <config-file>
   ```

   For the development build:

   ```bash
   cargo run -- <config-file>
   ```

   Replace `<config-file>` with the path to your TOML configuration file.

## **Configuration File**

The simulator uses a TOML configuration file to define settings such as radar range, simulation parameters, and environment details. A sample configuration file might look like this:

```toml
[radar]

[radar.protocol]
host = "0.0.0.0"
num_workers_tci = 1
num_workers_tdi = 1

[radar.detector]
range = 100.0
speed = 10.0
angle = 0.0
start_coordinates = [4.0, -72.0]

[simulation]
emission_interval = 20

[simulation.ships]
line = [{ initial_position = [-50.0, 50.0], angle = 0.785, speed = 5.0 }]
circle = [{ initial_position = [50.0, -50.0], radius = 20.0, speed = 5.0 }]
random = [{ initial_position = [-50.0, -50.0], max_speed = 20.0 }]
stationary = [{ initial_position = [50.0, 50.0] }]
```

## **Directory Structure**

The directory structure organizes the project for clarity and scalability:

```plaintext
src
├── config.rs           # Manages configuration structures and settings
├── controller.rs       # Manages the Controller struct, starting the radar and simulation
├── lib.rs              # Main library file with module definitions
├── main.rs             # Entry point for the simulator
├── radar/              # Radar simulation logic
│   ├── config.rs       # Configuration for radar-specific settings
│   ├── detector/       # Radar detection logic
│   │   ├── detector.rs # Core detection algorithms
│   │   ├── mod.rs      # Detector module entry point
│   │   └── plot.rs     # Handles radar plot generation
│   ├── mod.rs          # Radar module entry point
│   ├── protocol/       # Radar communication protocol
│   │   ├── constants/  # Constants used in protocol definitions
│   │   │   ├── client_command.rs
│   │   │   ├── error_message.rs
│   │   │   ├── interface_ports.rs
│   │   │   ├── mod.rs
│   │   │   └── server_command.rs
│   │   ├── mod.rs      # Protocol module entry point
│   │   └── tcp_interfaces/
│   │       ├── base_track_interface.rs
│   │       ├── mod.rs
│   │       ├── track_control_interface.rs
│   │       └── track_data_interface.rs
│   ├── radar.rs        # Core radar logic
│   └── tracker/        # Radar tracking algorithms
│       ├── mod.rs
│       ├── track.rs
│       └── tracker.rs
├── simulation/         # Simulation logic for the radar
│   ├── config.rs       # Configuration for the simulation module
│   ├── emitters/       # Handles simulated emitters like ships or targets
│   │   ├── emitter.rs
│   │   ├── mod.rs
│   │   └── ship.rs
│   ├── environment/    # Simulated environmental effects
│   │   ├── mod.rs
│   │   └── wave.rs
│   ├── mod.rs          # Simulation module entry point
│   ├── movement/       # Movement strategies for targets
│   │   ├── circle.rs
│   │   ├── line.rs
│   │   ├── mod.rs
│   │   ├── random.rs
│   │   ├── stationary.rs
│   │   └── strategy.rs
│   └── simulation.rs   # Core simulation logic
└── utils/              # Utility functions and reusable structures
    ├── escape_ascii.rs # ASCII character processing utilities
    ├── mod.rs          # Utils module entry point
    └── thread_pool.rs  # Thread pool implementation for concurrency
```

## **Other Dependencies**

- **`chrono`**: Handles date and time functionality.
- **`rand`**: Generates random numbers for simulation randomness.
- **`serde` and `serde_derive`**: Serializes and deserializes data structures.
- **`toml`**: Parses TOML configuration files.
- **`std::thread`**: For multi-threaded processing.
