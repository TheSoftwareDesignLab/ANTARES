---
layout: page
toc: true
---

ANTARES is an open-source, software-based naval radar simulator. ANTARES is designed for seamless integration with other systems via the TCP protocol while also supporting standalone operation through a Graphical User Interface (GUI). It adheres to the open-closed design principle, facilitating easy extensibility with new simulation entities, such as naval vessel movement strategies. The simulator is implemented using the Rust programming language due to its advantages in performance, type safety, concurrency, and memory safety.

# 🚀 **Getting Started**

## **Installation and Setup**

To install ANTARES from source, follow these steps:

1. Install Rust and Cargo:
   - If you haven't already, install Rust and Cargo by following the instructions on the [Rust website](https://www.rust-lang.org/tools/install).
2. Clone the repository from GitHub and navigate to the project directory:
```bash
git clone https://github.com/TheSoftwareDesignLab/ANTARES.git
cd ANTARES
```
3. Build the project:
```bash
cargo build --release --manifest-path=naval-radar-simulator/Cargo.toml
```

Alternatively, you can download the compiled files from the project's repository.

## **Running the Simulator**

You will need a configuration file to run the simulator. The configuration file is in TOML format and defines the radar's parameters, simulation settings, and environment details. A sample configuration file is provided in the `config` directory. You can modify this file to suit your needs.
```toml
[radar]

[radar.protocol]
host = "0.0.0.0"
num_workers_tci = 4
num_workers_tdi = 4

[radar.detector]
range = 100.0
speed = 5.0
angle = 3.14
start_coordinates = [4.0, -72.0]

[simulation]
emission_interval = 20

[simulation.ships]
line = [{ initial_position = [-50.0, 50.0], angle=0.785, speed=5.0 }]
circle = [{ initial_position = [50.0, -50.0], radius=20.0, speed=5.0 }]
random = [{ initial_position = [-50.0, -50.0], max_speed=20.0 }]
stationary = [{ initial_position = [50.0, 50.0] }]
```

To run the simulator, use the following command:
```bash
naval-radar-simulator/target/release/naval-radar-simulator <config-file>
```
Replace `<config-file>` with the path to your TOML configuration file.

## **Running the GUI**

We need a reverse proxy to forward the TCP connection to the GUI through a websocket connection. Run the following commands in a new terminal to start the reverse proxy:
```bash
cd naval-radar-reverse-proxy
npm install
npm start
```

The reverse proxy will listen on port 8080 by default. You can change the port by modifying the `WEBSOCKET_PORT` variable in the `.env` file.

To run the GUI, use the following commands in a new terminal:

```bash
cd naval-radar-web-ui
npm install
npm run dev
```

The GUI will be available at `http://localhost:5173`

